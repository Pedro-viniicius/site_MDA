# ROADMAP — Plataforma MDA

Plano de evolução do produto, em fases pequenas e seguras. Cada fase entrega valor
por si só e prepara a seguinte.

## ✅ Fase 0 — Fundação (concluída)

- Monorepo (Next.js + FastAPI + PostgreSQL) com Docker Compose
- Identidade visual aplicada a partir dos arquivos da marca
- Home, vitrine de PCs prontos, onboarding guiado e página de recomendação
- Motor determinístico de recomendação + regras de compatibilidade
- Camada de IA com provedor mock (funciona sem chave de API)
- Painel admin (visão geral, catálogo/builds em leitura, leads reais, visão técnica)
- Seed em português com preços placeholder

## Fase 1 — MVP comercial

**Objetivo:** colocar no ar e gerar os primeiros orçamentos reais.

- [ ] Revisar textos e preços com o parceiro (substituir placeholders)
- [ ] Botão de WhatsApp real nos CTAs de contato/orçamento
- [ ] Notificação (e-mail/WhatsApp) quando chega um lead
- [ ] Domínio, HTTPS e analytics básico
- [ ] Ajustes de recomendação com feedback das primeiras vendas

## Fase 2 — Painel administrativo completo

**Objetivo:** o parceiro gerencia tudo sem mexer em código.

- [ ] Autenticação (login/senha, papéis admin/vendedor)
- [ ] CRUD de componentes, categorias e atributos de compatibilidade
- [ ] CRUD de builds pré-configuradas (montagem com validação de compatibilidade)
- [ ] Gestão de leads: status (novo → em contato → orçamento → fechado/perdido)
- [ ] Edição das regras de recomendação (faixas, pesos, perfis)

## Fase 3 — Catálogo real

**Objetivo:** sair dos placeholders.

- [ ] Cadastro de fornecedores e preços de custo
- [ ] Margens por categoria/build (preço de venda calculado)
- [ ] Controle simples de estoque (disponível/sob encomenda)
- [ ] Fotos reais dos produtos e das montagens

## Fase 4 — Recomendação com IA de verdade

**Objetivo:** explicações ainda mais naturais e personalizadas, com segurança.

- [ ] Implementar `ProvedorAnthropic` (Claude) com saída JSON validada
- [ ] Fallback automático para o mock em qualquer falha (já previsto na arquitetura)
- [ ] Busca semântica com pgvector (ex.: "programas citados" → requisitos)
- [ ] Avaliação: comparar recomendações IA × determinístico antes de ativar

## Fase 5 — Checkout e pagamento

**Objetivo:** fechar a venda dentro da plataforma.

- [ ] Orçamento formal em PDF com validade
- [ ] Pagamento (Pix, cartão, boleto) via gateway
- [ ] Acompanhamento do pedido (montagem → testes → envio/retirada)

## Fase 6 — WhatsApp e CRM

**Objetivo:** atendimento organizado e escalável.

- [ ] Integração com WhatsApp Business API (lead → conversa)
- [ ] CRM: histórico do cliente, funil e follow-up automático
- [ ] Pesquisa de satisfação pós-venda

## Fase 7 — Integração com fornecedores

**Objetivo:** catálogo e preços sempre atualizados.

- [ ] Importação de catálogos externos (API/planilha) para `attrs`
- [ ] Comparação automática de preço por componente
- [ ] Alertas de mudança de preço/disponibilidade

## Fase 8 — Produção e escala

**Objetivo:** operação estável e observável.

- [ ] Deploy em nuvem (VPS ou serviço gerenciado) com CI/CD
- [ ] Backups automáticos do banco
- [ ] Monitoramento (logs, erros, uptime) e alertas
- [ ] Testes automatizados (API e fluxo de recomendação) no pipeline
