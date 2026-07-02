"""Configurações da aplicação, carregadas de variáveis de ambiente."""

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Configuracoes(BaseSettings):
    """Variáveis de ambiente da API (veja .env.example na raiz do projeto)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://mda:mda_senha_dev@localhost:5432/mda"
    cors_origins: str = "http://localhost:3000"

    @field_validator("database_url")
    @classmethod
    def _normalizar_url_do_banco(cls, url: str) -> str:
        """Aceita URLs de provedores gerenciados (Render, Neon, Railway...).

        Eles fornecem `postgres://` ou `postgresql://`; o SQLAlchemy com o
        driver psycopg 3 exige o prefixo `postgresql+psycopg://`.
        """
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql+psycopg://", 1)
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url

    # Provedor de IA: "mock" (padrão, sem custo), "anthropic" ou "openai".
    ai_provider: str = "mock"
    anthropic_api_key: str = ""
    openai_api_key: str = ""


@lru_cache
def obter_configuracoes() -> Configuracoes:
    return Configuracoes()
