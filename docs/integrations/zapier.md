# Integração com Zapier

NooviChat integra com Zapier via webhooks de saída (NooviChat → Zapier) e via API REST (Zapier → NooviChat). Use para conectar com mais de 7.000 apps sem código.

> **Recomendação**: Para automações complexas com lógica condicional, prefira n8n (self-hosted, mais poderoso, sem custo por tarefa). Zapier é ótimo para integrações simples e rápidas.

## NooviChat → Zapier (Trigger)

### Configurar Webhook Catch no Zapier

1. Em Zapier, crie um novo Zap
2. Trigger: **Webhooks by Zapier → Catch Hook**
3. Copie a URL gerada pelo Zapier
4. No NooviChat: Settings → Integrations → Webhooks → Add
5. Cole a URL do Zapier e selecione os eventos desejados

### Exemplos de Zaps (NooviChat → Zapier)

**Nova conversa → Google Sheets:**
```
Trigger: NooviChat webhook (conversation.created)
Action: Google Sheets → Add Row
Fields: Nome, Telefone, Data, Agente, Inbox
```

**Card movido para "Fechado" → Slack:**
```
Trigger: NooviChat webhook (pipeline_card.stage_changed, to_stage=Fechado)
Action: Slack → Send message #vendas
Message: "🎉 Deal fechado: {{contact.name}} — R${{deal.value}}"
```

**Novo contato → Mailchimp:**
```
Trigger: NooviChat webhook (contact.created)
Action: Mailchimp → Add/Update Subscriber
Fields: name, email → lista "Leads NooviChat"
```

## Zapier → NooviChat (Action)

Use a API REST do NooviChat como action no Zapier via **Webhooks by Zapier → POST**.

### Criar conversa via Zapier

```
Zapier Action: Webhooks → POST
URL: https://sua-instancia.com/api/v1/conversations
Headers: api_access_token: seu_token
Body (JSON):
{
  "inbox_id": 5,
  "contact_id": "{{zapier_contact_id}}",
  "message": {
    "content": "Olá {{first_name}}, vimos que você preencheu nosso formulário!"
  }
}
```

### Criar contato via Zapier

```
POST https://sua-instancia.com/api/v1/contacts
{
  "name": "{{name}}",
  "phone_number": "{{phone}}",
  "email": "{{email}}",
  "identifier": "zapier-{{id}}"
}
```

## Obter API token

1. No NooviChat: Settings → API Access Tokens
2. Crie um token com permissão de escrita
3. Use no header: `api_access_token: seu_token`

## Zaps populares por categoria

### CRM e Vendas
- Typeform/Tally preenchido → Criar contato + conversa NooviChat
- Deal fechado NooviChat → Criar fatura no Stripe
- Novo trial cadastrado → Adicionar no pipeline NooviChat

### Marketing
- Lead do Facebook Lead Ads → Contato NooviChat + mensagem de boas-vindas
- Inscrito no Mailchimp → Label "newsletter" no NooviChat
- HubSpot deal criado → Card no Pipeline Pro NooviChat

### Suporte
- Ticket Zendesk criado → Conversa NooviChat para acompanhamento
- NPS abaixo de 7 → Conversa urgente no NooviChat com supervisor

## Limitações do Zapier vs n8n

| Critério | Zapier | n8n |
|----------|--------|-----|
| Custo | Por tarefa ($19.99-799/mês) | Self-hosted gratuito |
| Lógica condicional | Limitada | Total (code nodes) |
| Loops e iterações | Não | Sim |
| Latência | 1-15 min (plano free) | Tempo real |
| Debug | Básico | Completo com logs |

Para automações críticas de atendimento, prefira n8n. Zapier é útil para conectar com apps que ainda não têm nó n8n.
