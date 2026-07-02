"""Catálogo: categorias, componentes e computadores pré-configurados."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class ComponentCategory(Base):
    """Categoria de componente (CPU, Placa-mãe, RAM, ...)."""

    __tablename__ = "component_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    nome: Mapped[str] = mapped_column(String(100))
    descricao: Mapped[str | None] = mapped_column(Text, default=None)

    componentes: Mapped[list["Component"]] = relationship(back_populates="categoria")


class Component(Base):
    """Componente de hardware do catálogo.

    O campo `attrs` guarda os atributos usados nas regras de compatibilidade
    (socket, tipo de RAM, watts, form factor, tier de desempenho...), de forma
    flexível para permitir integração futura com catálogos de fornecedores.
    """

    __tablename__ = "components"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("component_categories.id"), index=True)
    nome: Mapped[str] = mapped_column(String(200))
    marca: Mapped[str | None] = mapped_column(String(100), default=None)
    descricao: Mapped[str | None] = mapped_column(Text, default=None)
    # Preço placeholder em reais (R$) — será substituído por preços reais do parceiro.
    preco: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0"))
    attrs: Mapped[dict] = mapped_column(JSON, default=dict)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    categoria: Mapped[ComponentCategory] = relationship(back_populates="componentes")


class PreconfiguredBuild(Base):
    """Computador pré-configurado pronto para venda (desktop ou notebook).

    O campo `requisitos` guarda o nível de desempenho entregue
    (cpu_tier, gpu_tier, ram_gb, ssd_gb) e alimenta o motor de recomendação.
    """

    __tablename__ = "preconfigured_builds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    nome: Mapped[str] = mapped_column(String(150))
    tipo: Mapped[str] = mapped_column(String(20), default="desktop")  # desktop | notebook
    perfil: Mapped[str] = mapped_column(String(40), index=True)  # escritorio, estudos, gamer_entrada...
    descricao: Mapped[str | None] = mapped_column(Text, default=None)
    uso_alvo: Mapped[str | None] = mapped_column(String(255), default=None)
    publico_alvo: Mapped[str | None] = mapped_column(String(255), default=None)
    preco: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0"))
    # Nível de desempenho entregue: {"cpu_tier": 1-5, "gpu_tier": 0-5, "ram_gb": int, "ssd_gb": int}
    requisitos: Mapped[dict] = mapped_column(JSON, default=dict)
    pontos_fortes: Mapped[list] = mapped_column(JSON, default=list)
    limitacoes: Mapped[list] = mapped_column(JSON, default=list)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    itens: Mapped[list["BuildComponent"]] = relationship(
        back_populates="build", cascade="all, delete-orphan"
    )


class BuildComponent(Base):
    """Associação entre uma build pré-configurada e seus componentes."""

    __tablename__ = "build_components"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    build_id: Mapped[int] = mapped_column(ForeignKey("preconfigured_builds.id"), index=True)
    component_id: Mapped[int] = mapped_column(ForeignKey("components.id"), index=True)
    quantidade: Mapped[int] = mapped_column(Integer, default=1)

    build: Mapped[PreconfiguredBuild] = relationship(back_populates="itens")
    componente: Mapped[Component] = relationship()
