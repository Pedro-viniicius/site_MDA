"""Modelos do banco de dados.

Importar tudo aqui garante que o Alembic enxergue todas as tabelas
ao gerar migrações (via Base.metadata).
"""

from app.models.catalogo import (
    BuildComponent,
    Component,
    ComponentCategory,
    PreconfiguredBuild,
)
from app.models.lead import Lead
from app.models.onboarding import OnboardingAnswer, OnboardingSession
from app.models.recomendacao import RecommendationResult
from app.models.usuario import User

__all__ = [
    "BuildComponent",
    "Component",
    "ComponentCategory",
    "Lead",
    "OnboardingAnswer",
    "OnboardingSession",
    "PreconfiguredBuild",
    "RecommendationResult",
    "User",
]
