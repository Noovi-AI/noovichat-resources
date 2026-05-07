# Integração com n8n — community node oficial

NooviChat tem **community node oficial no n8n**, distribuído via npm:
[`@nooviai/n8n-nodes-noovichat`](https://www.npmjs.com/package/@nooviai/n8n-nodes-noovichat).

Permite usar NooviChat como **source** (trigger) e **sink** (action) em
qualquer workflow n8n, sem precisar reinventar HTTP requests pra API.

## Instalação no n8n

### Em n8n self-hosted (Docker / npm)

```bash
# Dentro do container/VPS do n8n
npm install @nooviai/n8n-nodes-noovichat
# Restart n8n
```

Ou via UI: Settings → Community Nodes → Install → buscar `@nooviai/n8n-nodes-noovichat`.

### Em n8n cloud (n8n.io)

n8n Cloud não suporta community nodes na maioria dos planos. Opções:
- Plano Pro/Enterprise da n8n.io (suporte a community nodes)
- Self-hosted (recomendado, ainda mais barato)

## Credencial NooviChat

Após instalar, criar credencial:

1. n8n → Credentials → New
2. Tipo: **NooviChat API**
3. Preencher:
   - **Base URL**: `https://chat.suaempresa.com.br` (sua URL do NooviChat)
   - **API Access Token**: pegar em Profile Settings → API Access Token (no NooviChat)

## Resources e operations disponíveis

### Conversations

| Operation | Endpoint |
|---|---|
| List | GET /api/v1/accounts/:id/conversations |
| Get | GET /api/v1/accounts/:id/conversations/:display_id |
| Create | POST /api/v1/accounts/:id/conversations |
| Update status | POST /api/v1/accounts/:id/conversations/:display_id/toggle_status |
| Assign | POST /api/v1/accounts/:id/conversations/:display_id/assignments |
| Add label | POST /api/v1/accounts/:id/conversations/:display_id/labels |

### Messages

| Operation | Endpoint |
|---|---|
| Send | POST /api/v1/accounts/:id/conversations/:display_id/messages |
| List | GET /api/v1/accounts/:id/conversations/:display_id/messages |
| Update | PUT (limited) |
| Delete | DELETE |

### Contacts

| Operation | Endpoint |
|---|---|
| List | GET /api/v1/accounts/:id/contacts |
| Create | POST /api/v1/accounts/:id/contacts |
| Update | PATCH /api/v1/accounts/:id/contacts/:id |
| Search | POST /api/v1/accounts/:id/contacts/search |

### Pipeline Cards (Pipeline Pro)

| Operation | Endpoint |
|---|---|
| List | GET /api/v1/accounts/:id/pipeline_cards |
| Create | POST /api/v1/accounts/:id/pipeline_cards |
| Update | PATCH /api/v1/accounts/:id/pipeline_cards/:id |
| Move stage | PATCH (com nova `pipeline_stage`) |
| Delete | DELETE |

### Outros recursos

- **Pipelines**: CRUD completo
- **Funnels**: CRUD
- **Labels, Teams, Inboxes, Agents**
- **Broadcasts**: criar campanha em massa
- **Follow-ups**: configurar follow-up automático
- **Lead Scoring Rules**
- **Custom Attributes**
- **Canned Responses**

## Trigger node — eventos

O `NooviChatTrigger` reage a webhooks emitidos pelo NooviChat. Eventos
disponíveis:

- `conversation_created`
- `conversation_status_changed`
- `conversation_resolved`
- `conversation_label_added` / `removed`
- `conversation_assignee_changed`
- `message_created` (incluindo de WhatsApp, Instagram, e-mail)
- `contact_created` / `updated`
- `pipeline_card_created`
- `pipeline_card_moved` (entre stages)
- `pipeline_card_won` / `lost`
- `pipeline_card_owner_changed`

## Exemplo de workflow — auto-followup 3 dias

Veja [examples/n8n-workflows/auto-followup-3dias.json](../../examples/n8n-workflows/auto-followup-3dias.json).

Lógica:
1. Trigger: `conversation_status_changed` to `resolved`
2. Wait: 3 dias
3. Check: `conversation` ainda está `resolved`?
4. Se sim: send_message no NooviChat com pergunta de NPS

## Exemplo — sync com Pipedrive

Veja [examples/n8n-workflows/crm-pipedrive-sync.json](../../examples/n8n-workflows/crm-pipedrive-sync.json).

Lógica:
1. Trigger: `pipeline_card_moved`
2. Buscar contact do card no NooviChat
3. Buscar deal correspondente no Pipedrive (por email)
4. Atualizar stage do deal no Pipedrive

## Troubleshooting

### "Authentication failed"

- Verifica que API Access Token está correto (sem espaços extras)
- Confirma que Base URL termina sem `/` (ex: `https://chat.empresa.com.br`, não `https://chat.empresa.com.br/`)
- Token de agent só vê dados da conta dele — pra ações cross-account use token de admin

### "Rate limit exceeded"

API tem rate limit por token: 60 requests/min. Adicione node "Wait" entre
operações de loop pra evitar throttle.

### "Trigger não dispara"

- Verifica que webhook foi registrado: NooviChat → Settings → Integrations → Webhooks
- A URL do webhook é `https://seu-n8n.com/webhook/<id-do-trigger>`
- Eventos selecionados batem com o que o trigger node escuta

## Recursos

- [Pacote no npm](https://www.npmjs.com/package/@nooviai/n8n-nodes-noovichat)
- [Documentação API NooviChat](https://noovichat.com/docs/noovichat)
- [Comunidade n8n](https://community.n8n.io/)

---

Próximo: [Integração via MCP server →](mcp.md)
