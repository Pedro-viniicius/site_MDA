"""Popula o banco com os dados iniciais (idempotente).

Execução: `python -m app.seed.executar`
Se as categorias já existirem, o seed é pulado — seguro para rodar em todo
start do container.
"""

import logging
from decimal import Decimal

from sqlalchemy import select

from app.core.db import SessaoLocal
from app.models.catalogo import BuildComponent, Component, ComponentCategory, PreconfiguredBuild
from app.seed.dados import BUILDS, CATEGORIAS, COMPONENTES

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("seed")


def executar() -> None:
    with SessaoLocal() as db:
        if db.scalar(select(ComponentCategory).limit(1)):
            logger.info("Seed: banco já populado — nada a fazer.")
            return

        logger.info("Seed: populando categorias, componentes e builds...")

        categorias: dict[str, ComponentCategory] = {}
        for dados in CATEGORIAS:
            categoria = ComponentCategory(**dados)
            db.add(categoria)
            categorias[dados["slug"]] = categoria
        db.flush()

        componentes: dict[str, Component] = {}
        for chave, dados in COMPONENTES.items():
            componente = Component(
                categoria_id=categorias[dados["categoria"]].id,
                nome=dados["nome"],
                marca=dados.get("marca"),
                descricao=dados.get("descricao"),
                preco=Decimal(str(dados["preco"])),
                attrs=dados.get("attrs", {}),
            )
            db.add(componente)
            componentes[chave] = componente
        db.flush()

        for dados in BUILDS:
            build = PreconfiguredBuild(
                slug=dados["slug"],
                nome=dados["nome"],
                tipo=dados["tipo"],
                perfil=dados["perfil"],
                descricao=dados["descricao"],
                uso_alvo=dados["uso_alvo"],
                publico_alvo=dados["publico_alvo"],
                preco=Decimal(str(dados["preco"])),
                requisitos=dados["requisitos"],
                pontos_fortes=dados["pontos_fortes"],
                limitacoes=dados["limitacoes"],
            )
            db.add(build)
            db.flush()
            for chave_componente in dados["componentes"]:
                db.add(
                    BuildComponent(
                        build_id=build.id,
                        component_id=componentes[chave_componente].id,
                        quantidade=1,
                    )
                )

        db.commit()
        logger.info(
            "Seed concluído: %d categorias, %d componentes, %d builds.",
            len(CATEGORIAS),
            len(COMPONENTES),
            len(BUILDS),
        )


if __name__ == "__main__":
    executar()
