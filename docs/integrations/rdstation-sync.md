# Sincronização com RD Station

Integre NooviChat com RD Station Marketing e RD Station CRM via n8n para sincronizar leads, oportunidades e histórico de atendimento.

## Pré-requisitos

- NooviChat com Pipeline Pro
- Conta RD Station (Marketing ou CRM)
- n8n com `@nooviai/n8n-nodes-noovichat`

## Casos de uso

### Lead do RD Station para NooviChat

Um lead converte em formulário no RD Station → automaticamente inicia conversa no NooviChat:

```
RD Station (novo lead) → n8n → NooviChat (criar contato + conversa)
```

Prático para: leads de landing page, webinar, trial de produto.

### Qualificação NooviChat → RD Station

Lead qualificado no Pipeline Pro → muda stage no RD Station CRM:

```
NooviChat (card movido para "Qualificado") → n8n → RD Station CRM (stage updated)
```

### Histórico de atendimento no RD Station

Toda conversa no NooviChat gera uma activity no RD Station CRM:

```
NooviChat (conversa resolvida) → n8n → RD Station CRM (activity criada)
```

## Configuração

### RD Station Marketing

1. Em **RD Station → Integrações → API**, gere um token de API
2. No n8n, configure a credential **RD Station** com o token
3. Use o nó HTTP Request para chamar a [API RD Station](https://developers.rdstation.com/reference/leads)

**Endpoints principais:**

```
POST /platform/contacts
  Body: { "contact": { "name": "...", "email": "...", "personal_phone": "..." } }

POST /platform/events
  Body: { "event_type": "OPPORTUNITY", "event_family": "CDP", "payload": {...} }
```

### RD Station CRM

1. Em **RD Station CRM → Configurações → API**, gere token OAuth
2. Use o nó HTTP Request no n8n para chamar a [API RD CRM](https://developers.rdstation.com/reference/crm-overview)

**Endpoints principais:**

```
POST /api/v1/deals          # Criar oportunidade
PATCH /api/v1/deals/{id}    # Atualizar estágio
POST /api/v1/activities     # Criar atividade
```

## Workflow de referência

Exemplo de workflow n8n para lead de formulário RD → NooviChat:

```
1. Webhook trigger (RD Station webhook de novo lead)
2. Formatar dados do contato
3. Nó NooviChat: criar contato
4. Nó NooviChat: criar conversa com mensagem de boas-vindas
5. Nó NooviChat: atribuir a agente com menor carga
```

## Dicas RD Station específicas

- **UTM tracking**: preserve os parâmetros UTM ao criar contatos no NooviChat via atributos customizados
- **Score RD**: sincronize o lead score do RD Station como atributo no NooviChat para enriquecer o Pipeline Pro
- **Funis separados**: use funis diferentes no Pipeline Pro para leads vindos do RD vs leads orgânicos
