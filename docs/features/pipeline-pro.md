# Pipeline Pro — CRM Kanban do NooviChat

Pipeline Pro é o módulo de CRM em kanban do NooviChat, integrado diretamente ao atendimento omnichannel. Inspirado no Pipedrive, permite gerenciar todo o ciclo de vendas sem sair do painel de atendimento.

## Funcionalidades

### Múltiplos Funis

Crie quantos funis precisar com estágios customizáveis:

- **Vendas**: Prospect → Qualificado → Proposta → Negociação → Fechado
- **Suporte**: Aberto → Em análise → Aguardando cliente → Resolvido
- **Pós-venda**: Onboarding → Ativo → Renovação → Churn

### Cards (Deals)

Cada card representa uma oportunidade:

- Nome do deal e valor estimado (revenue tracking)
- Contato/empresa vinculado
- Agente responsável
- Data de fechamento prevista
- Labels e atributos customizados
- Timeline de atividades (notas, ligações, emails)

### Kanban

- Arrastar e soltar entre estágios
- Filtros por agente, label, valor, data
- Ordenação por prioridade, valor ou data
- Visualização de cards como lista ou kanban

### Automações por Estágio

Configure ações automáticas quando um card entra em um estágio:

- Enviar mensagem WhatsApp para o contato
- Atribuir a um agente específico
- Adicionar label na conversa
- Chamar webhook externo (n8n, Zapier)
- Criar task de follow-up

### Lead Scoring Integrado

- Score calculado automaticamente com base em regras configuráveis
- Regras baseadas em: atributos de contato, engajamento, estágio atual, tempo sem resposta
- Filtro e ordenação por score no kanban
- Alertas quando score cai abaixo de threshold

## Como criar um funil

1. Acesse **Settings → Pipeline → New Pipeline**
2. Defina o nome e os estágios (arraste para reordenar)
3. Configure automações opcionais por estágio
4. O funil aparece no menu lateral do painel

## Sincronização com CRMs externos

Pipeline Pro sincroniza com CRMs externos via n8n:

- **Pipedrive**: deals criados no NooviChat sincronizam automaticamente com Pipedrive (e vice-versa)
- **RD Station**: qualificação de leads sincroniza com funil RD
- **HubSpot**: deals e contatos via webhook

Ver [examples/n8n-workflows/crm-pipedrive-sync.json](../../examples/n8n-workflows/crm-pipedrive-sync.json) para workflow pronto.

## Permissões

- Agentes veem apenas deals atribuídos a eles (configurável)
- Supervisores veem todos os deals do time
- Admins têm acesso total a todos os funis
