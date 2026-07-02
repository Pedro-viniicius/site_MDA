"""Computadores pré-configurados (PCs prontos)."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.db import obter_sessao
from app.models.catalogo import BuildComponent, Component, PreconfiguredBuild
from app.schemas.catalogo import BuildOut, ItemBuildOut

router = APIRouter(prefix="/builds", tags=["PCs Prontos"])


def montar_build_out(build: PreconfiguredBuild) -> BuildOut:
    """Achata os componentes da build para exibição no site."""
    saida = BuildOut.model_validate(build)
    saida.componentes = [
        ItemBuildOut(
            categoria=item.componente.categoria.nome,
            nome=item.componente.nome,
            quantidade=item.quantidade,
        )
        for item in build.itens
    ]
    return saida


@router.get("/preconfigured", response_model=list[BuildOut], summary="Lista os computadores prontos para venda")
def listar_builds(db: Session = Depends(obter_sessao)) -> list[BuildOut]:
    builds = db.scalars(
        select(PreconfiguredBuild)
        .where(PreconfiguredBuild.ativo.is_(True))
        .order_by(PreconfiguredBuild.preco)
        .options(
            selectinload(PreconfiguredBuild.itens)
            .selectinload(BuildComponent.componente)
            .selectinload(Component.categoria)
        )
    )
    return [montar_build_out(b) for b in builds]
