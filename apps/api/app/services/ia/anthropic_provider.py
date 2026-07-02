"""Stub do provedor Anthropic (Claude).

INTEGRAÇÃO FUTURA — este arquivo documenta o caminho para plugar IA real:

1. Adicionar `anthropic` ao requirements.txt.
2. Implementar `gerar_explicacao` chamando a API com um prompt que receba
   os dados estruturados (DadosRecomendacao) e exija resposta em JSON com
   os campos de ExplicacaoIA, sempre em português brasileiro.
3. Validar a resposta e, em QUALQUER falha (timeout, chave inválida, JSON
   malformado), retornar `ProvedorMock().gerar_explicacao(dados)` — o
   cliente nunca pode ficar sem resposta.
4. Registrar o provedor na fábrica `obter_provedor()` em ia/__init__.py.

A chave fica APENAS na variável de ambiente ANTHROPIC_API_KEY (backend).
"""

from app.services.ia.base import DadosRecomendacao, ExplicacaoIA
from app.services.ia.mock import ProvedorMock


class ProvedorAnthropic:
    """Ainda não implementado: delega ao mock para nunca quebrar o fluxo."""

    def gerar_explicacao(self, dados: DadosRecomendacao) -> ExplicacaoIA:
        return ProvedorMock().gerar_explicacao(dados)
