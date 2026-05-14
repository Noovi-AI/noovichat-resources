# Captain AI — Inteligência Artificial no NooviChat

Captain AI é o módulo de IA nativo do Chatwoot, disponível no NooviChat. Automatiza atendimentos, sugere respostas e responde com base na knowledge base da empresa.

> **Nota**: Captain AI é uma feature do Chatwoot upstream, presente em todas as versões do NooviChat.

## Modos de Operação

### Assistant (Agente Autônomo)

Responde clientes automaticamente, 24/7, sem intervenção humana:

- Usa a Knowledge Base para buscar informações relevantes
- Escala para agente humano quando não consegue responder
- Configurável por inbox (habilite apenas em inboxes específicas)
- Registra handoff com contexto completo para o agente humano

**Ideal para**: FAQs, qualificação inicial, coleta de dados, suporte tier 1.

### Copilot (Assistente do Agente)

Aparece ao lado do agente humano em tempo real:

- Sugere próxima resposta baseada no contexto da conversa
- Busca na Knowledge Base enquanto o agente digita
- O agente aprova, edita ou descarta sugestões
- Reduz tempo médio de atendimento (AHT)

**Ideal para**: times com muitos agentes, treinamento de novos agentes, consistência de respostas.

## Knowledge Base com RAG

RAG (Retrieval Augmented Generation) garante respostas baseadas em informações reais:

1. **Upload de documentos**: PDFs, URLs, texto livre
2. **Embeddings**: OpenAI gera vetores numéricos de cada trecho
3. **Armazenamento**: pgvector (extensão PostgreSQL) armazena os vetores
4. **Busca semântica**: pergunta do cliente → busca por similaridade vetorial
5. **Resposta contextualizada**: GPT-4 recebe os trechos relevantes e gera resposta precisa

### Tipos de documentos suportados

- PDFs (manuais, políticas, catálogos)
- URLs (páginas do site, documentação pública)
- Texto livre (FAQ, scripts de atendimento)

## Configuração

### 1. Conectar OpenAI

```
Settings → Integrations → OpenAI → API Key
```

Modelos disponíveis: `gpt-4o` (recomendado), `gpt-4-turbo`, `gpt-3.5-turbo`

### 2. Criar Knowledge Base

```
Settings → AI → Knowledge Base → Add Document
```

Faça upload ou cole a URL. O processamento leva alguns minutos dependendo do tamanho.

### 3. Configurar System Prompt

```
Settings → AI → Captain AI → System Prompt
```

Exemplo de system prompt eficaz:

```
Você é {NomeAtendente}, assistente virtual da {Empresa}.
Responda sempre em português brasileiro de forma cordial e objetiva.
Use apenas informações da knowledge base para responder.
Se não souber, diga: "Vou verificar essa informação para você."
Não mencione que você é uma IA, a menos que perguntado diretamente.
```

### 4. Habilitar por Inbox

```
Settings → Inboxes → [sua inbox] → AI Features
```

Habilite Assistant e/ou Copilot individualmente por inbox.

## Custo estimado (OpenAI)

| Volume | gpt-4o | gpt-3.5-turbo |
|--------|--------|---------------|
| 1.000 conversas/mês | ~$5-15 | ~$0.50-1.50 |
| 10.000 conversas/mês | ~$50-150 | ~$5-15 |

*Estimativa baseada em 200-500 tokens por conversa.*

## MCP Server (Claude Desktop / Code)

Além do Captain AI (IA dentro do Chatwoot), o NooviChat oferece um MCP server para controle externo via Claude:

```bash
npm install -g @nooviai/noovichat-mcp
```

Ver [docs/integrations/mcp.md](../integrations/mcp.md) para configuração completa.
