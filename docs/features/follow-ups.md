# Follow-ups Automáticos — NooviChat

O módulo de Follow-ups do NooviChat envia mensagens automáticas para contatos que não responderam após um período configurável. Evita leads "esfriando" no pipeline sem esforço manual do time.

## Como funciona

```
Conversa sem resposta → Prazo atingido → Follow-up enviado → Conversa reaberta
```

O sistema monitora continuamente conversas que ficaram sem resposta do contato e dispara follow-ups conforme as regras definidas.

## Tipos de follow-up

### Por inatividade em conversa

Disparado quando o **contato não respondeu** após X dias:

```
Regra: "Se conversa ativa sem resposta por 3 dias → enviar follow-up 1"
Regra: "Se ainda sem resposta por mais 3 dias → enviar follow-up 2"
Regra: "Se ainda sem resposta por mais 7 dias → marcar como perdido"
```

### Por estágio no pipeline

Disparado quando um card fica **parado num estágio** por X dias:

```
Regra: "Se card em 'Proposta Enviada' por 5 dias → follow-up de confirmação"
Regra: "Se card em 'Aguardando Decisão' por 7 dias → follow-up de urgência"
```

### Por data de vencimento

Disparado X dias antes de uma **data de fechamento**:

```
Regra: "3 dias antes da data de fechamento do deal → lembrete de proposta"
```

## Configuração

### Criar sequência de follow-up

1. **Settings → Follow-ups → New Sequence**
2. Configure:
   - **Nome**: "Sequência de reativação padrão"
   - **Trigger**: tipo de gatilho e prazo em dias
   - **Inbox**: quais inboxes aplicar (ou todas)
3. Adicione mensagens na sequência:

**Mensagem 1 (dia 3):**
```
Oi {{contact.name}}, tudo bem? 

Percebemos que ainda não tivemos retorno sobre [assunto].
Posso te ajudar com mais alguma informação?
```

**Mensagem 2 (dia 6):**
```
{{contact.name}}, última tentativa de contato 😊

Se tiver interesse em retomar nossa conversa, estou aqui!
Caso contrário, fique à vontade — sem problemas.
```

**Ação final (dia 13):**
```
[Marcar conversa como resolvida + mover card para "Perdido"]
```

## Templates de follow-up

### Vendas B2B

```
Dia 2: "Oi {{nome}}, conseguiu ver a proposta que enviei?"
Dia 5: "{{nome}}, sei que está cheio de coisas. Me avise se quiser algum ajuste na proposta!"
Dia 10: "Última mensagem de minha parte, {{nome}}. Se precisar no futuro, pode falar!"
```

### Suporte técnico

```
Dia 2: "Olá {{nome}}, seu problema foi resolvido ou ainda precisa de ajuda?"
Dia 5: "[Marcar como resolvido automaticamente]"
```

### Pós-venda / Onboarding

```
Dia 3: "{{nome}}, como está indo a configuração do NooviChat? Posso ajudar?"
Dia 7: "Dúvidas sobre alguma feature? Estou disponível!"
Dia 14: "{{nome}}, já usando o Pipeline Pro? Vale muito a pena configurar!"
```

## Pausa e cancelamento

Follow-ups são automaticamente **cancelados** quando:
- O contato responde (conversa ativada)
- Um agente manda mensagem manual
- A conversa é marcada como resolvida
- O card é movido para estágio final

Também é possível pausar manualmente numa conversa específica via botão no painel.

## Integração com n8n

Para follow-ups mais complexos (com lógica condicional), use n8n:

```
Trigger: follow-up não respondido → verificar score → 
  se score > 70: escalar para supervisor
  se score < 30: mover para cold leads
```

Ver [examples/n8n-workflows/auto-followup-3dias.json](../../examples/n8n-workflows/auto-followup-3dias.json).
