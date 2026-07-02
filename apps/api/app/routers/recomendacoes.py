"""Fluxo de onboarding e geração de recomendações."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.db import obter_sessao
from app.models.catalogo import BuildComponent, Component, PreconfiguredBuild
from app.models.onboarding import OnboardingAnswer, OnboardingSession
from app.models.recomendacao import RecommendationResult
from app.routers.builds import montar_build_out
from app.schemas.onboarding import IniciarOnboardingOut, ResponderIn, ResponderOut
from app.schemas.recomendacao import GerarRecomendacaoIn, RecomendacaoOut
from app.services import recomendacao as motor
from app.services.perguntas import chaves_validas, obter_perguntas

router = APIRouter(prefix="/recommendations", tags=["Recomendações"])


@router.post("/start", response_model=IniciarOnboardingOut, summary="Inicia uma sessão de onboarding")
def iniciar(db: Session = Depends(obter_sessao)) -> IniciarOnboardingOut:
    """Cria a sessão e devolve as perguntas do fluxo guiado (fonte única de verdade)."""
    sessao = OnboardingSession()
    db.add(sessao)
    db.commit()
    return IniciarOnboardingOut(session_id=sessao.id, perguntas=obter_perguntas())


@router.post("/answer", response_model=ResponderOut, summary="Registra a resposta de uma pergunta")
def responder(dados: ResponderIn, db: Session = Depends(obter_sessao)) -> ResponderOut:
    sessao = db.get(OnboardingSession, dados.session_id)
    if not sessao:
        raise HTTPException(status_code=404, detail="Sessão não encontrada. Comece novamente.")

    if dados.chave not in chaves_validas():
        raise HTTPException(status_code=422, detail=f"Pergunta desconhecida: {dados.chave}")

    # Regravar a resposta permite que o cliente volte etapas sem duplicar dados.
    existente = db.scalar(
        select(OnboardingAnswer).where(
            OnboardingAnswer.session_id == dados.session_id,
            OnboardingAnswer.chave == dados.chave,
        )
    )
    if existente:
        existente.valor = dados.valor
    else:
        db.add(OnboardingAnswer(session_id=dados.session_id, chave=dados.chave, valor=dados.valor))
    db.commit()

    total = len(sessao.respostas)
    return ResponderOut(ok=True, respostas_registradas=total)


@router.post("/generate", response_model=RecomendacaoOut, summary="Gera a recomendação da sessão")
def gerar(dados: GerarRecomendacaoIn, db: Session = Depends(obter_sessao)) -> RecomendacaoOut:
    try:
        resultado = motor.gerar_recomendacao(db, dados.session_id)
    except motor.ErroRecomendacao as erro:
        raise HTTPException(status_code=422, detail=erro.mensagem) from erro
    return _montar_saida(db, resultado)


@router.get("/{recommendation_id}", response_model=RecomendacaoOut, summary="Consulta uma recomendação")
def consultar(recommendation_id: str, db: Session = Depends(obter_sessao)) -> RecomendacaoOut:
    resultado = db.get(RecommendationResult, recommendation_id)
    if not resultado:
        raise HTTPException(status_code=404, detail="Recomendação não encontrada.")
    return _montar_saida(db, resultado)


def _montar_saida(db: Session, resultado: RecommendationResult) -> RecomendacaoOut:
    saida = RecomendacaoOut.model_validate(resultado)
    if resultado.build_id:
        build = db.scalar(
            select(PreconfiguredBuild)
            .where(PreconfiguredBuild.id == resultado.build_id)
            .options(
                selectinload(PreconfiguredBuild.itens)
                .selectinload(BuildComponent.componente)
                .selectinload(Component.categoria)
            )
        )
        if build:
            saida.build = montar_build_out(build)
    sessao = db.get(OnboardingSession, resultado.session_id)
    if sessao:
        saida.respostas_cliente = {r.chave: r.valor for r in sessao.respostas}
    return saida
