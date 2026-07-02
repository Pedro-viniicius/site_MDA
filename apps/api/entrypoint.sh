#!/bin/sh
# Inicialização da API:
# 1. aplica as migrações do banco;
# 2. roda o seed (idempotente — não duplica dados);
# 3. sobe o servidor.
#
# Em produção (AMBIENTE=producao), sobe sem recarga automática e respeita a
# porta definida pela plataforma de hospedagem ($PORT). Em desenvolvimento,
# mantém --reload para o Docker Compose local.
set -e

echo "Aplicando migrações do banco de dados..."
alembic upgrade head

echo "Executando seed (dados iniciais)..."
python -m app.seed.executar

PORTA="${PORT:-8000}"
if [ "$AMBIENTE" = "producao" ]; then
  echo "Iniciando a API (produção) em http://0.0.0.0:$PORTA ..."
  exec uvicorn app.main:app --host 0.0.0.0 --port "$PORTA"
else
  echo "Iniciando a API (desenvolvimento) em http://0.0.0.0:$PORTA ..."
  exec uvicorn app.main:app --host 0.0.0.0 --port "$PORTA" --reload
fi
