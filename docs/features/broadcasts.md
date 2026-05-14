# Broadcasts — Envio em Massa no NooviChat

O módulo de Broadcasts do NooviChat permite enviar mensagens em massa para listas segmentadas de contatos via WhatsApp (WAHA), com anti-block nativo, agendamento e relatórios.

## O que é diferente do Chatwoot upstream

O Chatwoot upstream não tem módulo de broadcasts. O NooviChat adicionou esse módulo com foco no mercado brasileiro:

- **Anti-block nativo**: envio em batches com delay aleatório
- **Segmentação avançada**: filtros por labels, atributos, score, histórico
- **Agendamento**: defina data/hora do envio
- **Relatórios**: entrega, leitura, falhas e respostas

## Criando um broadcast

### 1. Acesse Broadcasts

**Broadcasts → New Campaign**

### 2. Configure o básico

- **Nome**: identificação interna do broadcast
- **Inbox**: qual número WhatsApp usar para envio
- **Título do template**: nome para reuso

### 3. Defina o público

Filtre contatos por:

```
Labels: [lead-quente, trial-expirado, cliente-vip]
Atributos: cargo = [CEO, Gerente], setor = tecnologia
Lead score: >= 50
Última conversa: entre 7 e 30 dias atrás
Sem resposta em broadcasts anteriores: excluir
```

### 4. Crie a mensagem

Use variáveis dinâmicas:

```
Oi {{contact.name}} 👋

A sua empresa {{contact.company}} está usando o NooviChat há algum tempo.

Gostaríamos de te convidar para conhecer o Pipeline Pro — 
nosso CRM kanban integrado ao atendimento.

Posso te mostrar em 15 minutos? 📅
{{scheduling_link}}

Abs,
Equipe NooviChat
```

Variáveis disponíveis:
- `{{contact.name}}`, `{{contact.email}}`, `{{contact.phone}}`
- `{{contact.company}}`, `{{contact.city}}`
- Atributos customizados: `{{contact.attribute.nome_do_atributo}}`

### 5. Configure o agendamento

- **Imediato**: enviar agora
- **Agendado**: data e hora específica

### 6. Configure o anti-block

| Configuração | Valor recomendado |
|---|---|
| Tamanho do batch | 20-50 mensagens |
| Delay entre mensagens | 3-8 segundos (aleatório) |
| Pausa entre batches | 60-120 segundos |
| Limite por hora | 200 mensagens |

> **Importante**: Mesmo com anti-block, broadcasts em massa para contatos que nunca iniciaram conversa com você são considerados spam pelo WhatsApp. Use apenas para contatos que optaram em receber mensagens.

## Opt-out automático

Quando um contato responde PARAR, STOP, CANCELAR ou qualquer variação configurada:

1. É automaticamente removido de todas as listas de broadcast futuras
2. Uma label "opt-out" é adicionada ao contato
3. Nenhum broadcast futuro é enviado para ele (a menos que haja novo opt-in)

## Relatórios

Após o envio, acompanhe:

| Métrica | Descrição |
|---|---|
| Enviadas | Total de mensagens enviadas |
| Entregues | Confirmação de entrega pelo WhatsApp |
| Lidas | Contatos que abriram a mensagem (✓✓ azul) |
| Responderam | Contatos que mandaram qualquer resposta |
| Falhas | Mensagens não entregues (número inativo, etc.) |
| Opt-outs | Contatos que pediram para sair da lista |

## Boas práticas

1. **Opt-in explícito**: envie apenas para quem concordou em receber mensagens
2. **Segmentação relevante**: quanto mais específico o público, melhor a taxa de resposta
3. **Frequência**: máximo 1-2 broadcasts por semana para o mesmo contato
4. **Horário**: das 9h às 20h, evite domingos
5. **Mensagem de valor**: todo broadcast deve trazer algo útil — não apenas promoção
6. **Teste A/B**: envie para grupos pequenos antes do disparo geral

## Integração com Lead Scoring

Combine broadcasts com lead scoring para campanhas mais eficientes:

```
Broadcast "Reativação de leads quentes":
→ Filtro: score entre 50-79 + sem conversa há 15+ dias
→ Mensagem: convite para demonstração personalizada
→ Ação pós-resposta: mover card para "Retomada" no pipeline
```
