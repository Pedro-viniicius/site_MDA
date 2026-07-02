"""Contrato da camada de IA.

Qualquer provedor (mock, Anthropic, OpenAI, LLM local) recebe os MESMOS dados
estruturados e devolve o MESMO formato de resposta. Assim, trocar de provedor
é uma questão de configuração, nunca de reescrita.
"""

from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class DadosRecomendacao:
    """Dados estruturados produzidos pelo motor determinístico."""

    perfil: str
    rotulo_perfil: str
    demanda: dict[str, int]
    respostas: dict[str, Any]
    build_nome: str
    build_tipo: str
    build_preco: float
    componentes: list[dict]
    pontos_fortes: list[str]
    limitacoes: list[str]
    avisos: list[str]
    watts_estimados: int
    nivel_confianca: str


@dataclass
class ExplicacaoIA:
    """Saída padronizada de qualquer provedor de IA."""

    customer_summary: str
    technical_summary: dict
    confidence_level: str
    warnings: list[str] = field(default_factory=list)
    suggested_questions_for_human_seller: list[str] = field(default_factory=list)


class ProvedorIA(Protocol):
    """Interface que todo provedor de IA deve implementar."""

    def gerar_explicacao(self, dados: DadosRecomendacao) -> ExplicacaoIA:
        """Gera resumo para o cliente e resumo técnico para a equipe interna."""
        ...
