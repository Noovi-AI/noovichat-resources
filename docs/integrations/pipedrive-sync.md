# Sincronização com Pipedrive

Sincronize leads e deals entre NooviChat Pipeline Pro e Pipedrive via n8n. A sincronização é bidirecional: deals criados no NooviChat aparecem no Pipedrive e vice-versa.

## Pré-requisitos

- NooviChat com Pipeline Pro ativo
- Conta Pipedrive com API key
- n8n instalado ([n8n.io](https://n8n.io)) ou n8n cloud
- `@nooviai/n8n-nodes-noovichat` instalado no n8n

## Fluxo de sincronização

```
NooviChat (deal criado/atualizado)
  → n8n webhook trigger
  → Busca/cria deal no Pipedrive
  → Atualiza estágio e campos

Pipedrive (deal atualizado)
  → Pipedrive webhook
  → n8n trigger
  → Atualiza card no NooviChat Pipeline Pro
```

## Configuração rápida

### 1. Configure o webhook no NooviChat

Settings → Integrations → Webhooks → Add new webhook:
- URL: `https://seu-n8n.com/webhook/noovichat-pipedrive`
- Events: `pipeline_card.created`, `pipeline_card.updated`, `pipeline_card.stage_changed`

### 2. Importe o workflow n8n

Baixe e importe: [crm-pipedrive-sync.json](../../examples/n8n-workflows/crm-pipedrive-sync.json)

### 3. Configure as credenciais

No n8n, configure:
- **NooviChat credential**: URL da sua instância + API token
- **Pipedrive credential**: API key do Pipedrive

### 4. Mapeamento de estágios

Edite o nó "Stage Mapping" no workflow para mapear estágios NooviChat ↔ Pipedrive:

```json
{
  "Prospect": "1234567",
  "Qualificado": "2345678",
  "Proposta": "3456789",
  "Fechado": "4567890"
}
```

Os IDs dos estágios do Pipedrive você encontra em Settings → Pipelines.

## Campos sincronizados

| NooviChat | Pipedrive |
|-----------|-----------|
| Nome do deal | Deal title |
| Valor estimado | Deal value |
| Estágio do pipeline | Stage |
| Agente responsável | Owner |
| Contato vinculado | Person |
| Empresa | Organization |
| Data prevista | Expected close date |

## Tratamento de duplicatas

O workflow verifica se já existe um deal no Pipedrive com o mesmo ID externo antes de criar. Isso evita duplicatas em ambos os sistemas.

## Sincronização de contatos

Além de deals, o workflow sincroniza contatos:
- Contato criado no NooviChat → Person criada no Pipedrive
- Telefone e email são campos de matching para evitar duplicatas

## Logs e debug

No n8n, acesse **Executions** para ver o log de cada sincronização. Erros comuns:

| Erro | Causa | Solução |
|------|-------|---------|
| 401 Unauthorized | API key inválida | Reconfigurar credenciais no n8n |
| 404 Stage not found | ID de estágio errado no mapeamento | Verificar IDs em Settings Pipedrive |
| Duplicate deal | Deal já existia | Normal — workflow ignora duplicata |
