"""Schemas da recomendação gerada."""

from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, ConfigDict

from app.schemas.catalogo import BuildOut


class GerarRecomendacaoIn(BaseModel):
    session_id: str


class RecomendacaoOut(BaseModel):
    """Visão completa da recomendação.

    O frontend do cliente usa os campos amigáveis; o painel admin usa também
    `resumo_tecnico`, `respostas_cliente` e `perguntas_para_vendedor`.
    """

    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    perfil_detectado: str
    resumo_cliente: str
    resumo_tecnico: dict
    nivel_confianca: str
    avisos: list
    perguntas_para_vendedor: list
    watts_estimados: int
    orcamento_estimado: Decimal
    criado_em: datetime
    build: BuildOut | None = None
    respostas_cliente: dict[str, Any] = {}
