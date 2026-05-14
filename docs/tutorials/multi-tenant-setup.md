# Setup Multi-Tenant — NooviChat para Revendedores

Guia para configurar NooviChat como plataforma multi-tenant, permitindo gerenciar múltiplos clientes (tenants) em uma única instância, com isolamento completo entre eles.

## O que é multi-tenant no NooviChat

NooviChat herda a arquitetura multi-tenant do Chatwoot: uma única instância pode hospedar múltiplas "contas" (accounts) completamente isoladas. Cada conta tem seus próprios:

- Agentes e times
- Inboxes (WhatsApp, email, etc.)
- Contatos e conversas
- Pipeline Pro e deals
- Configurações e integrações

Perfeito para **revendedores** que querem oferecer NooviChat como serviço aos seus clientes, ou **franquias** com múltiplas unidades.

## Requisitos de infraestrutura

Para multi-tenant com 10+ contas ativas:

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| CPU | 4 vCPUs | 8 vCPUs |
| RAM | 8 GB | 16 GB |
| Disco | 80 GB SSD | 200 GB SSD |
| Conexões PostgreSQL | 100 max | 200+ (PgBouncer) |

## Configurando o Super Admin

NooviChat tem dois níveis de admin:

1. **Super Admin**: controla toda a instância — pode criar, suspender e deletar contas
2. **Account Admin**: controla apenas uma conta específica

### Acessar o Super Admin

```
https://sua-instancia.com/super_admin
Login: super_admin@noovichat (criado no install)
```

### Criar nova conta para cliente

No Super Admin:

1. **Accounts → New Account**
2. Preencha:
   - Nome da empresa (ex: "Empresa ABC LTDA")
   - Email do admin da conta
   - Locale (pt-BR)
   - Plano/limite de agentes (configure conforme contrato com o cliente)
3. Salve — o sistema envia convite automático para o admin

### WhiteLabel por conta

Com WhiteLabel habilitado (incluído nos planos NooviChat), cada conta pode ter:

- **Logo personalizado**: logo da empresa do cliente
- **Cores da marca**: cor primária e secundária customizáveis
- **Domínio customizado**: `chat.empresa-do-cliente.com.br`
- **Remoção de branding NooviChat**: logo NooviChat não aparece para usuários da conta

**Configurar WhiteLabel por conta:**

Super Admin → Accounts → [conta] → White Label:
- Upload de logo
- Seleção de cores
- Domínio customizado (requer CNAME apontando para sua instância)

### Domínio customizado por cliente

Para que cada cliente acesse em `chat.suaempresa.com.br` em vez do domínio da sua instância:

1. O cliente cria CNAME: `chat.suaempresa.com.br → sua-instancia.noovichat.com.br`
2. No Super Admin, configure o domínio customizado para a conta
3. NooviChat detecta automaticamente pelo header `Host` e serve o WhiteLabel correto
4. SSL é gerado automaticamente via Let's Encrypt wildcard (configure `*.sua-instancia.com.br`)

## Monitoramento multi-tenant

### Visualizar saúde de todas as contas

No Super Admin:
- **Accounts**: lista todas as contas com status de atividade
- **Usage**: conversas por conta no mês, agentes ativos
- **Billing**: se integrado com cobrança

### Limitar recursos por conta

Você pode definir limites por conta para evitar que um cliente impacte outros:

```ruby
# Via Super Admin → Account Settings
max_agents: 10      # limite de agentes
max_inboxes: 5      # limite de inboxes
```

## Cobrança e billing

NooviChat não tem billing nativo por tenant — você implementa via:

1. **Manual**: cobrança mensal baseada em número de agentes ativos
2. **Stripe + n8n**: webhook ao criar conta → provisiona no Stripe automaticamente
3. **AbacatePay**: gateway BR para pagamentos recorrentes via PIX/boleto

## Isolamento de dados

Cada conta (tenant) tem isolamento garantido pelo banco de dados:

- Todos os registros têm `account_id` — consultas sempre filtram por conta
- Nenhum dado de uma conta é acessível por outra via UI
- Único ponto de acesso cross-tenant: Super Admin (protegido por senha separada)

## WAHA por tenant

Para cada cliente com WhatsApp, você pode:

**Opção A — WAHA compartilhado**: um container WAHA serve múltiplas sessões (múltiplos números). Mais econômico.

```yaml
# WAHA Plus com múltiplas sessões
waha:
  image: devlikeapro/waha-plus:latest
  environment:
    WHATSAPP_DEFAULT_ENGINE: WEBJS
    # Sem WHATSAPP_SESSION — o NooviChat cria sessões dinamicamente
```

**Opção B — WAHA dedicado por cliente**: cada cliente tem seu próprio container WAHA. Mais isolamento, mais custo.

Para alta disponibilidade, prefira Opção A (WAHA Plus suporta até 50 sessões simultâneas no mesmo container).
