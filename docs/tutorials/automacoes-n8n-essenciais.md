# Automações n8n Essenciais para NooviChat

5 automações prontas para implementar com n8n + NooviChat que resolvem os casos de uso mais comuns de atendimento e vendas.

## Pré-requisitos

1. **n8n instalado**: [n8n.io](https://n8n.io) (self-hosted) ou n8n cloud
2. **Nó NooviChat instalado**:
   ```bash
   # No diretório do n8n
   npm install @nooviai/n8n-nodes-noovichat
   ```
3. **Credenciais configuradas no n8n**:
   - URL da sua instância NooviChat
   - API token (Settings → API Access Tokens)

## Automação 1: Follow-up automático após 3 dias

**Use case**: contato não respondeu em 3 dias → enviar mensagem de follow-up.

**Workflow**:
```
[Cron: todo dia 8h]
→ NooviChat: listar conversas abertas sem resposta há 3+ dias
→ Para cada conversa:
   → Verificar se já recebeu follow-up (label)
   → Se não: enviar mensagem de follow-up
   → Adicionar label "follow-up-enviado"
```

**Arquivo pronto**: [auto-followup-3dias.json](../../examples/n8n-workflows/auto-followup-3dias.json)

**Mensagem de follow-up sugerida**:
```
Oi {{contact.first_name}}, tudo bem? 👋

Notamos que ainda não tivemos retorno e gostaríamos de saber se 
ainda posso te ajudar com algo.

Qualquer dúvida, estou à disposição! 😊
```

## Automação 2: Qualificação BANT automática

**Use case**: quando lead preenche formulário, criar conversa e iniciar qualificação via bot.

**Workflow**:
```
[Webhook: formulário preenchido]
→ Criar contato no NooviChat
→ Criar conversa com boas-vindas
→ Captain AI em modo Assistant assume
→ [Após qualificação] Criar card no Pipeline Pro
→ Notificar agente responsável
```

**Arquivo pronto**: [lead-qualification-bant.json](../../examples/n8n-workflows/lead-qualification-bant.json)

## Automação 3: Sincronização com Google Sheets

**Use case**: registrar automaticamente todas as conversas resolvidas em uma planilha para relatório.

**Workflow**:
```
[NooviChat webhook: conversation.status_changed = resolved]
→ Filtrar: apenas conversas com duração > 5 min (excluir spam)
→ Google Sheets: adicionar linha:
   | Data | Agente | Contato | Duração | Inbox | Labels | Classificação |
```

**Arquivo pronto**: [google-sheets-sync.json](../../examples/n8n-workflows/google-sheets-sync.json)

**Use case derivado**: calcular NPS semanal, tempo médio de resolução por agente, volume por inbox.

## Automação 4: Sincronização Pipedrive

**Use case**: deal criado/movido no NooviChat → atualiza automaticamente no Pipedrive.

**Workflow**:
```
[NooviChat webhook: pipeline_card.stage_changed]
→ Verificar se deal existe no Pipedrive (buscar por external_id)
→ Se existe: atualizar estágio e campos
→ Se não existe: criar deal no Pipedrive com dados do contato NooviChat
→ Salvar Pipedrive deal_id como atributo no NooviChat
```

**Arquivo pronto**: [crm-pipedrive-sync.json](../../examples/n8n-workflows/crm-pipedrive-sync.json)

## Automação 5: Alerta Slack — leads quentes

**Use case**: quando lead score ultrapassa 75, notificar time de vendas no Slack imediatamente.

**Workflow**:
```
[NooviChat webhook: contact.score_updated]
→ Filtrar: score >= 75 E score anterior < 75 (evitar spam)
→ Buscar detalhes do contato e última conversa
→ Slack: #vendas → mensagem formatada com link direto para conversa
```

**Arquivo pronto**: [alerta-slack-leads-quentes.json](../../examples/n8n-workflows/alerta-slack-leads-quentes.json)

**Mensagem no Slack**:
```
🔥 Novo lead quente no NooviChat!

👤 *{{contact.name}}* — {{contact.company}}
📊 Score: *{{score}}* pts
💬 Última mensagem: "{{last_message_preview}}"
🔗 <{{conversation_url}}|Ver conversa>

@canal-vendas — alguém pode assumir?
```

## Instalação dos workflows

1. Baixe o arquivo JSON desejado de [examples/n8n-workflows/](../../examples/n8n-workflows/)
2. No n8n: menu superior → **Import from file** → selecione o JSON
3. Configure as credenciais nos nós (NooviChat, Google Sheets, Slack, etc.)
4. Ative o workflow com o toggle no canto superior direito

## Dicas para n8n com NooviChat

**Performance**:
- Use credenciais com escopo mínimo necessário (crie tokens específicos por workflow)
- Adicione nó de Error Trigger para notificar falhas críticas

**Segurança**:
- Nunca coloque tokens hardcoded no workflow — use n8n Credentials
- Proteja seu n8n com autenticação básica ou SSO

**Debug**:
- Use o botão **Test Webhook** no n8n para simular payloads antes de ativar
- Acesse **Executions** para ver o log completo de cada execução
