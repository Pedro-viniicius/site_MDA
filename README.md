# Plataforma MDA — Soluções em Tecnologia

Plataforma web de **recomendação guiada de PCs e notebooks**. O cliente conta o que
precisa em linguagem simples — sem jargão de hardware — e recebe uma recomendação
segura, clara e humana, pronta para virar orçamento e venda.

> **Princípio do produto:** o cliente nunca deve se sentir julgado por não entender de
> computadores. O tom é acolhedor, simples, confiante e humano.

## Visão geral

| Área | O que faz |
|---|---|
| **Site (cliente)** | Home institucional, vitrine de PCs prontos, fluxo guiado de perguntas e página de recomendação com pedido de orçamento |
| **Motor de recomendação** | Determinístico: converte respostas em demanda (tiers de CPU/GPU, RAM, SSD), pontua as builds do catálogo e valida compatibilidade |
| **Camada de IA** | Gera os resumos (cliente e técnico). Provedor **mock** por padrão — funciona 100% sem chave de API; Anthropic/OpenAI plugáveis no futuro |
| **Painel admin** | Visão geral, catálogo (leitura), builds (leitura), leads recebidos e visão técnica interna de cada recomendação |
| **API** | FastAPI com documentação interativa em `/docs` |

## Stack

- **Frontend:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · React Hook Form · Zod
- **Backend:** Python 3.12 · FastAPI · Pydantic v2 · SQLAlchemy 2 · Alembic
- **Banco:** PostgreSQL 16 com extensão **pgvector** (habilitada, reservada para busca semântica futura)
- **Infra local:** Docker Compose (db + api + web)

## Como rodar

Pré-requisitos: Docker + Docker Compose. Para desenvolvimento do frontend fora do
Docker, Node 20+.

```bash
# 1. Clone/entre na pasta do projeto e crie o .env
cp .env.example .env

# 2. Instale as dependências do frontend (uma vez)
cd apps/web && npm install && cd ../..

# 3. Suba tudo
docker compose up --build
```

Serviços disponíveis:

| Serviço | URL |
|---|---|
| Site | http://localhost:3000 |
| API | http://localhost:8001 |
| Documentação da API (Swagger) | http://localhost:8001/docs |
| PostgreSQL | localhost:5433 (usuário/senha/banco: `mda`) |

> As portas **8001** e **5433** foram escolhidas para não conflitar com outros
> serviços locais comuns (8000/5432). Ajuste no `docker-compose.yml` se quiser.

Na primeira subida, a API aplica as migrações (Alembic) e roda o **seed** com 12
categorias, ~50 componentes e 10 computadores pré-configurados — tudo em português,
com **preços placeholder**.

### Rodando sem Docker (opcional)

```bash
# Banco: ainda é mais fácil via Docker
docker compose up -d db

# API
cd apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
DATABASE_URL=postgresql+psycopg://mda:mda_senha_dev@localhost:5433/mda alembic upgrade head
DATABASE_URL=postgresql+psycopg://mda:mda_senha_dev@localhost:5433/mda python -m app.seed.executar
DATABASE_URL=postgresql+psycopg://mda:mda_senha_dev@localhost:5433/mda uvicorn app.main:app --port 8001 --reload

# Web (em outro terminal)
cd apps/web
NEXT_PUBLIC_API_URL=http://localhost:8001 API_URL_INTERNA=http://localhost:8001 npm run dev
```

## Estrutura de pastas

```
├── apps/
│   ├── web/                    # Next.js (site + painel admin)
│   │   └── src/
│   │       ├── app/            # Páginas: /, /encontrar, /recomendacao/[id],
│   │       │                   # /pcs-prontos, /login, /admin/...
│   │       ├── components/     # ui/ (shadcn), site/, onboarding/
│   │       └── lib/            # api.ts (cliente tipado), formato.ts
│   └── api/                    # FastAPI
│       ├── app/
│       │   ├── core/           # configurações e banco
│       │   ├── models/         # tabelas (SQLAlchemy)
│       │   ├── schemas/        # contratos da API (Pydantic)
│       │   ├── routers/        # endpoints
│       │   ├── services/       # motor de recomendação, compatibilidade, ia/
│       │   └── seed/           # dados iniciais em pt-BR
│       └── alembic/            # migrações
├── marca/                      # arquivos originais da identidade visual
├── infra/db-init/              # inicialização do PostgreSQL (pgvector)
├── docker-compose.yml
├── .env.example
└── ROADMAP.md                  # fases futuras do produto
```

## Variáveis de ambiente

Copie `.env.example` para `.env`. Principais variáveis:

| Variável | Padrão | Descrição |
|---|---|---|
| `DATABASE_URL` | `postgresql+psycopg://mda:...@db:5432/mda` | Conexão da API com o banco |
| `CORS_ORIGINS` | `http://localhost:3000` | Origens liberadas na API |
| `AI_PROVIDER` | `mock` | Provedor de IA: `mock`, `anthropic` ou `openai` |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | vazio | Chaves (somente backend — nunca no frontend) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8001` | URL da API vista pelo navegador |
| `API_URL_INTERNA` | `http://api:8000` | URL da API vista pelo servidor Next.js |

## API (resumo)

Documentação completa e interativa em `http://localhost:8001/docs`.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Verificação de saúde |
| GET | `/components` | Lista componentes (filtro `?categoria=cpu`) |
| GET | `/components/categories` | Lista categorias |
| GET | `/builds/preconfigured` | PCs prontos com componentes |
| POST | `/recommendations/start` | Cria sessão e devolve as perguntas do onboarding |
| POST | `/recommendations/answer` | Registra/atualiza a resposta de uma pergunta |
| POST | `/recommendations/generate` | Gera a recomendação da sessão |
| GET | `/recommendations/{id}` | Consulta recomendação (cliente + visão técnica) |
| POST | `/leads` | Registra pedido de orçamento/contato |
| GET | `/leads` | Lista leads (painel interno) |

## O que ainda é simulado (mock)

- **IA:** o provedor padrão gera textos determinísticos em português (templates).
  A arquitetura já aceita Anthropic/OpenAI/LLM local — ver `apps/api/app/services/ia/`.
- **Preços:** todos os valores do seed são placeholders em R$.
- **Login/autenticação:** página pronta, mecanismo em fase futura; o painel `/admin`
  está aberto para demonstração.
- **CRUD do admin:** catálogo e builds em leitura; leads já são reais.
- **Estoque, fornecedores e pagamento:** previstos no ROADMAP.

## Integrações futuras (anotações)

- **Catálogo de fornecedores:** o campo `attrs` (JSON) dos componentes foi pensado
  para receber dados externos sem migração de esquema.
- **Pagamento/checkout:** entra depois do fluxo de orçamento validado com clientes.
- **CRM/WhatsApp:** os leads já guardam `origem`, sessão e recomendação — prontos
  para roteamento a um CRM ou à API do WhatsApp Business.
- **Provedor de IA:** implementar `ProvedorAnthropic`/`ProvedorOpenAI` seguindo o
  roteiro em `apps/api/app/services/ia/anthropic_provider.py` (fallback obrigatório
  para o mock).
- **Base de compatibilidade:** as regras atuais cobrem o essencial (socket, RAM,
  fonte, gabinete, vídeo); uma base externa pode ampliá-las sem mudar o motor.

Veja o [ROADMAP.md](./ROADMAP.md) para o plano de fases completo.
