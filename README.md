<div align="center">
  <h1>NooviChat — Resources</h1>

  <p><strong>Fork brasileiro do Chatwoot</strong> com Pipeline CRM, Captain AI e WhatsApp via WAHA.<br />
  Este repositório concentra docs, exemplos, integrações e tutoriais para a comunidade.</p>

  <p>
    <a href="https://noovichat.com">Site oficial</a> ·
    <a href="https://noovichat.com/comparativo/chatwoot">Comparativo vs Chatwoot</a> ·
    <a href="https://noovichat.com/chatwoot-crm">CRM para Chatwoot</a> ·
    <a href="https://noovichat.com/pricing">Trial 7 dias grátis</a>
  </p>

  <p>
    <a href="https://github.com/Noovi-AI/noovichat-resources/stargazers"><img src="https://img.shields.io/github/stars/Noovi-AI/noovichat-resources" alt="Stars" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
    <a href="https://www.npmjs.com/package/@nooviai/n8n-nodes-noovichat"><img src="https://img.shields.io/npm/v/@nooviai/n8n-nodes-noovichat?label=n8n%20node" alt="n8n node" /></a>
    <a href="https://www.npmjs.com/package/@nooviai/noovichat-mcp"><img src="https://img.shields.io/npm/v/@nooviai/noovichat-mcp?label=MCP%20server" alt="MCP server" /></a>
  </p>
</div>

---

## O que é o NooviChat?

NooviChat é a **versão brasileira comercial do Chatwoot** que adiciona:

- **Pipeline CRM em kanban** (Pipeline Pro) — não existe no Chatwoot upstream
- **Captain AI** com modelos generativos avançados + RAG via pgvector
- **WAHA Plus** integrado (WhatsApp não-oficial multi-device)
- **Templates avançados** de WhatsApp Business (componentes, parâmetros nomeados)
- **Lead scoring** automático com regras customizáveis
- **Follow-ups** inteligentes baseados em SLA e comportamento
- **Broadcasts** em massa com anti-block (spintax, rotação de inbox)
- **Appointments** com Google Calendar sync
- **Internal Chat** entre agentes da mesma conta
- **Noovi Labs / FlowBuilder** — automações visuais drag-and-drop

## Por que esse repo?

Aqui você encontra **tudo que é público sobre o NooviChat**: documentação,
tutoriais em português, exemplos de código, workflows n8n prontos, configs
Docker, comparativos com o Chatwoot upstream e estudos de caso (com
autorização dos clientes).

O **código fonte do produto é privado** (licença comercial sobre fork MIT
do Chatwoot) — mas todos os recursos para usar, integrar e estender o
NooviChat são abertos.

## Quick Links

- 📚 [Documentação completa](docs/)
- 🚀 [Quickstart — instalação em 10 minutos](docs/getting-started.md)
- 🔌 [Integrações](docs/integrations/)
- 📖 [Tutoriais (PT-BR)](docs/tutorials/)
- 🛠 [Workflows n8n prontos](examples/n8n-workflows/)
- 🐳 [Docker Compose templates](examples/docker-compose-templates/)
- 💻 [Snippets de API](examples/api-snippets/)
- ⭐ [Awesome NooviChat](awesome-noovichat.md)

## Comparativo rápido — Chatwoot vs NooviChat

| Feature | Chatwoot upstream | NooviChat |
|---|---|---|
| Pipeline CRM (kanban) | ❌ | ✅ Pipeline Pro |
| WhatsApp via WAHA | ❌ | ✅ Plus incluído |
| Captain AI com modelo generativo avançado | Limitado | ✅ Full + RAG |
| Lead scoring | ❌ | ✅ |
| Follow-ups automáticos | ❌ | ✅ |
| Broadcasts anti-block | ❌ | ✅ |
| Appointments + Google Calendar | ❌ | ✅ |
| Auto-instalador via curl | ❌ | ✅ |
| Suporte 100% PT-BR | ❌ | ✅ |
| FlowBuilder visual | ❌ | ✅ Noovi Labs |
| n8n community node oficial | ❌ | ✅ `@nooviai/n8n-nodes-noovichat` |
| MCP server (Model Context Protocol) | ❌ | ✅ `@nooviai/noovichat-mcp` |

[Ver comparativo completo →](https://noovichat.com/comparativo/chatwoot)

## Instalação

NooviChat é instalado no seu próprio servidor via auto-instalador:

```bash
bash <(curl -sL instalador.noovichat.com)
```

Requisitos mínimos:
- VPS Linux (Ubuntu 22.04+, Debian 12+)
- 4GB RAM (8GB recomendado)
- 50GB disco
- 2 CPUs

[Tutorial completo →](docs/getting-started.md)

## Planos

Todas as licenças entregam as **25 features completas** — sem feature gating.

| Plano | Duração | Preço | Limite VPS | WAHA Plus via Noovi |
|---|---|---|---|---|
| Trial | 7 dias | Gratuito | 1 | ❌ |
| Mensal | 30 dias | R$ 197 | 1 | ✅ |
| Trimestral | 90 dias | R$ 501 (R$167/mês) | 3 | ✅ |
| Anual | 365 dias | R$ 1.764 (R$147/mês) | 10 | ✅ |

[Detalhes →](https://noovichat.com/pricing)

## Ecossistema oficial

| Pacote | Distribuição | Uso |
|---|---|---|
| `@nooviai/n8n-nodes-noovichat` | [npm](https://www.npmjs.com/package/@nooviai/n8n-nodes-noovichat) | Community node n8n |
| `@nooviai/noovichat-mcp` | [npm](https://www.npmjs.com/package/@nooviai/noovichat-mcp) | MCP server compatível com qualquer host MCP |
| API REST oficial | [docs](https://noovichat.com/docs/noovichat) | API HTTP completa |

## Como contribuir

Issues, PRs e discussões são bem-vindos! Veja [CONTRIBUTING.md](CONTRIBUTING.md).

Para reportar bugs do produto: [contato@noovichat.com](mailto:contato@noovichat.com)
ou [Roadmap público](https://noovichat.com/roadmap).

## Licença

Conteúdo deste repositório (docs, exemplos, configs): **MIT** (veja [LICENSE](LICENSE)).
Produto NooviChat: **licença comercial** sobre fork MIT do Chatwoot.

## Sobre

Mantido pela [**Noovi**](https://noovichat.com), empresa brasileira por trás do
NooviChat. Site da agência associada: [nooviai.com](https://nooviai.com).
