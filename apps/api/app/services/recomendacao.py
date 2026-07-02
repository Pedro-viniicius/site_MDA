"""Motor de recomendação híbrido.

Fluxo em três camadas (a IA nunca decide sozinha):
  1. Determinística: respostas → perfil de demanda (tiers de CPU/GPU, RAM, SSD)
     → pontuação das builds ativas → melhor build dentro do orçamento.
  2. Compatibilidade: regras objetivas geram avisos/erros (compatibilidade.py).
  3. IA (ou mock): apenas explica o resultado em linguagem humana (ia/).
"""

from dataclasses import dataclass
from decimal import Decimal
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.catalogo import BuildComponent, Component, PreconfiguredBuild
from app.models.onboarding import OnboardingSession
from app.models.recomendacao import RecommendationResult
from app.services import compatibilidade
from app.services.ia import obter_provedor
from app.services.ia.base import DadosRecomendacao

# ---------------------------------------------------------------------------
# 1. Demanda por uso: quanto cada atividade exige de máquina.
#    Tiers de 1 (básico) a 5 (topo); gpu_tier 0 = vídeo integrado resolve.
# ---------------------------------------------------------------------------
DEMANDA_POR_USO: dict[str, dict[str, int]] = {
    "uso_diario":         {"cpu_tier": 1, "gpu_tier": 0, "ram_gb": 8,  "ssd_gb": 256},
    "estudos":            {"cpu_tier": 2, "gpu_tier": 0, "ram_gb": 8,  "ssd_gb": 256},
    "trabalho_escritorio": {"cpu_tier": 2, "gpu_tier": 0, "ram_gb": 8,  "ssd_gb": 256},
    "planilhas_dados":    {"cpu_tier": 3, "gpu_tier": 0, "ram_gb": 16, "ssd_gb": 512},
    "programacao":        {"cpu_tier": 3, "gpu_tier": 0, "ram_gb": 16, "ssd_gb": 512},
    "gestao_negocio":     {"cpu_tier": 2, "gpu_tier": 0, "ram_gb": 8,  "ssd_gb": 512},
    "jogos":              {"cpu_tier": 3, "gpu_tier": 3, "ram_gb": 16, "ssd_gb": 512},
    "design_grafico":     {"cpu_tier": 3, "gpu_tier": 2, "ram_gb": 16, "ssd_gb": 512},
    "edicao_video":       {"cpu_tier": 4, "gpu_tier": 3, "ram_gb": 32, "ssd_gb": 1000},
    "modelagem_3d_cad":   {"cpu_tier": 4, "gpu_tier": 4, "ram_gb": 32, "ssd_gb": 1000},
    "streaming":          {"cpu_tier": 4, "gpu_tier": 3, "ram_gb": 16, "ssd_gb": 512},
    "ia_dados":           {"cpu_tier": 5, "gpu_tier": 4, "ram_gb": 32, "ssd_gb": 1000},
}

# Ajuste por intensidade declarada: uso intenso sobe a régua, leve desce.
AJUSTE_INTENSIDADE = {"leve": -1, "medio": 0, "pesado": 1}

# Softwares conhecidos → uso implícito (deixa a demanda mais precisa mesmo
# quando o cliente não marcou o uso correspondente).
SOFTWARE_PARA_USO: dict[str, str] = {
    "office_excel": "trabalho_escritorio",
    "power_bi": "planilhas_dados",
    "canva": "design_grafico",
    "photoshop": "design_grafico",
    "illustrator": "design_grafico",
    "premiere": "edicao_video",
    "davinci": "edicao_video",
    "autocad": "modelagem_3d_cad",
    "revit": "modelagem_3d_cad",
    "sketchup": "modelagem_3d_cad",
    "blender": "modelagem_3d_cad",
    "vscode": "programacao",
    "intellij": "programacao",
    "obs": "streaming",
    "jogos_steam": "jogos",
}


def usos_efetivos(respostas: dict[str, Any]) -> list[str]:
    """Usos declarados + usos implícitos pelos softwares marcados."""
    usos = list(respostas.get("usos") or [])
    for software in respostas.get("softwares") or []:
        uso = SOFTWARE_PARA_USO.get(software)
        if uso and uso not in usos:
            usos.append(uso)
    return usos or ["uso_diario"]

# Faixas de orçamento (em R$). None = sem limite naquele lado.
FAIXAS_ORCAMENTO: dict[str, tuple[int | None, int | None]] = {
    "ate_2500": (None, 2500),
    "2500_4000": (2500, 4000),
    "4000_6000": (4000, 6000),
    "6000_9000": (6000, 9000),
    "acima_9000": (9000, None),
    "nao_sei": (None, None),
}

