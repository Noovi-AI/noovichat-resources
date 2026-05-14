# Pipeline Pro — Setup Completo

Guia passo a passo para configurar o Pipeline Pro (CRM kanban) do NooviChat do zero, incluindo funis, estágios, automações e lead scoring.

## 1. Criar seu primeiro funil

### Acesse o Pipeline

No menu lateral: **Pipeline Pro** → botão **+** ou **New Pipeline**.

### Configure os estágios

Para um funil de vendas B2B típico:

| Estágio | Cor | Significado |
|---------|-----|-------------|
| Prospect | Cinza | Lead novo, ainda não qualificado |
| Qualificado | Azul | BANT confirmado (Budget, Authority, Need, Timeline) |
| Proposta Enviada | Amarelo | Proposta comercial entregue |
| Negociação | Laranja | Em negociação ativa |
| Fechado — Ganho | Verde | Deal fechado com sucesso |
| Fechado — Perdido | Vermelho | Perdeu para concorrente ou sem interesse |

### Dicas de nomenclatura

- Use verbos de ação ("Proposta Enviada" > "Proposta")
- Limite a 6-8 estágios — funis longos demais confundem o time
- Crie funis separados por linha de produto ou perfil de cliente

## 2. Criar o primeiro card

### Via painel Pipeline

**New Card →** preencha:
- **Nome do deal**: identifique claramente (ex: "Empresa ABC — plano anual")
- **Contato**: busque ou crie o contato
- **Valor estimado**: valor do contrato em R$
- **Data de fechamento prevista**: estimativa realista
- **Responsável**: agente que vai tocar esse deal

### Via conversa no atendimento

Em qualquer conversa aberta: botão **Create Deal** no painel lateral → preencha e salve. O card é criado automaticamente vinculado à conversa e ao contato.

## 3. Configurar automações por estágio

### Automação básica: notificar supervisor ao fechar

1. **Settings → Pipeline → [seu funil] → Stage Actions**
2. Selecione o estágio "Fechado — Ganho"
3. Adicione ação: **Send notification → [agente/supervisor]**
4. Mensagem: `🎉 Deal fechado: {{deal.name}} — R$ {{deal.value}}`

### Automação: mover para próximo estágio após resposta

1. Estágio "Proposta Enviada" → Stage Action
2. Trigger: "Contact replied"
3. Ação: Mover para "Negociação"

### Automação via Webhook (n8n)

Para automações complexas, use webhook:

1. Estágio "Qualificado" → Add webhook action
2. URL: `https://seu-n8n.com/webhook/noovichat-qualified`
3. n8n recebe o payload e pode: criar deal no Pipedrive, notificar Slack, etc.

## 4. Configurar Lead Scoring

### Regras básicas de qualificação (BANT)

```
Budget confirmado (atributo) = +30
Autoridade confirmada (cargo = Diretor/CEO/Sócio) = +20
Necessidade claramente definida (atributo) = +25
Timeline = imediato ou até 3 meses = +25
```

### Implementar no NooviChat

1. **Settings → Pipeline → Lead Scoring → Add Rule**
2. Adicione cada regra acima
3. Crie atributos customizados de contato para Budget, Authority e Need se necessário:
   **Settings → Custom Attributes → Contact → Add Attribute**

### Usar o score no dia a dia

- Ordene o kanban por score: leads 80+ têm prioridade imediata
- Crie filtro "Hot leads" (score ≥ 70) como atalho no painel
- Inclua score como coluna visível no kanban

## 5. Configurar atributos customizados

Crie atributos relevantes para seu negócio:

**Para B2B:**
- Empresa → CNPJ (texto)
- Cargo (seleção: CEO, Diretor, Gerente, Analista)
- Setor (seleção: Tecnologia, Varejo, Saúde, etc.)
- Tamanho da empresa (seleção: 1-10, 11-50, 51-200, 200+)
- Budget mensal (seleção: <R$500, R$500-2k, R$2k-10k, R$10k+)
- Fonte do lead (seleção: Indicação, LinkedIn, Google, WhatsApp)

**Como criar:**
Settings → Custom Attributes → Contact → + Add Attribute

## 6. Criar deals em massa via importação

Para importar leads de uma planilha:

1. Settings → Contacts → Import Contacts (CSV)
2. Após importar, selecione os contatos → **Add to Pipeline**
3. Escolha o funil e estágio inicial

**Formato CSV:**
```csv
name,phone_number,email,company,custom_attribute_cargo
João Silva,+5511999990001,joao@empresa.com,Empresa ABC,CEO
Maria Souza,+5511999990002,maria@empresa.com,XYZ Tech,Gerente
```

## 7. Relatórios do Pipeline

### Acesso

**Pipeline Pro → Reports** (ícone de gráfico)

### Métricas disponíveis

- Taxa de conversão por estágio
- Tempo médio em cada estágio
- Deals ganhos/perdidos por período
- Revenue por agente
- Forecast de receita (deals × probabilidade por estágio)

### Configurar probabilidade por estágio

Settings → Pipeline → [funil] → Stage Settings:

| Estágio | Probabilidade sugerida |
|---------|----------------------|
| Prospect | 10% |
| Qualificado | 30% |
| Proposta Enviada | 50% |
| Negociação | 70% |
| Fechado — Ganho | 100% |

O forecast usa essas probabilidades para calcular a receita esperada.
