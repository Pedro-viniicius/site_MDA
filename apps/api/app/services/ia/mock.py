"""Provedor de IA mock: gera explicações determinísticas em português.

É o provedor padrão em desenvolvimento — nenhuma chave de API é necessária.
Os textos seguem o tom da marca: acolhedor, claro, confiante e sem jargão.
"""

from app.services.ia.base import DadosRecomendacao, ExplicacaoIA

# Descrição amigável do que cada uso significa no resumo ao cliente.
ROTULO_USO = {
    "uso_diario": "uso do dia a dia",
    "estudos": "estudos",
    "trabalho_escritorio": "trabalho de escritório",
    "planilhas_dados": "planilhas e relatórios",
    "programacao": "programação",
    "jogos": "jogos",
    "design_grafico": "design gráfico",
    "edicao_video": "edição de vídeo",
    "modelagem_3d_cad": "projetos 3D e CAD",
    "streaming": "transmissões ao vivo",
    "ia_dados": "inteligência artificial e análise de dados",
    "gestao_negocio": "a gestão do seu negócio",
}

ROTULO_PRIORIDADE = {
    "desempenho": "priorizamos o máximo de desempenho",
    "economia": "buscamos o melhor custo-benefício, sem gastos desnecessários",
    "upgrades": "deixamos caminho aberto para upgrades futuros",
    "silencio": "priorizamos um funcionamento silencioso",
    "portabilidade": "priorizamos a mobilidade",
    "estetica": "cuidamos também do visual do conjunto",
}


def _listar_em_portugues(itens: list[str]) -> str:
    """Une itens como em uma frase natural: 'a, b e c'."""
    if not itens:
        return ""
    if len(itens) == 1:
        return itens[0]
    return ", ".join(itens[:-1]) + " e " + itens[-1]


class ProvedorMock:
    """Implementação determinística da interface ProvedorIA."""

    def gerar_explicacao(self, dados: DadosRecomendacao) -> ExplicacaoIA:
        return ExplicacaoIA(
            customer_summary=self._resumo_cliente(dados),
            technical_summary=self._resumo_tecnico(dados),
            confidence_level=dados.nivel_confianca,
            warnings=list(dados.avisos),
            suggested_questions_for_human_seller=self._perguntas_vendedor(dados),
        )

    # ------------------------------------------------------------------
    # Resumo para o cliente: simples, acolhedor e transparente.
    # ------------------------------------------------------------------
    def _resumo_cliente(self, dados: DadosRecomendacao) -> str:
        usos = [ROTULO_USO.get(u, u) for u in (dados.respostas.get("usos") or [])]
        frase_usos = _listar_em_portugues(usos) or "as atividades que você descreveu"
        tipo = "notebook" if dados.build_tipo == "notebook" else "computador"

        partes = [
            f"Encontramos uma ótima opção para você: o {dados.build_nome}. "
            f"Esse {tipo} atende bem às demandas que você levantou, como {frase_usos}."
        ]

        prioridade = ROTULO_PRIORIDADE.get(dados.respostas.get("prioridade") or "")
        if prioridade:
            partes.append(f"Na escolha da configuração, {prioridade}.")

        if dados.pontos_fortes:
            partes.append(
                "Entre os destaques estão: " + _listar_em_portugues(dados.pontos_fortes) + "."
            )

        if dados.limitacoes:
            partes.append(
                "Para ser transparente: " + _listar_em_portugues(dados.limitacoes) + "."
            )

        partes.append(
            "E fique tranquilo — antes de qualquer montagem, um especialista da MDA "
            "revisa a configuração com você, sem compromisso."
        )
        return " ".join(partes)

    # ------------------------------------------------------------------
    # Resumo técnico para a equipe de montagem/vendas.
    # ------------------------------------------------------------------
    def _resumo_tecnico(self, dados: DadosRecomendacao) -> dict:
        return {
            "build": dados.build_nome,
            "tipo": dados.build_tipo,
            "perfil_de_uso": dados.rotulo_perfil,
            "componentes": dados.componentes,
            "consumo_estimado_watts": dados.watts_estimados,
            "demanda_calculada": dados.demanda,
            "notas_compatibilidade": dados.avisos or ["Nenhum problema de compatibilidade detectado."],
            "perfil_desempenho": (
                f"CPU tier {dados.demanda.get('cpu_tier')}, GPU tier {dados.demanda.get('gpu_tier')}, "
                f"{dados.demanda.get('ram_gb')} GB RAM, {dados.demanda.get('ssd_gb')} GB SSD (demanda do cliente)"
            ),
            "riscos": dados.avisos[:3] or ["Sem riscos relevantes identificados."],
            "sugestoes_upgrade": dados.limitacoes or ["Sem upgrades urgentes."],
            "preco_placeholder": dados.build_preco,
            "margem_observacao": "PLACEHOLDER — definir margem sobre custo real dos fornecedores.",
            "estoque_observacao": "PLACEHOLDER — validar disponibilidade dos itens com o fornecedor.",
            "restricoes_cliente": {
                "orcamento": dados.respostas.get("orcamento"),
                "prioridade": dados.respostas.get("prioridade"),
                "ja_possui": dados.respostas.get("perifericos") or [],
                "conectividade": dados.respostas.get("conectividade") or [],
                "programas_citados": dados.respostas.get("programas") or "não informado",
            },
            "proxima_acao": "Entrar em contato com o cliente para validar a configuração e enviar orçamento.",
        }

    # ------------------------------------------------------------------
    # Perguntas que o vendedor humano deve fazer para fechar bem a venda.
    # ------------------------------------------------------------------
    def _perguntas_vendedor(self, dados: DadosRecomendacao) -> list[str]:
        perguntas: list[str] = []
        respostas = dados.respostas

        if not respostas.get("programas"):
            perguntas.append(
                "Quais programas específicos o cliente usa? (não informado no onboarding)"
            )
        if (respostas.get("orcamento") or "nao_sei") == "nao_sei":
            perguntas.append("Qual é o orçamento real do cliente? Ele preferiu ver opções antes.")
        if dados.build_tipo == "desktop" and "preciso_de_tudo" in (respostas.get("perifericos") or []):
            perguntas.append("Confirmar quais periféricos incluir: monitor, teclado, mouse, caixas?")
        if "dois_monitores" in (respostas.get("conectividade") or []):
            perguntas.append("Cliente quer dois monitores — validar saídas de vídeo e oferecer o segundo monitor.")
        if dados.avisos:
            perguntas.append("Revisar os avisos técnicos com o cliente antes de fechar o pedido.")
        if not perguntas:
            perguntas.append("Confirmar prazo de entrega desejado e forma de pagamento.")
        return perguntas
