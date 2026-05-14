# Webhooks — Integração em Tempo Real

NooviChat suporta webhooks de saída (outgoing) para notificar sistemas externos em tempo real sobre eventos que acontecem na plataforma.

## Configuração

### Adicionar webhook

1. **Settings → Integrations → Webhooks → Add new webhook**
2. Configure:
   - **URL**: endpoint do seu servidor/n8n/Zapier
   - **Events**: quais eventos disparar
   - **Name**: identificação interna (opcional)
3. Salve e o webhook está ativo imediatamente

### Eventos disponíveis

| Evento | Descrição |
|--------|-----------|
| `conversation.created` | Nova conversa iniciada |
| `conversation.status_changed` | Conversa aberta/resolvida/pendente |
| `conversation.updated` | Atributos da conversa atualizados |
| `message.created` | Nova mensagem (de cliente ou agente) |
| `contact.created` | Novo contato criado |
| `contact.updated` | Contato atualizado |
| `pipeline_card.created` | Card criado no Pipeline Pro |
| `pipeline_card.updated` | Card atualizado |
| `pipeline_card.stage_changed` | Card movido para outro estágio |
| `broadcast.sent` | Broadcast disparado |

## Formato do payload

### conversation.created

```json
{
  "event": "conversation.created",
  "data": {
    "id": 1234,
    "inbox_id": 5,
    "status": "open",
    "created_at": "2026-05-14T14:30:00Z",
    "contact": {
      "id": 456,
      "name": "João Silva",
      "phone_number": "+5511999990001",
      "email": "joao@empresa.com"
    },
    "assignee": {
      "id": 7,
      "name": "Maria Atendente"
    },
    "labels": ["lead-quente"],
    "custom_attributes": {
      "cargo": "Diretor",
      "empresa_setor": "Tecnologia"
    }
  }
}
```

### message.created

```json
{
  "event": "message.created",
  "data": {
    "id": 9876,
    "conversation_id": 1234,
    "content": "Olá, quero saber mais sobre os planos",
    "message_type": "incoming",
    "created_at": "2026-05-14T14:30:05Z",
    "sender": {
      "type": "contact",
      "id": 456,
      "name": "João Silva"
    },
    "attachments": []
  }
}
```

### pipeline_card.stage_changed

```json
{
  "event": "pipeline_card.stage_changed",
  "data": {
    "card_id": 321,
    "pipeline_id": 1,
    "contact_id": 456,
    "from_stage": "Prospect",
    "to_stage": "Qualificado",
    "changed_by": "Maria Atendente",
    "changed_at": "2026-05-14T15:00:00Z"
  }
}
```

## Verificação de assinatura

Para garantir que o webhook veio do NooviChat, verificamos uma assinatura HMAC-SHA256:

```
Header: X-Noovichat-Signature: sha256=<hmac>
```

Verificação em Node.js:

```javascript
const crypto = require('crypto');

function verifyWebhook(secret, payload, signature) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

O secret é configurado em Settings → Integrations → Webhooks ao criar o webhook.

## Retry policy

Se o endpoint retornar HTTP 4xx ou 5xx, ou timeout > 5s:

- Retry após 5 minutos (1x)
- Retry após 30 minutos (1x)
- Retry após 2 horas (1x)
- Após 3 falhas, o webhook é marcado como inativo (reativar em Settings)

## Boas práticas

1. **Responda rápido**: retorne HTTP 200 imediatamente, processe assincronamente
2. **Idempotência**: seu servidor deve lidar com mensagens duplicadas (retries)
3. **Verificação de assinatura**: sempre valide antes de processar
4. **Filtro de eventos**: assine apenas os eventos que realmente precisa — menos ruído
5. **Logs**: guarde os payloads recebidos por pelo menos 7 dias para debug

## Usar com n8n

O n8n é a forma mais fácil de consumir webhooks NooviChat sem código:

1. Crie um nó **Webhook** no n8n — ele gera a URL automaticamente
2. Adicione essa URL no NooviChat em Settings → Webhooks
3. Use o nó **NooviChat** (@nooviai/n8n-nodes-noovichat) para ações de retorno

Ver [examples/n8n-workflows/](../../examples/n8n-workflows/) para workflows prontos.
