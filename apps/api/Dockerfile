# API MDA — imagem de desenvolvimento
# Python 3.12 fixado para estabilidade das dependências.
FROM python:3.12-slim

WORKDIR /app

# Dependências primeiro, para aproveitar o cache de camadas do Docker.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["./entrypoint.sh"]
