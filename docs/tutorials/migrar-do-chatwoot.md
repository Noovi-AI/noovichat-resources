# Migrando do Chatwoot para o NooviChat

Guia completo para migrar uma instância Chatwoot upstream existente para o NooviChat, preservando todos os dados: contatos, conversas, agentes e configurações.

## O que migra automaticamente

Como NooviChat é fork direto do Chatwoot, o schema do banco é compatível:

| Dado | Migra? | Observação |
|------|--------|-----------|
| Contatos | ✅ Completo | Todos os campos nativos |
| Conversas | ✅ Completo | Com histórico de mensagens |
| Agentes | ✅ Completo | Credenciais precisam ser redefinidas |
| Times (Teams) | ✅ Completo | |
| Inboxes (configuração) | ✅ Completo | WhatsApp/Email precisa reconectar |
| Labels | ✅ Completo | |
| Canned responses | ✅ Completo | |
| Custom attributes | ✅ Completo | |
| Pipeline Pro cards | ❌ Não existe | Módulo proprietário NooviChat |
| Configurações de conta | ✅ Maioria | Verificar após migração |

## Pré-requisitos

1. **Acesso SSH** à instância Chatwoot atual
2. **Instância NooviChat nova** (instalada em outro servidor ou domínio)
3. **Janela de manutenção**: mínimo 1h para instâncias pequenas (<100k conversas)

## Passo a passo

### Etapa 1: Backup completo do Chatwoot

```bash
# Na instância Chatwoot atual (como root)

# 1. Parar workers para evitar writes durante backup
docker stop chatwoot-sidekiq

# 2. Fazer dump do banco
docker exec -t chatwoot-postgres pg_dump \
  -U chatwoot \
  -d chatwoot_production \
  --no-owner \
  --no-privileges \
  -Fc \
  > chatwoot_backup_$(date +%Y%m%d_%H%M).dump

# 3. Confirmar tamanho do arquivo
ls -lh chatwoot_backup_*.dump

# 4. Copiar para máquina local ou armazenamento seguro
scp root@SEU_SERVIDOR:~/chatwoot_backup_*.dump ./
```

### Etapa 2: Instalar NooviChat em novo servidor

Siga o [tutorial de instalação do zero](instalacao-vps-zero.md). Use um domínio temporário ou novo para a instância NooviChat.

> **Importante**: NÃO complete o setup inicial do NooviChat (wizard de onboarding) — interrompa antes de criar dados.

### Etapa 3: Restaurar o backup

```bash
# Na instância NooviChat nova

# 1. Parar o NooviChat enquanto restauramos
docker stop noovichat noovichat-sidekiq

# 2. Dropar o banco criado pelo auto-instalador
docker exec noovichat-postgres dropdb -U noovichat noovichat_production
docker exec noovichat-postgres createdb -U noovichat noovichat_production

# 3. Copiar o dump para o servidor novo
scp chatwoot_backup_*.dump root@NOVO_SERVIDOR:~/

# 4. Restaurar o dump
docker exec -i noovichat-postgres pg_restore \
  -U noovichat \
  -d noovichat_production \
  --no-owner \
  --role noovichat \
  < chatwoot_backup_*.dump

# 5. Rodar migrations NooviChat (adiciona tabelas proprietárias)
docker exec noovichat bundle exec rails db:migrate RAILS_ENV=production

# 6. Reiniciar tudo
docker start noovichat noovichat-sidekiq
```

### Etapa 4: Verificar a migração

```bash
# Verificar que os dados estão lá
docker exec noovichat bundle exec rails runner \
  "puts \"Contatos: #{Contact.count}, Conversas: #{Conversation.count}, Agentes: #{User.count}\""
```

Compare com os números da instância original.

### Etapa 5: Reconectar integrações

**WhatsApp (WAHA)**:
- Não é necessário escanear novamente se o volume WAHA foi migrado
- Se não migrou o volume: Settings → Inboxes → [inbox WhatsApp] → Reconnect → escanear QR

**Email inboxes**:
- As credenciais SMTP/IMAP são mantidas no banco
- Verificar em Settings → Inboxes se estão conectadas

**Integrações (OpenAI, etc.)**:
- As chaves de API ficam no banco — devem ter migrado
- Verificar em Settings → Integrations

### Etapa 6: Redefinir senhas dos agentes

Por segurança, peça que todos os agentes redefinam suas senhas:

```bash
# Enviar email de reset para todos os agentes
docker exec noovichat bundle exec rails runner \
  "User.where(role: :agent).each { |u| u.send_reset_password_instructions }"
```

### Etapa 7: Atualizar DNS

Quando tudo estiver verificado:

1. Atualize o registro DNS para apontar para o novo servidor
2. Aguarde propagação (5-30 minutos)
3. Verifique HTTPS funcionando no novo domínio

### Etapa 8: Desativar instância antiga

Após confirmar que tudo funciona na nova instância:

```bash
# Opcional: manter instância antiga em modo read-only por 7 dias
docker stop chatwoot chatwoot-sidekiq
```

## Solução de problemas comuns

### Erro de permissão no pg_restore

```bash
# Adicionar --no-owner e --role correto
pg_restore --no-owner --role noovichat ...
```

### Migrations falhando

```bash
# Ver qual migration falhou
docker exec noovichat bundle exec rails db:migrate:status RAILS_ENV=production
# Rodar migration específica
docker exec noovichat bundle exec rails db:migrate:up VERSION=XXXXX RAILS_ENV=production
```

### Assets não carregando

```bash
# Recompilar assets
docker exec noovichat bundle exec rails assets:precompile RAILS_ENV=production
docker restart noovichat
```

## Suporte para migração

Para instâncias grandes (>1M conversas) ou em caso de problemas, o suporte NooviChat oferece migração assistida. Abra um ticket em [noovichat.com/suporte](https://noovichat.com) mencionando "migração do Chatwoot".
