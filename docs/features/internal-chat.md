# Internal Chat — Comunicação entre Agentes

Internal Chat é o canal de comunicação privado entre agentes do NooviChat — separado das conversas com clientes. Elimina a necessidade de um app de chat separado (Slack, Teams) para comunicação interna da equipe de atendimento.

## O que é o Internal Chat

O Chatwoot upstream já tem menções de agentes dentro de conversas (via `@agente`). O Internal Chat do NooviChat adiciona um canal dedicado para conversas internas, sem relação com clientes específicos.

## Funcionalidades

### Mensagens diretas (1:1)

- Conversa privada entre dois agentes
- Notificação em tempo real (badge no ícone)
- Histórico preservado
- Suporte a emojis e markdown básico

### Grupos de equipe

- Crie grupos por equipe (Vendas, Suporte, TI)
- Membros podem ser adicionados/removidos por admins
- Menções de membros no grupo com `@nome`

### Compartilhamento de arquivos

- Imagens, PDFs, documentos até 25MB
- Preview inline de imagens e PDFs
- Link direto para download

### Menções e notificações

- `@agente` — menciona um agente específico
- `@todos` — notifica todos do grupo
- Notificações por browser/app mobile

## Casos de uso comuns

**Handoff de atendimento:**
```
[Agente A → Agente B]:
"Carlos, precisei sair — passei a conversa com João (ticket #1234) para você.
Ele está aguardando orçamento do plano anual. Já enviei a proposta mas ainda
não confirmou. Pode dar continuidade?"
```

**Escalada interna:**
```
[Agente → Supervisor]:
"@maria.supervisora, cliente @NomeConta pedindo desconto acima do meu limite.
Pode olhar o ticket #5678? É cliente há 2 anos, ticket histórico limpo."
```

**Comunicação de equipe:**
```
[Canal: #atendimento]:
"⚠️ Atenção time: WAHA do inbox Vendas caiu. Já abrimos ticket com suporte.
Enquanto isso, redirecionar clientes WhatsApp para email."
```

## Diferença das menções em conversas de cliente

| | Internal Chat | Menção em conversa (@agente) |
|---|---|---|
| Visível ao cliente | Não | Não (nota privada) |
| Contexto | Geral / equipe | Específico daquela conversa |
| Histórico | Sim, permanente | Sim, dentro da conversa |
| Notificação | Sim, push | Sim, badge |
| Uso ideal | Comunicação interna | Colaboração numa conversa |

## Configuração

Internal Chat está habilitado por padrão em todos os planos pagos do NooviChat.

### Criar um grupo de equipe

1. **Settings → Teams → Create New Team**
2. Adicione agentes ao time
3. O grupo de Internal Chat é criado automaticamente

### Notificações no mobile

Instale o app NooviChat (baseado no app Chatwoot) para receber notificações push de Internal Chat no celular.
