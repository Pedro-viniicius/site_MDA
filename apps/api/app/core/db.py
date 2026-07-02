"""Conexão com o banco de dados e sessão do SQLAlchemy."""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import obter_configuracoes


class Base(DeclarativeBase):
    """Base declarativa de todos os modelos."""


engine = create_engine(obter_configuracoes().database_url, pool_pre_ping=True)

SessaoLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def obter_sessao() -> Generator[Session, None, None]:
    """Dependência do FastAPI que abre e fecha uma sessão por requisição."""
    sessao = SessaoLocal()
    try:
        yield sessao
    finally:
        sessao.close()
