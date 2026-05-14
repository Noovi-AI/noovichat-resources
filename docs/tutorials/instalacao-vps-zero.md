# Instalação NooviChat em VPS do Zero

Guia completo para instalar NooviChat em um servidor VPS limpo, do zero ao primeiro atendimento, em menos de 30 minutos.

## Pré-requisitos

### VPS recomendado

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| CPU | 2 vCPUs | 4 vCPUs |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB SSD | 80 GB SSD |
| SO | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

**Provedores testados**: DigitalOcean, Hetzner, Contabo, AWS Lightsail, Oracle Cloud Free Tier (4 OCPUs + 24GB RAM — ótima opção gratuita).

### Pré-requisitos de configuração

1. **Domínio apontado para o IP do VPS**: crie um registro A `chat.suaempresa.com.br` apontando para o IP
2. **Aguarde propagação DNS** (5-30 minutos) antes de instalar
3. **Acesso SSH** como root ou usuário com sudo
4. **Chave de licença NooviChat** (obtida após trial ou compra em [noovichat.com/pricing](https://noovichat.com/pricing))

## Instalação com Auto-instalador

### 1. Conectar no VPS

```bash
ssh root@IP_DO_SEU_VPS
```

### 2. Rodar o auto-instalador

```bash
curl -fsSL https://get.noovichat.com | bash
```

O script irá solicitar:

```
🚀 NooviChat Auto-Installer
============================

Domínio (ex: chat.suaempresa.com.br): chat.suaempresa.com.br
Email para SSL (Let's Encrypt): admin@suaempresa.com.br
Chave de licença NooviChat: NC-XXXX-XXXX-XXXX-XXXX

Iniciando instalação...
```

### 3. Aguardar a instalação

O processo leva 10-20 minutos e realiza automaticamente:

- ✅ Atualização do sistema (apt update/upgrade)
- ✅ Instalação do Docker e Docker Compose
- ✅ Download das imagens NooviChat
- ✅ Configuração do PostgreSQL com pgvector
- ✅ Configuração do Redis
- ✅ Instalação e configuração do Nginx
- ✅ Obtenção do certificado SSL (Let's Encrypt)
- ✅ Inicialização dos containers
- ✅ Seed inicial do banco de dados
- ✅ Criação do usuário super admin

### 4. Acessar o painel

Ao finalizar, o instalador exibe:

```
✅ NooviChat instalado com sucesso!

Painel: https://chat.suaempresa.com.br
Email: admin@suaempresa.com.br
Senha: SENHA_GERADA_AUTOMATICAMENTE

IMPORTANTE: altere a senha no primeiro acesso!
```

## Pós-instalação

### 1. Alterar senha do admin

Acesse o painel → clique no avatar → Profile Settings → mudar senha.

### 2. Configurar o nome da empresa

Settings → Account → Account Name: "NomeDaSuaEmpresa"

### 3. Adicionar primeiro inbox WhatsApp

Settings → Inboxes → Add New Inbox → WhatsApp (WAHA):
- WAHA já está rodando — escaneie o QR code
- Configure o nome do inbox e agentes responsáveis

### 4. Convidar agentes

Settings → Agents → Invite Agent → envie o email de convite.

### 5. Configurar horário de atendimento

Settings → Business Hours → defina dias e horários de atendimento.

## Verificar saúde da instalação

```bash
# Ver todos os containers
docker ps

# Deve mostrar: noovichat, postgres, redis, sidekiq, waha

# Verificar logs
docker logs noovichat --tail 50

# Verificar uso de recursos
docker stats --no-stream
```

## Renovação do SSL

O SSL é renovado automaticamente via certbot cron. Para renovar manualmente:

```bash
certbot renew --nginx
```

## Backup diário (recomendado)

Configure backup automático do banco:

```bash
# Adicionar ao crontab (crontab -e)
0 2 * * * docker exec postgres pg_dump -U noovichat noovichat_production > /backup/noovichat_$(date +%Y%m%d).sql
```

Ver tutorial completo em [backup-restore.md](backup-restore.md).

## Próximos passos

- [Pipeline Setup Completo](pipeline-setup-completo.md)
- [WAHA vs Cloud API](waha-vs-cloud-api.md)
- [Lead Scoring — regras práticas](lead-scoring-rules-praticas.md)
- [Automações n8n essenciais](automacoes-n8n-essenciais.md)
