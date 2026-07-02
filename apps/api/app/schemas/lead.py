"""Schemas de leads (pedidos de orçamento e contato)."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LeadIn(BaseModel):
    nome: str = Field(min_length=2, max_length=150)
    email: str | None = Field(default=None, max_length=150)
    telefone: str | None = Field(default=None, max_length=30)
    mensagem: str | None = Field(default=None, max_length=2000)
    origem: str = "contato"
    session_id: str | None = None
    recommendation_id: str | None = None


class LeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    email: str | None
    telefone: str | None
    mensagem: str | None
    origem: str
    session_id: str | None
    recommendation_id: str | None
    criado_em: datetime
