"""Usuários internos (fundação para autenticação futura do painel admin)."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class User(Base):
    """Usuário do painel administrativo.

    A autenticação ainda não está implementada — este modelo existe para
    preparar o terreno (veja ROADMAP.md).
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    nome: Mapped[str] = mapped_column(String(150))
    hash_senha: Mapped[str | None] = mapped_column(String(255), default=None)
    papel: Mapped[str] = mapped_column(String(30), default="admin")
    ativo: Mapped[bool] = mapped_column(Boolean, default=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
