"""Catálogo de componentes e categorias."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import obter_sessao
from app.models.catalogo import Component, ComponentCategory
from app.schemas.catalogo import CategoriaOut, ComponenteOut

router = APIRouter(prefix="/components", tags=["Componentes"])


@router.get("/categories", response_model=list[CategoriaOut], summary="Lista as categorias de componentes")
def listar_categorias(db: Session = Depends(obter_sessao)) -> list[ComponentCategory]:
    return list(db.scalars(select(ComponentCategory).order_by(ComponentCategory.id)))


@router.get("", response_model=list[ComponenteOut], summary="Lista os componentes do catálogo")
def listar_componentes(
    categoria: str | None = Query(default=None, description="Filtra por slug da categoria (ex.: cpu)"),
    db: Session = Depends(obter_sessao),
) -> list[Component]:
    consulta = select(Component).where(Component.ativo.is_(True)).order_by(Component.categoria_id, Component.preco)
    if categoria:
        consulta = consulta.join(ComponentCategory).where(ComponentCategory.slug == categoria)
    return list(db.scalars(consulta))
