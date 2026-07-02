"""Resultado gerado pelo motor de recomendação."""

import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base
from app.models.catalogo import PreconfiguredBuild
from app.models.onboarding import OnboardingSession


def _novo_uuid() -> str:
    return str(uuid.uuid4())


class RecommendationResult(Base):
    """Recomendação persistida: build escolhida + resumos gerados.

    - `resumo_cliente`: texto acolhedor exibido ao cliente final.
    - `resumo_tecnico`: JSON detalhado para a equipe de montagem/vendas.
    """

    __tablename__ = "recommendation_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_novo_uuid)
    session_id: Mapped[str] = mapped_column(ForeignKey("onboarding_sessions.id"), index=True)
    build_id: Mapped[int | None] = mapped_column(
        ForeignKey("preconfigured_builds.id"), default=None
    )
    perfil_detectado: Mapped[str] = mapped_column(String(40))
    resumo_cliente: Mapped[str] = mapped_column(Text)
    resumo_tecnico: Mapped[dict] = mapped_column(JSON, default=dict)
    nivel_confianca: Mapped[str] = mapped_column(String(20), default="media")  # alta | media | baixa
    avisos: Mapped[list] = mapped_column(JSON, default=list)
    perguntas_para_vendedor: Mapped[list] = mapped_column(JSON, default=list)
    watts_estimados: Mapped[int] = mapped_column(Integer, default=0)
    orcamento_estimado: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0"))
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    sessao: Mapped[OnboardingSession] = relationship()
    build: Mapped[PreconfiguredBuild | None] = relationship()
