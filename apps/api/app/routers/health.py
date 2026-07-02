"""Verificação de saúde da API."""

from fastapi import APIRouter

router = APIRouter(tags=["Saúde"])


@router.get("/health", summary="Verifica se a API está no ar")
def health() -> dict:
    return {"status": "ok", "servico": "API MDA Soluções em Tecnologia"}
