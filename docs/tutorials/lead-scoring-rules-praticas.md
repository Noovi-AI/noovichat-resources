# Lead Scoring — Regras Práticas

Exemplos reais de configurações de lead scoring por tipo de negócio. Copie e adapte para sua realidade.

## Framework BANT básico (qualquer B2B)

O BANT é o framework de qualificação mais usado em vendas B2B:

| Critério | Peso | Regra NooviChat |
|----------|------|-----------------|
| **B**udget (tem orçamento) | 30 pts | Atributo `budget` = confirmado |
| **A**uthority (tem autoridade de decisão) | 20 pts | Cargo ∈ [CEO, Sócio, Diretor, Gerente] |
| **N**eed (tem necessidade clara) | 25 pts | Atributo `necessidade` = confirmada |
| **T**imeline (quer comprar em breve) | 25 pts | Atributo `prazo` = imediato ou <3 meses |

**Score máximo**: 100 pts
**Qualificado**: ≥ 60 pts
**Hot lead**: ≥ 80 pts

## Exemplo por setor

### SaaS / Software

```
+ 25: cargo ∈ [CEO, CTO, Diretor, Product Manager]
+ 20: tem empresa preenchida
+ 15: email corporativo (não gmail/hotmail/yahoo)
+ 15: respondeu em menos de 2h
+ 10: está em trial ativo (label trial-ativo)
+ 10: acessou a página de pricing (atributo via tracking)
+ 10: empresa de tecnologia (atributo setor)
- 15: cancelou trial
- 20: marcou mensagem como spam
- 10: não respondeu 3 follow-ups consecutivos
```

**Limites**:
- 80-100: SDR entra em contato hoje
- 60-79: nurturing + follow-up em 2 dias
- 40-59: campanha de educação
- <40: cold — aguardar maturidade

### E-commerce / Varejo

```
+ 20: fez pergunta sobre produto específico (label produto-interesse)
+ 20: clicou no link de compra (atributo via webhook)
+ 15: conversou mais de 5 mensagens
+ 15: perguntou sobre prazo de entrega ou frete
+ 10: voltou a conversar após 7+ dias de silêncio
+ 10: tem CEP preenchido (intenção de compra)
+ 5: já comprou antes (label cliente-recorrente)
- 10: só pediu desconto
- 15: pediu reembolso em compra anterior
```

### Serviços locais (clínicas, salões, academias)

```
+ 30: perguntou sobre preços e pacotes
+ 20: pediu agendamento (qualquer tipo)
+ 20: mora/trabalha na cidade da unidade (atributo cidade)
+ 15: conversou mais de 10 min no total
+ 10: abriu broadcast com promoção
+ 10: foi indicado por cliente atual (label indicacao)
- 15: perguntou e sumiu por mais de 14 dias
- 10: pediu algo fora do escopo do negócio
```

## Criar atributos customizados para scoring

Para regras baseadas em budget, prazo ou necessidade, crie atributos de contato:

1. Settings → Custom Attributes → Contact → Add Attribute
2. Crie os campos necessários (ex: tipo Dropdown com opções)

**Exemplo:**
```
Atributo: "prazo_de_compra"
Tipo: Dropdown
Opções: imediato, 1-3 meses, 3-6 meses, sem prazo definido

Regra de scoring:
+ 25: prazo_de_compra = imediato
+ 15: prazo_de_compra = 1-3 meses
+ 5: prazo_de_compra = 3-6 meses
+ 0: prazo_de_compra = sem prazo definido
```

## Operadores disponíveis nas regras

| Operador | Exemplo |
|----------|---------|
| `equals` | cargo = CEO |
| `contains` | cargo contém Gerente |
| `in` | cargo em [CEO, Sócio, Diretor] |
| `greater_than` | conversas_count > 5 |
| `less_than` | dias_desde_ultima_conversa < 7 |
| `is_present` | empresa preenchida |
| `is_absent` | email não preenchido |

## Alerta automático de lead quente

Configure uma notificação via n8n quando o score ultrapassa o threshold:

```
Workflow n8n: "Alerta lead quente"
Trigger: NooviChat webhook → contact.score_updated
Filtro: novo_score >= 75 AND score_anterior < 75
Ação: Slack → #canal-vendas
Mensagem: "🔥 Novo lead quente: {{contact.name}} (score: {{score}})
          Empresa: {{contact.company}} | Cargo: {{contact.cargo}}
          Ver conversa: {{conversation_url}}"
```

Ver [examples/n8n-workflows/alerta-slack-leads-quentes.json](../../examples/n8n-workflows/alerta-slack-leads-quentes.json).

## Revisão mensal do scoring

O lead scoring precisa ser ajustado periodicamente:

1. **Analise os deals fechados**: quais atributos tinham leads que converteram?
2. **Analise os perdidos**: o scoring estava superestimando algum atributo?
3. **Ajuste os pesos**: aumente peso dos indicadores que correlacionam com conversão real
4. **Documente no time**: todo o time de vendas precisa entender o que cada score significa

Dica: exporte um relatório mensal de deals fechados/perdidos vs score inicial e calcule a correlação. Um bom scoring deve ter 70%+ dos leads fechados com score ≥ 60.
