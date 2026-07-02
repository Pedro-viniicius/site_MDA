"""Leads: pedidos de orçamento e contatos de clientes."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Lead(Base):
    """Contato de um cliente interessado (com ou sem recomendação vinculada)."""

    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(150))
    email: Mapped[str | None] = mapped_column(String(150), default=None)
    telefone: Mapped[str | None] = mapped_column(String(30), default=None)
    mensagem: Mapped[str | None] = mapped_column(Text, default=None)
    # De onde o lead veio: "recomendacao", "pcs_prontos", "contato", ...
    origem: Mapped[str] = mapped_column(String(40), default="contato")
    session_id: Mapped[str | None] = mapped_column(
        ForeignKey("onboarding_sessions.id"), default=None
    )
    recommendation_id: Mapped[str | None] = mapped_column(
        ForeignKey("recommendation_results.id"), default=None
    )
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
