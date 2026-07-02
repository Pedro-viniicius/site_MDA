#!/bin/sh
# Inicialização da API em desenvolvimento:
# 1. aplica as migrações do banco;
# 2. roda o seed (idempotente — não duplica dados);
# 3. sobe o servidor com recarga automática.
set -e

echo "Aplicando migrações do banco de dados..."
alembic upgrade head

echo "Executando seed (dados iniciais)..."
python -m app.seed.executar

echo "Iniciando a API em http://0.0.0.0:8000 ..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
