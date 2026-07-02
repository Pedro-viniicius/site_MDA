"""Schemas do fluxo de onboarding guiado."""

from typing import Any

from pydantic import BaseModel, Field


class OpcaoPergunta(BaseModel):
    """Uma opção de resposta, com texto amigável e explicação sem jargão."""

    valor: str
    rotulo: str
    descricao: str | None = None


class Pergunta(BaseModel):
    """Pergunta do onboarding. `tipo`: escolha_unica | escolha_multipla | texto."""

    chave: str
    titulo: str
    apoio: str | None = None  # microcopy acolhedora exibida abaixo do título
    tipo: str
    obrigatoria: bool = True
    opcoes: list[OpcaoPergunta] = []


class IniciarOnboardingOut(BaseModel):
    session_id: str
    perguntas: list[Pergunta]


class ResponderIn(BaseModel):
    session_id: str
    chave: str = Field(description="Identificador da pergunta respondida")
    valor: Any = Field(default=None, description="Resposta (texto, opção ou lista de opções)")


class ResponderOut(BaseModel):
    ok: bool
    respostas_registradas: int
