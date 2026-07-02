"""Regras determinísticas de compatibilidade entre componentes.

Esta camada NÃO depende de IA: são verificações objetivas baseadas nos
atributos (`attrs`) dos componentes. Ela não pretende cobrir todo o mercado —
foi desenhada para crescer e, no futuro, receber catálogos de fornecedores
ou uma base externa de compatibilidade (veja ROADMAP.md).

Atributos esperados por categoria (todos opcionais, regras só rodam se existirem):
  - cpu:        socket, watts, tier (1-5), video_integrado (bool)
  - placa_mae:  socket, tipo_ram, form_factor, wifi (bool), bluetooth (bool)
  - ram:        tipo_ram, capacidade_gb
  - gpu:        watts, tier (1-5)
  - fonte:      watts
  - gabinete:   form_factors (lista de form factors suportados)
  - armazenamento: tipo (ssd_nvme | ssd_sata | hdd), capacidade_gb
"""

from dataclasses import dataclass, field

from app.models.catalogo import Component

# Margem de segurança da fonte: consumo estimado × 1,3
MARGEM_FONTE = 1.3

# Consumo base do restante do sistema (placa-mãe, RAM, SSD, ventoinhas...)
WATTS_BASE_SISTEMA = 80


@dataclass
class ResultadoCompatibilidade:
    """Resultado da análise: erros impedem a montagem, avisos pedem atenção."""

    erros: list[str] = field(default_factory=list)
    avisos: list[str] = field(default_factory=list)
    watts_estimados: int = 0

    @property
    def compativel(self) -> bool:
        return not self.erros


def _por_categoria(componentes: list[Component]) -> dict[str, list[Component]]:
    agrupado: dict[str, list[Component]] = {}
    for c in componentes:
        agrupado.setdefault(c.categoria.slug, []).append(c)
    return agrupado


def estimar_consumo(componentes: list[Component]) -> int:
    """Estima o consumo total em watts a partir dos atributos conhecidos."""
    watts = WATTS_BASE_SISTEMA
    for c in componentes:
        if c.categoria.slug in ("cpu", "gpu"):
            watts += int(c.attrs.get("watts", 0))
    return watts


def verificar(componentes: list[Component]) -> ResultadoCompatibilidade:
    """Aplica as regras de compatibilidade sobre uma lista de componentes."""
    resultado = ResultadoCompatibilidade()
    grupos = _por_categoria(componentes)

    cpus = grupos.get("cpu", [])
    placas = grupos.get("placa_mae", [])
    rams = grupos.get("ram", [])
    gpus = grupos.get("gpu", [])
    fontes = grupos.get("fonte", [])
    gabinetes = grupos.get("gabinete", [])

    # Notebooks são produtos fechados: as regras de montagem não se aplicam.
    if grupos.get("notebook"):
        resultado.avisos.append(
            "Notebook é um produto fechado — compatibilidade validada pelo fabricante."
        )
        return resultado

    # Regra 1: socket da CPU deve bater com o socket da placa-mãe.
    if cpus and placas:
        socket_cpu = cpus[0].attrs.get("socket")
        socket_placa = placas[0].attrs.get("socket")
        if socket_cpu and socket_placa and socket_cpu != socket_placa:
            resultado.erros.append(
                f"Processador ({socket_cpu}) incompatível com a placa-mãe ({socket_placa})."
            )

    # Regra 2: tipo de memória deve bater com o suportado pela placa-mãe.
    if rams and placas:
        tipo_placa = placas[0].attrs.get("tipo_ram")
        for ram in rams:
            tipo_ram = ram.attrs.get("tipo_ram")
            if tipo_ram and tipo_placa and tipo_ram != tipo_placa:
                resultado.erros.append(
                    f"Memória {tipo_ram} incompatível com a placa-mãe (suporta {tipo_placa})."
                )

    # Regra 3: fonte deve suportar o consumo estimado com margem de segurança.
    resultado.watts_estimados = estimar_consumo(componentes)
    if fontes:
        watts_fonte = int(fontes[0].attrs.get("watts", 0))
        minimo = int(resultado.watts_estimados * MARGEM_FONTE)
        if watts_fonte and watts_fonte < minimo:
            resultado.erros.append(
                f"Fonte de {watts_fonte} W abaixo do recomendado "
                f"({minimo} W para consumo estimado de {resultado.watts_estimados} W)."
            )
    elif cpus:
        resultado.avisos.append("Nenhuma fonte selecionada para esta configuração.")

    # Regra 4: o gabinete precisa suportar o form factor da placa-mãe.
    if gabinetes and placas:
        suportados = gabinetes[0].attrs.get("form_factors", [])
        form_factor = placas[0].attrs.get("form_factor")
        if form_factor and suportados and form_factor not in suportados:
            resultado.erros.append(
                f"Gabinete não suporta placas {form_factor} (suporta: {', '.join(suportados)})."
            )

    # Regra 5: sem GPU dedicada, o processador precisa ter vídeo integrado.
    if cpus and not gpus:
        if not cpus[0].attrs.get("video_integrado", False):
            resultado.erros.append(
                "Configuração sem placa de vídeo exige processador com vídeo integrado."
            )

    return resultado


def recomendar_por_uso(perfil: dict, requisitos: dict) -> list[str]:
    """Gera avisos quando a build entrega menos do que o perfil de uso exige.

    `perfil` = demanda calculada do cliente; `requisitos` = o que a build entrega.
    Ambos no formato {"cpu_tier": int, "gpu_tier": int, "ram_gb": int, "ssd_gb": int}.
    """
    avisos: list[str] = []
    if requisitos.get("gpu_tier", 0) < perfil.get("gpu_tier", 0):
        avisos.append(
            "A placa de vídeo desta configuração fica abaixo do ideal para o uso informado."
        )
    if requisitos.get("ram_gb", 0) < perfil.get("ram_gb", 0):
        avisos.append(
            f"Para o seu uso, o ideal seria {perfil['ram_gb']} GB de memória — "
            "vale considerar um upgrade."
        )
    if requisitos.get("cpu_tier", 0) < perfil.get("cpu_tier", 0):
        avisos.append("O processador pode limitar tarefas mais pesadas do seu dia a dia.")
    if requisitos.get("ssd_gb", 0) < perfil.get("ssd_gb", 0):
        avisos.append("O armazenamento pode ficar apertado — considere um SSD maior.")
    return avisos
