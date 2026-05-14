# NooviChat — Visão Geral

NooviChat é um **fork comercial brasileiro do [Chatwoot](https://www.chatwoot.com/)** — a plataforma open-source de atendimento omnichannel. NooviChat estende o Chatwoot com módulos proprietários focados no mercado brasileiro: Pipeline CRM em kanban, integração WAHA para WhatsApp sem API oficial, auto-instalador via curl, suporte 100% PT-BR e WhiteLabel completo.

## O que o NooviChat resolve

Empresas brasileiras que tentam usar o Chatwoot upstream enfrentam 4 problemas:

1. **Sem CRM nativo** — precisam integrar Pipedrive ou outro CRM externo, aumentando complexidade e custo
2. **Sem WAHA** — Chatwoot upstream só conecta WhatsApp via Cloud API oficial (requer aprovação Meta e paga por conversa)
3. **Setup complexo** — instalação manual de Docker, PostgreSQL, Redis, Nginx e SSL exige conhecimento técnico
4. **Sem suporte em português** — Chatwoot é mantido na Índia em inglês

NooviChat resolve todos esses pontos com módulos integrados.

## Principais módulos

### Pipeline Pro (CRM Kanban)

Pipeline CRM em kanban inspirado no Pipedrive, integrado diretamente ao atendimento:

- Múltiplos funis customizáveis (Vendas, Suporte, Pós-venda, etc.)
- Cards arrastáveis com deals, revenue tracking e timeline de atividades
- Lead scoring automático por regras configuráveis
- Automações por estágio (webhooks, notificações, atribuições)
- Sincronização bidirecional com Pipedrive e RD Station via n8n

### Integração WhatsApp Completa

- **WAHA Plus** (incluído nos planos pagos) — WhatsApp sem API oficial, ideal para PMEs
- **UAZAPI** — alternativa ao WAHA com suporte a multi-device
- **WhatsApp Cloud API** — integração oficial Meta para grandes volumes
- Templates avançados de WhatsApp Business (componentes, parâmetros nomeados, botões URL)

### Broadcasts

- Envios em massa com segmentação por labels, atributos e histórico
- Anti-block: batches com delay aleatório para reduzir risco de ban
- Agendamento de data/hora
- Relatórios de entrega, leitura e falhas

### Follow-ups Automáticos

- Regras configuráveis: "se contato não respondeu em X dias, enviar follow-up"
- Sequências de follow-up múltiplas
- Templates personalizáveis por estágio do pipeline

### Lead Scoring

- Regras baseadas em atributos de contato, comportamento e histórico de conversas
- Score calculado automaticamente
- Filtros e segmentação por score

### Captain AI (IA Nativa)

Módulo de IA do Chatwoot upstream — disponível no NooviChat:

- **Assistant**: agente autônomo que responde clientes 24/7
- **Copilot**: sugestões de resposta em tempo real para agentes humanos
- **Knowledge Base com RAG**: responde com base em documentos da empresa (pgvector)
- Configurável com GPT-4, GPT-4o, GPT-3.5-turbo (chave OpenAI própria)

### Noovi Labs (FlowBuilder)

- Builder visual de automações estilo n8n dentro do painel
- Triggers baseados em eventos do Chatwoot (nova conversa, label adicionado, estágio de pipeline)
- Ações: enviar mensagem, criar card, atualizar contato, chamar webhook

### Appointments (Agendamentos)

- Integração com Google Calendar
- Links de agendamento self-service para clientes
- Sincronização automática com conversas

### Internal Chat

- Chat interno entre agentes (fora das conversas de clientes)
- Menções (@agente), threads, compartilhamento de arquivos

### WhiteLabel

- Logo, cores e domínio customizáveis no Super Admin
- Revendedores podem oferecer como produto próprio
- Painel de controle de instâncias multi-tenant

### Auto-instalador

```bash
curl -fsSL https://get.noovichat.com | bash
```

Configura NooviChat + PostgreSQL + Redis + Nginx + SSL em um único VPS em menos de 10 minutos.

## Modelo de licenciamento

NooviChat usa licenciamento comercial sobre a base open-source MIT do Chatwoot:

| Plano | Preço | Instâncias VPS | WAHA Plus |
|-------|-------|----------------|-----------|
| Mensal | R$197/mês | 1 | Incluído |
| Semestral | R$167/mês (eq.) | 1 | Incluído |
| Anual | R$147/mês (eq.) | 2 | Incluído |

Trial gratuito de 7 dias, sem cartão de crédito.

## Stack técnico

- **Backend**: Ruby on Rails (fork do Chatwoot)
- **Frontend**: Vue.js (fork do Chatwoot)
- **Site comercial**: Next.js + Go (Noovi)
- **Banco de dados**: PostgreSQL + pgvector
- **Cache/fila**: Redis + Sidekiq
- **WhatsApp**: WAHA Plus (Docker)
- **Deploy**: Docker Swarm (multi-node opcional)

## Compatibilidade com Chatwoot upstream

NooviChat faz upstream sync periódico com o repositório oficial do Chatwoot, incorporando features novas e patches de segurança. O schema do banco é compatível — migração do Chatwoot upstream para NooviChat é direta via backup/restore de PostgreSQL.

## Recursos adicionais

- [Documentação](https://docs.noovichat.com)
- [Pricing](https://noovichat.com/pricing)
- [Auto-instalador](https://noovichat.com)
- [API Reference](https://www.chatwoot.com/developers/api/) (base Chatwoot)
- [n8n nodes](https://www.npmjs.com/package/@nooviai/n8n-nodes-noovichat)
- [MCP server](https://www.npmjs.com/package/@nooviai/noovichat-mcp)
