"""Sessões e respostas do onboarding guiado."""

import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


def _novo_uuid() -> str:
    return str(uuid.uuid4())


class OnboardingSession(Base):
    """Uma jornada de perguntas e respostas de um visitante."""

    __tablename__ = "onboarding_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_novo_uuid)
    status: Mapped[str] = mapped_column(String(20), default="em_andamento")  # em_andamento | concluida
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    respostas: Mapped[list["OnboardingAnswer"]] = relationship(
        back_populates="sessao", cascade="all, delete-orphan"
    )


class OnboardingAnswer(Base):
    """Resposta a uma pergunta do onboarding (chave = identificador da pergunta)."""

    __tablename__ = "onboarding_answers"
    __table_args__ = (UniqueConstraint("session_id", "chave", name="uq_resposta_por_pergunta"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(ForeignKey("onboarding_sessions.id"), index=True)
    chave: Mapped[str] = mapped_column(String(50))
    valor: Mapped[dict | list | str | None] = mapped_column(JSON, default=None)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    sessao: Mapped[OnboardingSession] = relationship(back_populates="respostas")
