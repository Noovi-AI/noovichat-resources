# Awesome NooviChat

> Lista curada de recursos, integrações, plugins e tutoriais para o ecossistema NooviChat.
>
> Inspirado em [awesome lists](https://github.com/sindresorhus/awesome).

---

## Sumário

- [Pacotes oficiais](#pacotes-oficiais)
- [Tutoriais (PT-BR)](#tutoriais-pt-br)
- [Workflows e exemplos](#workflows-e-exemplos)
- [Comparativos](#comparativos)
- [Vídeos](#vídeos)
- [Comunidade](#comunidade)
- [Sobre o ecossistema Chatwoot](#sobre-o-ecossistema-chatwoot)
- [Contribuir com esta lista](#contribuir-com-esta-lista)

---

## Pacotes oficiais

### Distribuídos pela Noovi

- [`@nooviai/n8n-nodes-noovichat`](https://www.npmjs.com/package/@nooviai/n8n-nodes-noovichat) — Community node n8n oficial. CRUD em todos os recursos da API.
- [`@nooviai/noovichat-mcp`](https://www.npmjs.com/package/@nooviai/noovichat-mcp) — MCP server compatível com qualquer host MCP (~138 tools).

### Open-source upstream relacionado

- [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot) — Base open-source do NooviChat. MIT.
- [WAHA](https://waha.devlike.pro/) — WhatsApp HTTP API que NooviChat usa nativamente.

---

## Tutoriais (PT-BR)

### Instalação e setup

- [Quickstart — Instalação em 10 minutos](docs/getting-started.md)
- [Backup automatizado](docs/tutorials/backup-restore.md) *(em breve)*
- [Multi-tenant setup](docs/tutorials/multi-tenant-setup.md) *(em breve)*

### Pipeline Pro (CRM)

- [Pipeline Pro setup completo](docs/tutorials/pipeline-setup-completo.md) *(em breve)*
- [Lead scoring — regras práticas](docs/tutorials/lead-scoring-rules-praticas.md) *(em breve)*

### WhatsApp

- [WAHA vs WhatsApp Cloud API: qual escolher](docs/tutorials/waha-vs-cloud-api.md) *(em breve)*
- [Templates HSM avançados](docs/features/whatsapp-templates.md) *(em breve)*

### Captain AI

- [Configurando Captain AI](docs/features/captain-ai.md) *(em breve)*

### Migrações

- [Migrando do Chatwoot oficial pro NooviChat](docs/tutorials/migrar-do-chatwoot.md) *(em breve)*

---

## Workflows e exemplos

### n8n workflows prontos (importar direto)

- [Auto follow-up 3 dias após resolução](examples/n8n-workflows/auto-followup-3dias.json) *(em breve)*
- [Lead qualification BANT](examples/n8n-workflows/lead-qualification-bant.json) *(em breve)*
- [Sync com Google Sheets](examples/n8n-workflows/google-sheets-sync.json) *(em breve)*
- [Sync com Pipedrive](examples/n8n-workflows/crm-pipedrive-sync.json) *(em breve)*
- [Alerta Slack pra leads quentes](examples/n8n-workflows/alerta-slack-leads-quentes.json) *(em breve)*

### Docker Compose templates

- [Setup básico (single-host)](examples/docker-compose-templates/basic.yml) *(em breve)*
- [Com monitoring (Prometheus + Grafana)](examples/docker-compose-templates/with-monitoring.yml) *(em breve)*
- [High availability (3 replicas)](examples/docker-compose-templates/high-availability.yml) *(em breve)*

### API snippets

- **Python**:
  - [send-message.py](examples/api-snippets/python/send-message.py) *(em breve)*
  - [bulk-create-contacts.py](examples/api-snippets/python/bulk-create-contacts.py) *(em breve)*
- **JavaScript / Node.js**:
  - [webhook-receiver.js](examples/api-snippets/javascript/webhook-receiver.js) *(em breve)*
  - [batch-export.js](examples/api-snippets/javascript/batch-export.js) *(em breve)*
- **curl**:
  - [50 receitas curl](examples/api-snippets/curl/50-recipes.md) *(em breve)*

---

## Comparativos

- [NooviChat vs Chatwoot upstream](https://noovichat.com/comparativo/chatwoot)
- [Chatwoot com CRM nativo](https://noovichat.com/chatwoot-crm)
- NooviChat vs Digisac *(em breve)*
- NooviChat vs SleekFlow *(em breve)*
- NooviChat vs Octadesk *(em breve)*
- NooviChat vs Take Blip *(em breve)*

---

## Vídeos

### Canal NooviChat (YouTube)

*(canal em planejamento — primeiros vídeos em breve)*

### Vídeos comunitários sobre Chatwoot+CRM

- [Chatwoot: O Melhor CRM Omnichannel](https://www.youtube.com/watch?v=iFKg9_OeCgc)
- [O que é um CRM? Chatwoot com Kanban](https://www.youtube.com/watch?v=3SzcoIAjv6c)
- [Como Criar um Kanban de Vendas no Chatwoot](https://www.youtube.com/watch?v=LHtteuSXsho)
- [Criar um Kanban INCREDÍVEL no ChatWoot com n8n](https://www.youtube.com/watch?v=Hmqap00lwuY)

---

## Comunidade

### Canais oficiais

- 🌐 [Site oficial](https://noovichat.com)
- 🗺️ [Roadmap público com votação](https://noovichat.com/roadmap)
- 📧 contato@noovichat.com
- 🐙 [GitHub Noovi-AI](https://github.com/Noovi-AI)

### Diretórios externos onde NooviChat aparece

- [openalternative.co — Chatwoot alternatives](https://openalternative.co/) *(submeter)*
- [alternativeto.net — Chatwoot alternatives](https://alternativeto.net/software/chatwoot/) *(submeter)*
- [awesome-selfhosted](https://awesome-selfhosted.net/) *(submeter)*

---

## Sobre o ecossistema Chatwoot

NooviChat é fork de Chatwoot. Aqui ficam links relevantes ao ecossistema
mais amplo, incluindo outros forks e integrações relevantes:

- [chatwoot/chatwoot — projeto oficial](https://github.com/chatwoot/chatwoot)
- [Chatwoot integrations marketplace](https://www.chatwoot.com/features/integrations/)
- [productdevbook/chatwoot — integration Vue/Nuxt](https://github.com/productdevbook/chatwoot)
- [chatwoot/wp-plugin — plugin WordPress](https://github.com/chatwoot/wp-plugin)
- [chatwoot/utils — utility functions](https://github.com/chatwoot/utils)

### Outros forks brasileiros

- [fazer.ai — fork brasileiro com Sales Kanban + Baileys + Z-API](https://fazer.ai/) (parceiro Chatwoot Inc no Brasil)

---

## Contribuir com esta lista

Quer adicionar um recurso? Abra PR! Veja [CONTRIBUTING.md](CONTRIBUTING.md).

Critérios:
- Recurso público (sem credenciais ou domínios privados)
- Relacionado ao ecossistema NooviChat ou Chatwoot
- Mantido / utilizável (não abandonado há >2 anos)
- Categoria correta (workflows, integrações, vídeos, etc)

---

**Mantido pela** [Noovi](https://noovichat.com).
**Contribuições**: bem-vindas via PR.
