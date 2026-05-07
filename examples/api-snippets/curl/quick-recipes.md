# NooviChat API — Quick recipes (curl)

Receitas rápidas pra interagir com a API REST do NooviChat usando `curl`.
Substitua placeholders:

- `$BASE_URL` = sua URL do NooviChat (ex: `https://chat.suaempresa.com.br`)
- `$TOKEN` = API Access Token (Profile → Settings → API)
- `$ACC` = ID da sua conta (geralmente `1`)

## Setup

```bash
export BASE_URL="https://chat.suaempresa.com.br"
export TOKEN="sua-chave-aqui"
export ACC=1
export AUTH="-H api_access_token:$TOKEN"
```

## Conversações

### Listar conversações abertas
```bash
curl $AUTH "$BASE_URL/api/v1/accounts/$ACC/conversations?status=open&page=1"
```

### Obter conversa específica
```bash
curl $AUTH "$BASE_URL/api/v1/accounts/$ACC/conversations/42"
```

### Criar conversa nova
```bash
curl -X POST $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/conversations" \
  -d '{
    "source_id": "5511999998888@c.us",
    "inbox_id": 1,
    "contact_id": 123,
    "status": "open"
  }'
```

### Enviar mensagem
```bash
curl -X POST $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/conversations/42/messages" \
  -d '{
    "content": "Olá! Como posso ajudar?",
    "message_type": "outgoing"
  }'
```

### Resolver conversa
```bash
curl -X POST $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/conversations/42/toggle_status" \
  -d '{"status": "resolved"}'
```

## Contatos

### Buscar contato por nome
```bash
curl $AUTH "$BASE_URL/api/v1/accounts/$ACC/contacts/search?q=João&include=contact_inboxes"
```

### Criar contato
```bash
curl -X POST $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/contacts" \
  -d '{
    "name": "João Silva",
    "email": "joao@empresa.com",
    "phone_number": "+5511999998888",
    "custom_attributes": {"empresa": "Acme Corp", "cargo": "Gerente"}
  }'
```

### Atualizar contato
```bash
curl -X PATCH $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/contacts/123" \
  -d '{"name": "João da Silva", "custom_attributes": {"interesse": "premium"}}'
```

## Pipeline Pro

### Listar pipelines
```bash
curl $AUTH "$BASE_URL/api/v1/accounts/$ACC/pipelines"
```

### Criar card num pipeline
```bash
curl -X POST $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/pipeline_cards" \
  -d '{
    "title": "Lead João Silva",
    "pipeline_id": 1,
    "pipeline_stage": "lead",
    "contact_id": 123,
    "expected_revenue": 5000,
    "tags": ["site", "interesse-alto"]
  }'
```

### Mover card para outro estágio
```bash
curl -X PATCH $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/pipeline_cards/45" \
  -d '{"pipeline_stage": "qualified"}'
```

### Marcar como ganho
```bash
curl -X PATCH $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/pipeline_cards/45" \
  -d '{
    "pipeline_stage": "won",
    "won_value": 5000,
    "won_at": "2026-05-07T10:00:00Z"
  }'
```

## Broadcasts

### Criar broadcast (campanha em massa)
```bash
curl -X POST $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/broadcasts" \
  -d '{
    "broadcast": {
      "name": "Promoção Maio 2026",
      "source_type": "tags",
      "source_config": {"tag_ids": [5]},
      "inbox_ids": [2],
      "rotation_mode": "round_robin",
      "delay_min_seconds": 5,
      "delay_max_seconds": 30,
      "message_type": "custom",
      "message_payload": {
        "messages": [{"type": "text", "content": "Oi {{name}}! Promoção exclusiva..."}]
      },
      "enable_spintax": true,
      "start_mode": "immediate"
    }
  }'
```

## Labels e Tags

### Adicionar label a uma conversa
```bash
curl -X POST $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/conversations/42/labels" \
  -d '{"labels": ["urgente", "vip"]}'
```

## Inboxes

### Listar inboxes
```bash
curl $AUTH "$BASE_URL/api/v1/accounts/$ACC/inboxes"
```

## Webhooks

### Configurar webhook de saída
```bash
curl -X POST $AUTH -H "Content-Type: application/json" \
  "$BASE_URL/api/v1/accounts/$ACC/webhooks" \
  -d '{
    "url": "https://seu-servidor.com/webhook",
    "subscriptions": ["conversation_created", "message_created", "pipeline_card_moved"]
  }'
```

## Headers úteis

| Header | Quando usar |
|---|---|
| `api_access_token: $TOKEN` | Autenticação como agente/admin |
| `Content-Type: application/json` | Em todo POST/PATCH/PUT |
| `Accept: application/json` | Forçar response JSON |

## Códigos de status comuns

| Code | Significado |
|---|---|
| 200 | OK |
| 201 | Created (após POST que criou recurso) |
| 204 | No Content (após DELETE) |
| 400 | Bad Request (JSON malformado) |
| 401 | Unauthorized (token inválido) |
| 403 | Forbidden (token válido mas sem permissão) |
| 404 | Not Found (cross-tenant também retorna 404) |
| 422 | Unprocessable Entity (validação falhou) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error (reportar) |

## Rate limits

- 60 requests/minuto por API token (default)
- 1000 requests/minuto por IP
- Bulk endpoints (`/bulk_actions`) têm limite separado

Quando atingir 429, response inclui `Retry-After: <seconds>` — espere e
re-tente.

---

**Documentação completa da API**: https://noovichat.com/docs/noovichat
