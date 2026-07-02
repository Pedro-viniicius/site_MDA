"""API da plataforma MDA — Soluções em Tecnologia.

Recomendação guiada de computadores: o cliente conta o que precisa em
linguagem simples e recebe uma configuração segura, com explicação clara.
Documentação interativa em /docs.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import obter_configuracoes
from app.routers import builds, componentes, health, leads, recomendacoes

app = FastAPI(
    title="API — MDA Soluções em Tecnologia",
    description=(
        "Plataforma de recomendação guiada de PCs e notebooks. "
        "O cliente descreve suas necessidades em linguagem simples; o motor "
        "determinístico escolhe a configuração e a camada de IA explica o resultado."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origem.strip() for origem in obter_configuracoes().cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(componentes.router)
app.include_router(builds.router)
app.include_router(recomendacoes.router)
app.include_router(leads.router)
