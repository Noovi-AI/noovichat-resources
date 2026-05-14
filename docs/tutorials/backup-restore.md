# Backup e Restore do NooviChat

Guia completo para configurar backups automáticos e restaurar dados do NooviChat em caso de falha.

## O que fazer backup

| Dado | Criticidade | Localização |
|------|-------------|-------------|
| Banco PostgreSQL | 🔴 Crítico | Container `postgres` |
| Volumes WAHA (sessões WhatsApp) | 🟡 Importante | Volume Docker `waha_sessions` |
| Arquivos de upload (imagens, documentos) | 🟡 Importante | Volume Docker `uploads` |
| Arquivos de configuração | 🟢 Baixo | `/etc/noovichat/`, `docker-compose.yml` |

## Backup do banco PostgreSQL

### Backup manual

```bash
# Criar dump completo
docker exec postgres pg_dump \
  -U noovichat \
  -d noovichat_production \
  --no-owner \
  -Fc \
  > /backup/noovichat_$(date +%Y%m%d_%H%M).dump

# Verificar o arquivo
ls -lh /backup/noovichat_*.dump
```

### Backup automático diário (crontab)

```bash
# Criar diretório de backup
mkdir -p /backup/noovichat

# Abrir crontab
crontab -e

# Adicionar linha (backup às 2h da manhã, manter 7 dias)
0 2 * * * docker exec postgres pg_dump -U noovichat -d noovichat_production --no-owner -Fc > /backup/noovichat/noovichat_$(date +\%Y\%m\%d).dump && find /backup/noovichat -name "*.dump" -mtime +7 -delete
```

### Backup para S3 / Backblaze B2 (recomendado)

Instale o `rclone` e configure um remote:

```bash
# Instalar rclone
curl https://rclone.org/install.sh | sudo bash

# Configurar (siga o wizard)
rclone config

# Backup diário para S3
0 2 * * * docker exec postgres pg_dump -U noovichat -d noovichat_production --no-owner -Fc | rclone rcat s3:meu-bucket/noovichat/backup_$(date +\%Y\%m\%d).dump
```

## Backup das sessões WAHA

```bash
# Identificar o volume
docker volume ls | grep waha

# Fazer backup do volume
docker run --rm \
  -v noovichat_waha_sessions:/data \
  -v /backup:/backup \
  alpine tar czf /backup/waha_sessions_$(date +%Y%m%d).tar.gz /data
```

## Backup dos uploads

```bash
# Volume de uploads do NooviChat
docker run --rm \
  -v noovichat_uploads:/data \
  -v /backup:/backup \
  alpine tar czf /backup/uploads_$(date +%Y%m%d).tar.gz /data
```

## Restore do banco

### Restore completo (disaster recovery)

```bash
# 1. Parar o NooviChat
docker stop noovichat noovichat-sidekiq

# 2. Dropar e recriar banco
docker exec postgres dropdb -U noovichat noovichat_production
docker exec postgres createdb -U noovichat noovichat_production

# 3. Restaurar dump
docker exec -i postgres pg_restore \
  -U noovichat \
  -d noovichat_production \
  --no-owner \
  < /backup/noovichat/noovichat_20260514.dump

# 4. Rodar migrations (caso a versão seja diferente)
docker exec noovichat bundle exec rails db:migrate RAILS_ENV=production

# 5. Reiniciar
docker start noovichat noovichat-sidekiq
```

### Restore de arquivo específico (recuperação parcial)

Para recuperar uma conversa deletada acidentalmente:

```bash
# Criar banco temporário para consulta
docker exec postgres createdb -U noovichat noovichat_recovery

# Restaurar dump no banco temporário
docker exec -i postgres pg_restore \
  -U noovichat \
  -d noovichat_recovery \
  --no-owner \
  < /backup/noovichat_20260514.dump

# Consultar dado específico
docker exec postgres psql -U noovichat -d noovichat_recovery \
  -c "SELECT id, contact_id, created_at FROM conversations WHERE id = 1234;"

# Após recuperar o dado, dropar banco temporário
docker exec postgres dropdb -U noovichat noovichat_recovery
```

## Restore das sessões WAHA

```bash
# Parar WAHA
docker stop waha

# Restaurar sessões
docker run --rm \
  -v noovichat_waha_sessions:/data \
  -v /backup:/backup \
  alpine tar xzf /backup/waha_sessions_20260514.tar.gz -C /

# Reiniciar WAHA
docker start waha
```

## Verificar integridade do backup

```bash
# Testar se o dump é válido (sem restaurar)
pg_restore --list /backup/noovichat_20260514.dump > /dev/null && echo "✅ Backup válido" || echo "❌ Backup corrompido"
```

## Checklist de backup mensal

- [ ] Verificar que o cron de backup está rodando: `crontab -l`
- [ ] Verificar que os arquivos estão sendo gerados: `ls -lh /backup/noovichat/`
- [ ] Testar restore em ambiente de teste (pelo menos uma vez por mês)
- [ ] Verificar espaço em disco: `df -h /backup`
- [ ] Confirmar que backups off-site estão chegando (S3/B2)
- [ ] Revisar política de retenção (padrão: 7 dias local, 30 dias off-site)
