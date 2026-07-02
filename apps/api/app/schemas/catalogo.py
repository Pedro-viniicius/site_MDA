"""Schemas de resposta do catálogo (categorias, componentes e builds)."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class CategoriaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    nome: str
    descricao: str | None = None


class ComponenteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    categoria_id: int
    nome: str
    marca: str | None = None
    descricao: str | None = None
    preco: Decimal
    attrs: dict
    ativo: bool


class ItemBuildOut(BaseModel):
    """Componente dentro de uma build, já achatado para exibição."""

    categoria: str
    nome: str
    quantidade: int


class BuildOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    nome: str
    tipo: str
    perfil: str
    descricao: str | None = None
    uso_alvo: str | None = None
    publico_alvo: str | None = None
    preco: Decimal
    requisitos: dict
    pontos_fortes: list
    limitacoes: list
    componentes: list[ItemBuildOut] = []
