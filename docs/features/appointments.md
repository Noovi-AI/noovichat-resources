# Appointments — Agendamentos no NooviChat

O módulo de Appointments integra o NooviChat com Google Calendar, permitindo que clientes agendem horários diretamente na conversa do WhatsApp.

## Como funciona

```
Cliente pede agendamento → NooviChat envia link de agendamento →
Cliente escolhe horário disponível → Evento criado no Google Calendar →
Confirmação enviada automaticamente para ambos
```

## Configuração

### 1. Conectar Google Calendar

1. **Settings → Integrations → Google Calendar**
2. Clique em **Connect** — autorize a conta Google da sua empresa
3. Selecione qual calendário usar para agendamentos

### 2. Definir disponibilidade

Configure seus horários de atendimento:

- Dias da semana disponíveis
- Horários (ex: Seg-Sex 9h-18h)
- Duração padrão por atendimento (15, 30, 45 ou 60 minutos)
- Buffer entre reuniões (ex: 15 min)
- Fuso horário (padrão: Brasília)

### 3. Criar tipos de appointment

Crie diferentes tipos para diferentes propósitos:

| Tipo | Duração | Descrição pública |
|------|---------|-------------------|
| Demonstração NooviChat | 30 min | "Agende uma demo gratuita" |
| Suporte técnico | 45 min | "Sessão de suporte ao vivo" |
| Reunião de onboarding | 60 min | "Configuração inicial" |

### 4. Enviar link de agendamento

Na conversa com o cliente, clique no ícone de calendário ou use a macro:

```
Que tal agendar uma conversa? 
Escolha um horário que funciona para você: {{scheduling_link}}
```

O link direciona para uma página simples onde o cliente vê os horários disponíveis e escolhe o seu.

## Fluxo do cliente

1. Cliente recebe link de agendamento via WhatsApp
2. Abre a página de agendamento no celular
3. Escolhe o tipo de atendimento, data e horário
4. Preenche nome e email (para confirmação)
5. Confirma — evento é criado automaticamente no Google Calendar

## Notificações automáticas

Após o agendamento:

- **Confirmação imediata**: mensagem WhatsApp com detalhes do horário
- **Lembrete 1 dia antes**: "Não se esqueça do nosso papo amanhã às {{time}}!"
- **Lembrete 1 hora antes**: "Nos vemos em 1 hora! Link do Meet: {{meet_link}}"

Todas as notificações são configuráveis (texto, prazo, habilitar/desabilitar).

## Cancelamento e reagendamento

O cliente pode cancelar ou reagendar pelo mesmo link ou respondendo "cancelar" na conversa. O NooviChat:

1. Remove o evento do Google Calendar
2. Reabre o horário para novos agendamentos
3. Notifica o agente responsável
4. Mantém registro na timeline da conversa

## Integração com Pipeline Pro

Quando um appointment é criado, o NooviChat pode automaticamente:

- Mover o card do pipeline para o estágio "Reunião agendada"
- Atribuir o deal ao agente que fará a reunião
- Criar uma activity no deal com detalhes do horário
