-- Habilita a extensão pgvector no primeiro start do banco.
-- Ainda não é usada pela aplicação: fica pronta para a busca semântica
-- de componentes/recomendações prevista no ROADMAP.
CREATE EXTENSION IF NOT EXISTS vector;