# Rótulos amigáveis dos perfis (usados nos resumos).
ROTULO_PERFIL = {
    "escritorio": "trabalho e escritório",
    "estudos": "estudos e rotina",
    "gamer_entrada": "jogos (entrada)",
    "gamer_performance": "jogos (alto desempenho)",
    "design_edicao": "design e edição",
    "cad_engenharia": "engenharia e projetos 3D",
    "workstation": "trabalho profissional pesado",
}


@dataclass
class ErroRecomendacao(Exception):
    """Erro de negócio com mensagem amigável em português."""

    mensagem: str


def _respostas_da_sessao(sessao: OnboardingSession) -> dict[str, Any]:
    return {r.chave: r.valor for r in sessao.respostas}


def calcular_demanda(respostas: dict[str, Any]) -> dict[str, int]:
    """Combina usos (declarados + implícitos por software) e intensidade em uma demanda única."""
    usos = usos_efetivos(respostas)
    demanda = {"cpu_tier": 1, "gpu_tier": 0, "ram_gb": 8, "ssd_gb": 256}
    for uso in usos:
        exigencia = DEMANDA_POR_USO.get(uso)
        if not exigencia:
            continue
        for chave, valor in exigencia.items():
            demanda[chave] = max(demanda[chave], valor)

    ajuste = AJUSTE_INTENSIDADE.get(respostas.get("intensidade") or "medio", 0)
    if ajuste:
        demanda["cpu_tier"] = min(5, max(1, demanda["cpu_tier"] + ajuste))
        if demanda["gpu_tier"] > 0:
            demanda["gpu_tier"] = min(5, max(1, demanda["gpu_tier"] + ajuste))
        if ajuste > 0:
            demanda["ram_gb"] = min(64, demanda["ram_gb"] * 2)
    return demanda


def detectar_perfil(respostas: dict[str, Any], demanda: dict[str, int]) -> str:
    """Traduz usos + demanda em um perfil de máquina (do mais ao menos exigente)."""
    usos = set(usos_efetivos(respostas))
    intensidade = respostas.get("intensidade") or "medio"

    if "ia_dados" in usos or demanda["cpu_tier"] >= 5:
        return "workstation"
    if "modelagem_3d_cad" in usos:
        return "cad_engenharia"
    if "edicao_video" in usos or "design_grafico" in usos or "streaming" in usos:
        return "design_edicao"
    if "jogos" in usos:
        return "gamer_performance" if intensidade == "pesado" else "gamer_entrada"
    if "programacao" in usos or "planilhas_dados" in usos:
        return "escritorio" if intensidade == "leve" else "estudos"
    if "trabalho_escritorio" in usos or "gestao_negocio" in usos:
        return "escritorio"
    return "estudos"


def _pontuar_build(
    build: PreconfiguredBuild,
    demanda: dict[str, int],
    respostas: dict[str, Any],
) -> float:
    """Pontua uma build para a demanda do cliente. Quanto maior, melhor.

    Penaliza forte quem entrega MENOS que o necessário; penaliza de leve o
    excesso (para não empurrar máquina cara a quem não precisa).
    """
    entrega = build.requisitos or {}
    pontos = 100.0

    for chave, peso in (("cpu_tier", 12), ("gpu_tier", 12)):
        deficit = demanda.get(chave, 0) - entrega.get(chave, 0)
        if deficit > 0:
            pontos -= deficit * peso * 2.5  # abaixo do necessário: penalidade forte
        else:
            pontos -= (-deficit) * peso * 0.4  # acima: penalidade leve (custo à toa)

    for chave, peso in (("ram_gb", 0.6), ("ssd_gb", 0.02)):
        deficit = demanda.get(chave, 0) - entrega.get(chave, 0)
        if deficit > 0:
            pontos -= deficit * peso * 2.5
        else:
            pontos -= (-deficit) * peso * 0.2

    # Orçamento: fora da faixa não elimina, mas pesa bastante.
    minimo, maximo = FAIXAS_ORCAMENTO.get(respostas.get("orcamento") or "nao_sei", (None, None))
    preco = float(build.preco)
    if maximo and preco > maximo:
        pontos -= (preco - maximo) / 60.0
    if minimo and preco < minimo * 0.6:
        pontos -= 8  # muito abaixo da faixa: talvez o cliente queira algo melhor

    # Prioridade declarada.
    prioridade = respostas.get("prioridade")
    if prioridade == "economia":
        pontos -= preco / 800.0
    elif prioridade == "desempenho":
        pontos += (entrega.get("cpu_tier", 0) + entrega.get("gpu_tier", 0)) * 1.5
    elif prioridade == "upgrades" and build.tipo == "desktop":
        pontos += 6  # desktops aceitam upgrades com facilidade
    elif prioridade == "portabilidade" and build.tipo == "notebook":
        pontos += 15
    elif prioridade == "silencio" and "silencioso" in (build.pontos_fortes or []):
        pontos += 5

    return pontos


