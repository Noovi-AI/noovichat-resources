# Integração via MCP server

NooviChat tem **MCP (Model Context Protocol) server oficial**, distribuído
via npm: [`@nooviai/noovichat-mcp`](https://www.npmjs.com/package/@nooviai/noovichat-mcp).

Permite usar NooviChat diretamente em qualquer aplicação compatível com MCP
via transport stdio. ~138 tools disponíveis cobrindo todas as áreas
funcionais do produto:

- Pipeline Pro (cards, stages, automations, sequences) — custom NooviChat
- Noovi Labs / FlowBuilder — custom NooviChat
- Follow-Ups — custom NooviChat
- Broadcasts — custom NooviChat
- Lead Scoring — custom NooviChat
- Companies (B2B) — custom NooviChat
- Appointments — custom NooviChat
- Internal Chat — custom NooviChat
- WhatsApp Templates avançados — custom NooviChat
- WAHA / UAZAPI integration — custom NooviChat
- Atendimentos / Conversations (upstream Chatwoot)
- Captain AI hooks (Captain é upstream; expomos via tools de integração)

## O que é MCP

[Model Context Protocol](https://modelcontextprotocol.io) é um padrão
aberto para conectar aplicações a fontes externas de dados e ferramentas
via contratos JSON-RPC sobre stdio (ou HTTP). Qualquer host compatível
com MCP pode usar o `noovichat-mcp` para interagir com sua instância
NooviChat sem precisar reimplementar HTTP requests.

## Instalação

### Via npx (recomendado, sempre na versão mais recente)

```bash
npx -y @nooviai/noovichat-mcp
```

### Via npm install global

```bash
npm install -g @nooviai/noovichat-mcp
noovichat-mcp
```

## Configuração

O servidor lê duas variáveis de ambiente:

| Variável | Obrigatória | Exemplo |
|---|---|---|
| `NOOVICHAT_BASE_URL` | Sim | `https://chat.suaempresa.com.br` |
| `NOOVICHAT_API_TOKEN` | Sim | API Access Token do agente/admin |

Configuração típica em arquivos JSON de hosts MCP-compatible:

```json
{
  "mcpServers": {
    "noovichat": {
      "command": "npx",
      "args": ["-y", "@nooviai/noovichat-mcp"],
      "env": {
        "NOOVICHAT_BASE_URL": "https://chat.suaempresa.com.br",
        "NOOVICHAT_API_TOKEN": "seu-api-access-token-aqui"
      }
    }
  }
}
```

Consulte a documentação do seu host MCP-compatible para o caminho correto
do arquivo de configuração.

## Pegar API Access Token

1. Login no NooviChat
2. Profile (canto superior direito) → Settings
3. Aba "API"
4. Copiar `Access Token`

Token tem permissões do usuário que gerou. Para ações cross-account, use
token de administrator.

## Tools disponíveis (overview)

O servidor expõe ~138 tools organizadas por recurso. Lista completa via
JSON-RPC:

```bash
echo '{"method":"tools/list","jsonrpc":"2.0","id":1}' | npx -y @nooviai/noovichat-mcp
```

Resumo por categoria:

### Pipeline Pro (CRM)
- `pipelines_list`, `pipelines_get`, `pipelines_create`, `pipelines_update`, `pipelines_delete`
- `pipeline_cards_list`, `pipeline_cards_get`, `pipeline_cards_create`, `pipeline_cards_update` (move stage), `pipeline_cards_delete`
- `pipeline_automations_list`, `pipeline_automations_create`, `pipeline_automations_test`
- `pipeline_activities_list`, `pipeline_activities_create`, `pipeline_activities_complete`
- `pipeline_card_sequences_*` (~8 tools)

### Atendimentos
- `conversations_list`, `conversations_get`, `conversations_create`
- `conversations_assign`, `conversations_resolve`, `conversations_reopen`
- `messages_list`, `messages_send`, `messages_send_with_attachment`
- `conversations_add_label`, `conversations_remove_label`
- `bulk_actions_*`, `forwards_*`, `merge_*`

### Contatos
- `contacts_list`, `contacts_get`, `contacts_search`, `contacts_create`, `contacts_update`
- `companies_*`, `contact_consent_*`, `contact_appointment_history_*`

### Broadcasts (Disparador em Massa)
- `broadcasts_list`, `broadcasts_create`, `broadcasts_update`
- `broadcasts_pause`, `broadcasts_resume`, `broadcasts_cancel`
- `broadcasts_metrics_get`

### Follow-Ups
- `follow_ups_list`, `follow_ups_create`, `follow_ups_cancel`
- `follow_ups_retry_send`

### WhatsApp Templates
- `whatsapp_templates_list`, `whatsapp_templates_get`, `whatsapp_templates_create`, `whatsapp_templates_update`, `whatsapp_templates_delete`, `whatsapp_templates_sync`

### WAHA & UAZAPI
- `waha_*` (gerenciar instâncias WhatsApp via WAHA)
- `uazapi_*` (gerenciar instâncias WhatsApp via UAZAPI)

### Lead Scoring
- `lead_scoring_rules_*`, `lead_scoring_logs_*`, `lead_scoring_reports_*`
- `pipeline_lead_scores_recalculate`, `pipeline_lead_scores_override`

### Internal Chat
- `internal_chats_list`, `internal_chats_create_dm`, `internal_chats_create_group`
- `internal_chat_messages_*`, `internal_chats_add_members`, `internal_chats_remove_member`

### Captain AI (upstream Chatwoot — expostos via MCP)
- `captain_assistants_*`, `captain_documents_*`, `captain_tasks_*`

## Exemplos de uso

### Listar pipelines mais ativos

Tool: `pipelines_list`
Args: `{ "filters": { "active_since_days": 7 } }`

### Criar broadcast em massa por tag

Tool: `broadcasts_create`
Args:
```json
{
  "broadcast": {
    "name": "Promoção Maio",
    "source_type": "tags",
    "source_config": { "tag_ids": [123] },
    "inbox_ids": [2],
    "message_payload": {
      "messages": [{ "type": "text", "content": "Promoção exclusiva!" }]
    }
  }
}
```

### Mover card no kanban

Tool: `pipeline_cards_update`
Args: `{ "id": 45, "data": { "pipeline_stage": "qualified" } }`

### Workflow encadeado (vários tool calls)

Hosts MCP-compatible podem encadear múltiplas tool calls em um único
contexto. Exemplo:

1. `lead_scoring_logs_list` (filtrar eventos de resposta últimos 30 dias)
2. `pipeline_cards_list` (filtrar status diferente de won/lost)
3. Cruzar resultados em memória do host
4. `pipeline_cards_update` em loop (move stage)
5. `pipeline_activities_create` em loop (cria tarefa por card)

## Troubleshooting

### "Connection failed"

- `npx` requer Node 18+ instalado no sistema
- Verifica que API token está correto:
  ```bash
  curl -H "api_access_token: $NOOVICHAT_API_TOKEN" \
    "$NOOVICHAT_BASE_URL/api/v1/accounts/1/profile"
  ```
- Firewall não bloqueia npm registry

### "Tool not found"

- Pacote pode estar desatualizado:
  ```bash
  npm view @nooviai/noovichat-mcp version
  ```
- Limpar cache npx:
  ```bash
  npx --yes --no-install-cache @nooviai/noovichat-mcp
  ```

### Listar tools disponíveis

```bash
echo '{"method":"tools/list","jsonrpc":"2.0","id":1}' \
  | NOOVICHAT_BASE_URL=https://chat.suaempresa.com.br \
    NOOVICHAT_API_TOKEN=seu-token \
    npx -y @nooviai/noovichat-mcp
```

## Segurança

- Token tem permissões do usuário — **não compartilhe**
- Cada tool call é registrada no audit log do NooviChat
- Tools destrutivas (DELETE) sempre exigem confirmação do host MCP
- Rate limit: ~60 req/min por token

## Recursos

- [Pacote no npm](https://www.npmjs.com/package/@nooviai/noovichat-mcp)
- [Especificação MCP oficial](https://modelcontextprotocol.io)
- [API REST do NooviChat](https://noovichat.com/docs/noovichat)

---

Próximo: [Sync com Pipedrive →](pipedrive-sync.md)
