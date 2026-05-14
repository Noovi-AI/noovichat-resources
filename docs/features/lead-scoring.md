# Lead Scoring — Qualificação Automática no NooviChat

Lead Scoring calcula automaticamente a "temperatura" de cada contato com base em regras configuráveis. Ajuda o time de vendas a priorizar leads com maior chance de conversão.

## Como funciona

O NooviChat calcula um score (0–100) para cada contato baseado em regras que você define. O score é atualizado automaticamente sempre que os dados do contato mudam.

```
Contato → Regras de scoring → Score (0-100) → Priorização
```

## Tipos de regras

### Por atributos do contato

- **Cargo/função**: CEO = +20, Gerente = +10, Analista = +5
- **Empresa**: tem empresa preenchida = +10
- **Setor**: tecnologia = +15, varejo = +10
- **Localização**: capital = +5
- **Atributos customizados**: qualquer campo que você criou

### Por comportamento de engajamento

- Respondeu última mensagem em < 1 hora = +15
- Abriu broadcast = +5
- Clicou em link = +10
- Iniciou conversa = +20

### Por estágio no pipeline

- Chegou na etapa "Qualificado" = +30
- Está na etapa "Proposta" = +50
- Ficou mais de 7 dias sem mover = -10

### Por histórico de conversas

- Mais de 5 conversas = +10
- Última conversa há menos de 7 dias = +15
- Marcado como "satisfeito" = +20
- Reclamação registrada = -20

## Configuração

### Criar regras de scoring

1. **Settings → Pipeline → Lead Scoring**
2. Clique em **Add Rule**
3. Configure:
   - **Condition**: atributo + operador + valor (ex: `cargo contains CEO`)
   - **Points**: pontos a adicionar (+) ou remover (-)
   - **Description**: nome legível da regra
4. Salve — o score de todos os contatos é recalculado automaticamente

### Exemplo de configuração completa

```
Regras de qualificação (total máximo: ~100):

+ 25 pts: cargo contém [CEO, Diretor, Gerente, Sócio]
+ 15 pts: tem empresa preenchida
+ 10 pts: email corporativo (não gmail/hotmail/yahoo)
+ 20 pts: respondeu na última conversa em < 2h
+ 15 pts: estágio do pipeline = Qualificado ou superior
+ 10 pts: última conversa há menos de 7 dias
- 20 pts: marcado como "sem interesse"
- 15 pts: bounced em email marketing
```

## Usando o score

### Filtrar no Pipeline Pro

No kanban do Pipeline Pro, filtre cards por range de score:
- Score 80-100 = 🔥 Hot lead — ação imediata
- Score 50-79 = 🌡️ Warm lead — nutrir
- Score 0-49 = ❄️ Cold lead — campanha de reativação

### Segmentação de Broadcasts

Ao criar um broadcast, filtre destinatários por score:
```
Broadcast "Oferta exclusiva" → Contatos com score >= 70
```

### Automação n8n por score

```json
// Trigger: score mudou para >= 80
// Ação: notificar vendedor no Slack
{
  "trigger": "contact.score_updated",
  "condition": "score >= 80",
  "action": "slack.send_message",
  "message": "🔥 Lead quente: {{contact.name}} (score {{contact.score}})"
}
```

Ver [examples/n8n-workflows/alerta-slack-leads-quentes.json](../../examples/n8n-workflows/alerta-slack-leads-quentes.json).
