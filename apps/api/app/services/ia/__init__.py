"""Camada de IA da plataforma.

A fábrica `obter_provedor()` escolhe o provedor conforme a variável de
ambiente AI_PROVIDER. O sistema SEMPRE funciona sem chave de API: se o
provedor configurado não estiver disponível, cai no mock determinístico.
"""

import logging

from app.core.config import obter_configuracoes
from app.services.ia.base import ProvedorIA
from app.services.ia.mock import ProvedorMock

logger = logging.getLogger(__name__)


def obter_provedor() -> ProvedorIA:
    """Retorna o provedor de IA configurado, com fallback seguro para o mock."""
    config = obter_configuracoes()

    if config.ai_provider == "anthropic" and config.anthropic_api_key:
        # Ponto de integração futuro: instanciar aqui o provedor real
        # (ex.: `from app.services.ia.anthropic_provider import ProvedorAnthropic`).
        logger.warning(
            "Provedor 'anthropic' ainda não implementado — usando mock determinístico."
        )
    elif config.ai_provider == "openai" and config.openai_api_key:
        logger.warning(
            "Provedor 'openai' ainda não implementado — usando mock determinístico."
        )
    elif config.ai_provider not in ("mock", "anthropic", "openai"):
        logger.warning(
            "Provedor de IA desconhecido (%s) — usando mock determinístico.",
            config.ai_provider,
        )

    return ProvedorMock()
