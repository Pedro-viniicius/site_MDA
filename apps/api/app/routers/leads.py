"""Leads: pedidos de orçamento e contato com especialista."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import obter_sessao
from app.models.lead import Lead
from app.schemas.lead import LeadIn, LeadOut

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.post("", response_model=LeadOut, status_code=201, summary="Registra um pedido de orçamento/contato")
def criar_lead(dados: LeadIn, db: Session = Depends(obter_sessao)) -> Lead:
    lead = Lead(**dados.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.get("", response_model=list[LeadOut], summary="Lista os leads recebidos (uso interno)")
def listar_leads(db: Session = Depends(obter_sessao)) -> list[Lead]:
    """Endpoint do painel admin. Autenticação será adicionada em fase futura (ROADMAP)."""
    return list(db.scalars(select(Lead).order_by(Lead.criado_em.desc())))
