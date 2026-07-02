"""Stub do provedor OpenAI.

INTEGRAÇÃO FUTURA — mesmo roteiro do provedor Anthropic
(veja anthropic_provider.py): instalar o SDK, implementar a chamada com
saída JSON validada e fallback obrigatório para o ProvedorMock em caso
de qualquer falha. Chave apenas em OPENAI_API_KEY (backend).
"""

from app.services.ia.base import DadosRecomendacao, ExplicacaoIA
from app.services.ia.mock import ProvedorMock


class ProvedorOpenAI:
    """Ainda não implementado: delega ao mock para nunca quebrar o fluxo."""

    def gerar_explicacao(self, dados: DadosRecomendacao) -> ExplicacaoIA:
        return ProvedorMock().gerar_explicacao(dados)
