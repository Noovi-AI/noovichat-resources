# Quickstart — Instalando o NooviChat em 10 minutos

Este guia leva você de uma VPS recém-criada até NooviChat funcionando, com
WhatsApp, Pipeline CRM e tudo mais. Tempo total: ~10 minutos (depende da
velocidade da sua internet pra puxar imagens Docker).

## Pré-requisitos

### Servidor

- **VPS Linux**: Ubuntu 22.04 LTS, Ubuntu 24.04 LTS ou Debian 12
- **RAM**: 4 GB mínimo, 8 GB recomendado
- **CPU**: 2 vCPUs mínimo, 4 vCPUs recomendado
- **Disco**: 50 GB SSD
- **Acesso**: usuário sudo + senha (ou chave SSH)
- **Portas**: 22 (SSH), 80 e 443 abertas

### Domínio

- Subdomínio próprio apontando pro IP da VPS (ex: `chat.suaempresa.com.br`)
- Registro DNS tipo A criado e propagado (use [dnschecker.org](https://dnschecker.org/) pra verificar)

### Licença NooviChat

- Conta criada em [noovichat.com](https://noovichat.com) (signup gratuito)
- Trial 7 dias ativado OU plano comprado
- Chave de licença salva (formato `NOOVI-XXXX-XXXX-XXXX-XXXX`)

## Instalação

### Passo 1 — Conectar à VPS

```bash
ssh root@SEU-IP-DA-VPS
# ou
ssh usuario@SEU-IP-DA-VPS
```

Se for o primeiro login, atualize o sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

### Passo 2 — Rodar o auto-instalador

```bash
bash <(curl -sL instalador.noovichat.com)
```

O instalador vai:

1. Detectar sua distro Linux automaticamente
2. Instalar Docker, Docker Compose e Docker Swarm (se ainda não instalados)
3. Pedir sua chave de licença NooviChat
4. Validar com api.noovichat.com (precisa de internet outbound)
5. Pedir o domínio que você configurou (ex: `chat.suaempresa.com.br`)
6. Provisionar o stack completo:
   - NooviChat (Rails + Vue dashboard)
   - PostgreSQL 16 + pgvector
   - Redis 7
   - Sidekiq workers
   - WAHA (com WAHA Plus se seu plano incluir)
   - n8n (automações)
   - Portainer (gestão Docker)
   - Traefik (proxy reverso com SSL automático Let's Encrypt)
7. Aguardar SSL ser emitido (~30 segundos)
8. Imprimir URLs e credenciais iniciais

### Passo 3 — Primeiro acesso

Após o instalador terminar, abra:

```
https://chat.suaempresa.com.br
```

Login com as credenciais impressas no terminal (anote!).

Você cairá no setup wizard:

1. **Criar conta**: nome da empresa, e-mail do dono
2. **Convidar agentes**: adicione e-mails da equipe
3. **Conectar primeiro canal**: WhatsApp (WAHA) é mais rápido pra testar
4. **Criar primeira conversa de teste**: o sistema gera um QR code do WhatsApp
   pra escanear e validar a conexão
5. **Configurar Pipeline Pro**: criar primeiro funil (Vendas, Suporte, etc)

## Validação

Confira que tudo está funcionando:

```bash
# No servidor, ver containers rodando
docker stack services noovichat

# Esperado: ~5-7 services (app, sidekiq, redis, postgres, etc) todos com replicas 1/1

# Logs do Rails
docker service logs noovichat_noovichat_app --tail 50

# Esperado: "Listening on http://0.0.0.0:3000" sem ERROR/FATAL
```

No browser, teste:

- ✅ Login funciona
- ✅ Dashboard carrega
- ✅ Settings → Inboxes → adicionar canal funciona
- ✅ Settings → Pipelines → criar pipeline funciona
- ✅ WhatsApp QR code aparece e conecta

## Solução de problemas

### "Domain not pointing to this server"

DNS ainda não propagou. Espere 5-30 minutos e tente novamente. Verificar
propagação: `dig +short chat.suaempresa.com.br` deve retornar o IP da VPS.

### "License validation failed"

- Confirma que `api.noovichat.com` está alcançável: `curl -I https://api.noovichat.com/health`
- Confirma chave de licença sem espaços extras
- Se tudo OK, contate suporte: contato@noovichat.com

### "Container app crashloop"

Logs:
```bash
docker service logs noovichat_noovichat_app --tail 100 2>&1 | grep -i error
```

Causa comum: SECRET_KEY_BASE não setado no `.env`. Re-rodar instalador
ou regenerar manualmente:
```bash
SECRET_KEY_BASE=$(openssl rand -hex 64)
echo "SECRET_KEY_BASE=$SECRET_KEY_BASE" >> /home/debian/docker/stacks/noovichat/.env
docker stack deploy -c /home/debian/docker/stacks/noovichat/docker-compose.yml noovichat
```

### SSL não emitido

Let's Encrypt rate-limit: 5 emissões/semana por domínio. Se passou disso,
espere 7 dias ou use staging:
```bash
# Editar /home/debian/docker/stacks/noovichat/traefik.yml
# Trocar:
caServer: https://acme-v02.api.letsencrypt.org/directory
# Por:
caServer: https://acme-staging-v02.api.letsencrypt.org/directory
```

## Próximos passos

- [Configurar Pipeline Pro](tutorials/pipeline-setup-completo.md)
- [Conectar WhatsApp via WAHA](tutorials/waha-integration.md)
- [Configurar Captain AI](features/captain-ai.md)
- [Integrar com n8n](integrations/n8n.md)
- [Backup automatizado](tutorials/backup-restore.md)

## Suporte

- **Documentação completa**: https://noovichat.com/docs/noovichat
- **Roadmap público**: https://noovichat.com/roadmap
- **E-mail**: contato@noovichat.com
- **Issues neste repo**: para perguntas sobre tutoriais e exemplos

---

Próximo: [Pipeline Pro setup completo →](tutorials/pipeline-setup-completo.md)