def _filtrar_por_tipo(builds: list[PreconfiguredBuild], respostas: dict[str, Any]) -> list[PreconfiguredBuild]:
    tipo = respostas.get("tipo_equipamento") or "tanto_faz"
    if tipo == "notebook" or respostas.get("prioridade") == "portabilidade" and tipo == "tanto_faz":
        candidatos = [b for b in builds if b.tipo == "notebook"]
    elif tipo == "desktop":
        candidatos = [b for b in builds if b.tipo == "desktop"]
    else:
        candidatos = builds
    return candidatos or builds  # nunca deixa a lista vazia por causa do filtro


def _nivel_confianca(avisos: list[str], respostas: dict[str, Any]) -> str:
    obrigatorias_respondidas = all(
        respostas.get(chave) for chave in ("usos", "orcamento", "prioridade")
    )
    if not obrigatorias_respondidas:
        return "baixa"
    # Avisos puramente informativos não reduzem a confiança.
    relevantes = [a for a in avisos if not a.startswith("Notebook é um produto fechado")]
    if relevantes:
        return "media"
    return "alta"


def gerar_recomendacao(sessao_db: Session, session_id: str) -> RecommendationResult:
    """Ponto de entrada do motor: gera e persiste a recomendação de uma sessão."""
    sessao = sessao_db.get(OnboardingSession, session_id)
    if not sessao:
        raise ErroRecomendacao("Sessão de onboarding não encontrada. Comece novamente.")

    respostas = _respostas_da_sessao(sessao)
    if not respostas.get("usos"):
        raise ErroRecomendacao(
            "Precisamos saber como você vai usar o computador antes de recomendar."
        )

    demanda = calcular_demanda(respostas)
    perfil = detectar_perfil(respostas, demanda)

    builds = list(
        sessao_db.scalars(
            select(PreconfiguredBuild)
            .where(PreconfiguredBuild.ativo.is_(True))
            .options(
                selectinload(PreconfiguredBuild.itens)
                .selectinload(BuildComponent.componente)
                .selectinload(Component.categoria),
            )
        )
    )
    if not builds:
        raise ErroRecomendacao("Catálogo vazio: nenhuma configuração disponível no momento.")

    candidatos = _filtrar_por_tipo(builds, respostas)
    melhor = max(candidatos, key=lambda b: _pontuar_build(b, demanda, respostas))

    # Camada determinística de compatibilidade + adequação ao uso.
    componentes = [item.componente for item in melhor.itens]
    checagem = compatibilidade.verificar(componentes)
    avisos = checagem.erros + checagem.avisos
    avisos += compatibilidade.recomendar_por_uso(demanda, melhor.requisitos or {})
    if respostas.get("perifericos") and "preciso_de_tudo" in respostas["perifericos"] and melhor.tipo == "desktop":
        avisos.append("Cliente precisa de monitor, teclado e mouse — incluir no orçamento.")

    # Transparência: se a melhor opção estoura a faixa informada, dizemos isso.
    _, maximo = FAIXAS_ORCAMENTO.get(respostas.get("orcamento") or "nao_sei", (None, None))
    if maximo and float(melhor.preco) > maximo:
        valor = f"{float(melhor.preco):,.0f}".replace(",", ".")
        avisos.append(
            f"Esta configuração (R$ {valor}) fica acima da faixa de orçamento informada — "
            "vale conversar com o especialista sobre alternativas."
        )

    confianca = _nivel_confianca(avisos, respostas)

    # Camada de IA: apenas explica (com fallback mock que funciona sem chave).
    dados = DadosRecomendacao(
        perfil=perfil,
        rotulo_perfil=ROTULO_PERFIL.get(perfil, perfil),
        demanda=demanda,
        respostas=respostas,
        build_nome=melhor.nome,
        build_tipo=melhor.tipo,
        build_preco=float(melhor.preco),
        componentes=[
            {"categoria": item.componente.categoria.nome, "nome": item.componente.nome, "quantidade": item.quantidade}
            for item in melhor.itens
        ],
        pontos_fortes=list(melhor.pontos_fortes or []),
        limitacoes=list(melhor.limitacoes or []),
        avisos=avisos,
        watts_estimados=checagem.watts_estimados,
        nivel_confianca=confianca,
    )
    explicacao = obter_provedor().gerar_explicacao(dados)

    resultado = RecommendationResult(
        session_id=session_id,
        build_id=melhor.id,
        perfil_detectado=perfil,
        resumo_cliente=explicacao.customer_summary,
        resumo_tecnico=explicacao.technical_summary,
        nivel_confianca=explicacao.confidence_level,
        avisos=explicacao.warnings,
        perguntas_para_vendedor=explicacao.suggested_questions_for_human_seller,
        watts_estimados=checagem.watts_estimados,
        orcamento_estimado=Decimal(str(melhor.preco)),
    )
    sessao.status = "concluida"
    sessao_db.add(resultado)
    sessao_db.commit()
    sessao_db.refresh(resultado)
    return resultado
