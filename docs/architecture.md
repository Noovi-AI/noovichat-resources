# Arquitetura Técnica do NooviChat

Este documento descreve o stack técnico público do NooviChat — suficiente para avaliação técnica, integração e deployment. Detalhes proprietários dos módulos NooviChat (Pipeline Pro, Noovi Labs, licensing) não são expostos aqui.

## Visão Geral

NooviChat é um fork do [Chatwoot](https://www.chatwoot.com/) (open-source MIT) com módulos proprietários adicionados. A arquitetura base é a do Chatwoot: Rails API + Vue.js frontend + PostgreSQL + Redis.

```
┌─────────────────────────────────────────────────┐
│                    Internet                      │
└──────────────────────┬──────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Nginx (SSL)   │
              │  Reverse Proxy  │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
  ┌──────▼──────┐ ┌────▼────┐ ┌─────▼─────┐
  │  Rails API  │ │  Vue.js │ │  WAHA Plus │
  │  (Chatwoot  │ │Frontend │ │  (Docker)  │
  │   + Noovi)  │ └─────────┘ └─────┬─────┘
  └──────┬──────┘                   │ WhatsApp
         │                          │
    ┌────▼────┐    ┌─────────┐      │
    │PostgreSQL│    │  Redis  │      │
    │+ pgvector│    │+ Sidekiq│      │
    └──────────┘    └─────────┘      │
         │                          │
    ┌────▼──────────────────────────▼─┐
    │         Action Cable            │
    │   (WebSockets — tempo real)     │
    └─────────────────────────────────┘
```

## Componentes

### Rails API (Backend)

- **Base**: Chatwoot upstream (Ruby on Rails, API-only mode)
- **Extensões NooviChat**: módulos proprietários montados como engines/concerns
- **Porta**: 3000 (interno)
- **Jobs**: Sidekiq com Redis para processamento assíncrono (broadcasts, follow-ups, lead scoring)
- **WebSockets**: Action Cable para atualizações em tempo real

### Vue.js Frontend

- **Base**: Chatwoot upstream frontend
- **Build**: Vite
- **Extensões**: componentes Pipeline Pro, FlowBuilder, WhiteLabel UI

### PostgreSQL + pgvector

- **Versão recomendada**: PostgreSQL 15+
- **Extensão**: `pgvector` para embeddings do Captain AI (Knowledge Base RAG)
- **Port**: 5432 (interno apenas)
- **Backup**: `pg_dump` diário recomendado

### Redis + Sidekiq

- **Redis**: cache de sessões, jobs queue, Action Cable pub/sub
- **Sidekiq**: workers para broadcasts, follow-ups, sincronização de CRM
- **Port**: 6379 (interno apenas)

### WAHA Plus (WhatsApp HTTP API)

- Container Docker separado
- Expõe API REST em porta configurável
- NooviChat se comunica com WAHA via HTTP interno
- Persiste sessões WhatsApp em volume Docker
- Documentação: [waha.dev](https://waha.dev)

### Nginx

- Reverse proxy para Rails e Vue.js
- Termina SSL/TLS (Let's Encrypt via Certbot)
- Serve assets estáticos diretamente
- Configuração de WebSocket proxy para Action Cable

## Deployment

### Requisitos mínimos (VPS)

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| CPU | 2 vCPUs | 4 vCPUs |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB SSD | 80 GB SSD |
| SO | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### Docker Compose (produção)

NooviChat roda via Docker Compose ou Docker Swarm. O auto-instalador configura:

1. Container `noovichat` (Rails API + Vue.js assets)
2. Container `postgres` (PostgreSQL + pgvector)
3. Container `redis` (Redis)
4. Container `sidekiq` (workers)
5. Container `waha` (WAHA Plus)
6. Nginx no host (reverse proxy + SSL)

### Auto-instalador

```bash
# Instalação completa em 1 comando:
curl -fsSL https://get.noovichat.com | bash
```

O script interativo coleta domínio, email para SSL e chave de licença, depois configura tudo automaticamente.

### Portas públicas

| Porta | Serviço |
|-------|---------|
| 80 | HTTP (redireciona para HTTPS) |
| 443 | HTTPS (Nginx) |

Todas as outras portas (3000, 5432, 6379, WAHA) ficam na rede Docker interna — não expostas à internet.

## Integrações disponíveis

| Integração | Método | Docs |
|------------|--------|------|
| WhatsApp (WAHA) | Inbox nativo | [docs/integrations/n8n.md](integrations/n8n.md) |
| WhatsApp Cloud API | Inbox nativo | Docs Chatwoot oficial |
| n8n | Community node | [docs/integrations/n8n.md](integrations/n8n.md) |
| Claude / Cursor | MCP server | [docs/integrations/mcp.md](integrations/mcp.md) |
| Pipedrive | n8n workflow | [examples/n8n-workflows/](../examples/n8n-workflows/) |
| RD Station | n8n workflow | [examples/n8n-workflows/](../examples/n8n-workflows/) |
| Google Calendar | Appointments | Painel NooviChat |
| OpenAI (GPT-4) | Captain AI | Settings → Integrations |
| Webhooks | Outgoing webhooks | Settings → Integrations |

## Segurança

- HTTPS obrigatório (Let's Encrypt)
- Todas as portas de banco de dados e cache ficam na rede Docker interna
- Secrets via variáveis de ambiente (não hardcoded)
- Backup automático recomendado via `pg_dump` + armazenamento offsite
- Ver [docs/tutorials/backup-restore.md](tutorials/backup-restore.md)
