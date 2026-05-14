# Integração com Google Calendar

NooviChat integra com Google Calendar para agendamento de reuniões diretamente nas conversas do WhatsApp.

## Configuração

### 1. Autorizar a conta Google

1. Acesse **Settings → Integrations → Google Calendar**
2. Clique em **Connect with Google**
3. Selecione a conta Google da empresa (não conta pessoal)
4. Autorize as permissões: leitura de disponibilidade + criação de eventos
5. Selecione o calendário principal para agendamentos

> A integração usa OAuth 2.0 — o NooviChat nunca armazena sua senha Google.

### 2. Configurar disponibilidade

Defina quando você está disponível para reuniões:

- Dias da semana
- Horários (ex: 9h às 18h)
- Duração padrão das reuniões
- Buffer entre reuniões
- Fuso horário (Brasília é o padrão)

### 3. Criar tipos de reunião

Configure diferentes tipos de appointment para diferentes contextos:

**Exemplo de configuração:**

| Tipo | Duração | Visibilidade |
|------|---------|--------------|
| Demo do produto | 30 min | Pública (via link) |
| Onboarding | 60 min | Apenas por convite |
| Suporte técnico | 45 min | Apenas por convite |
| Reunião comercial | 45 min | Pública |

### 4. Gerar e enviar link de agendamento

Na conversa com o cliente:

```
Macro: appointment_link
Output: "Escolha o melhor horário para você: https://noovichat.com/meet/{{agent.slug}}/demo"
```

Ou manualmente no painel: ícone de calendário → copiar link.

## Como o cliente agenda

1. Abre o link no celular
2. Seleciona o tipo de reunião
3. Escolhe o dia e horário disponível
4. Preenche nome + email (para confirmação)
5. Confirma — evento é criado automaticamente

## Eventos criados no Google Calendar

Ao confirmar o agendamento, o NooviChat cria:

- **Evento no Google Calendar** com: título, horário, convidados, Meet link
- **Google Meet link** gerado automaticamente (se Google Workspace)
- **Descrição do evento**: nome e telefone do cliente, link para a conversa NooviChat

## Notificações automáticas

O NooviChat envia automaticamente:

| Momento | Canal | Mensagem |
|---------|-------|---------|
| Imediatamente após agendamento | WhatsApp | Confirmação com detalhes |
| 24h antes | WhatsApp | Lembrete com link Meet |
| 1h antes | WhatsApp | "Nos vemos em 1 hora!" |

Todas configuráveis em Settings → Appointments → Notifications.

## Cancelamento e reagendamento

O cliente pode cancelar ou reagendar via link incluído nas notificações. O NooviChat:

1. Cancela o evento no Google Calendar
2. Libera o horário automaticamente
3. Notifica o agente por Internal Chat
4. Registra na timeline da conversa

## Múltiplos agentes e calendários

Cada agente pode conectar seu próprio Google Calendar. Ao enviar link de agendamento, o cliente vê a disponibilidade do agente específico.

Para routing automático (ex: agente com menor carga recebe o agendamento), use n8n + appointment webhook.
