# Integração WAHA — WhatsApp no NooviChat

WAHA (WhatsApp HTTP API) é um servidor self-hosted que expõe uma API REST para WhatsApp sem depender da API oficial da Meta. NooviChat inclui WAHA Plus nos planos pagos.

## O que é WAHA

WAHA funciona como um proxy entre o NooviChat e o WhatsApp:

```
NooviChat → WAHA API → WhatsApp Web Protocol → WhatsApp
```

É baseado no protocolo do WhatsApp Web (não-oficial), similar ao WhatsApp Web no navegador. Por isso, não requer aprovação da Meta nem pagamento por conversa.

**Documentação oficial WAHA**: [waha.dev](https://waha.dev)

## WAHA vs WhatsApp Cloud API

| Critério | WAHA Plus | Cloud API (Meta) |
|----------|-----------|-----------------|
| Setup | ~15 min, QR code | Dias/semanas (aprovação Meta) |
| Aprovação Meta | Não necessário | Obrigatório |
| Custo por conversa | Zero (incluso no NooviChat) | USD $0.06–0.09 |
| Tipos de número | Qualquer número | Apenas número Meta Business |
| Templates HSM | Não suportado | Suportado (pré-aprovação) |
| Multi-device | Sim (WAHA Plus) | Sim |
| Compliance Meta | Não-oficial | 100% oficial |

## Configuração no NooviChat

### Pré-requisito

WAHA Plus é provisionado automaticamente pelo NooviChat em planos pagos. Se estiver configurando manualmente:

```yaml
# docker-compose snippet WAHA Plus
waha:
  image: devlikeapro/waha-plus:latest
  environment:
    WHATSAPP_DEFAULT_ENGINE: WEBJS
    WHATSAPP_HOOK_URL: http://noovichat:3000/webhooks/waha
    WHATSAPP_HOOK_EVENTS: message,message.any,session.status
  volumes:
    - waha_sessions:/app/.sessions
  ports:
    - "127.0.0.1:3008:3000"
```

### Adicionar inbox no NooviChat

1. **Settings → Inboxes → Add New Inbox**
2. Selecione **WhatsApp (WAHA)**
3. Configure:
   - **Name**: nome da inbox (ex: "Atendimento WhatsApp")
   - **WAHA URL**: `http://waha:3000` (ou IP do container)
   - **API Token**: token configurado no WAHA
   - **Phone Number**: número conectado
4. Salve e escaneie o QR code que aparece no próximo passo

### Escanear QR Code

Após salvar a inbox:

1. Clique em **Connect** na inbox criada
2. Abra o WhatsApp no celular
3. Vá em **Dispositivos vinculados → Vincular um dispositivo**
4. Escaneie o QR code exibido no painel NooviChat
5. Status muda para **Connected** em alguns segundos

## Múltiplos números

Cada número WhatsApp = uma inbox WAHA separada:

```
Inbox 1 (Vendas) → WAHA Session 1 → +55 11 99999-0001
Inbox 2 (Suporte) → WAHA Session 2 → +55 11 99999-0002
Inbox 3 (Financeiro) → WAHA Session 3 → +55 11 99999-0003
```

Para mais de 3 números, considere WAHA Plus com multi-session no mesmo container.

## Reconexão após queda

WAHA Plus possui reconexão automática. Em caso de sessão expirada:

1. Acesse o painel NooviChat
2. Vá em Settings → Inboxes → [inbox afetada]
3. Clique em **Reconnect** e escaneie o QR code novamente

## Boas práticas

- **Não use número principal pessoal** — use um número dedicado ao atendimento
- **Evite mensagens em massa manuais** — use o módulo Broadcasts do NooviChat para compliance anti-block
- **Mantenha o número ativo** — numbers que ficam muito tempo sem uso podem ser desconectados
- **Backup de sessões** — faça backup do volume `waha_sessions` periodicamente

## Templates avançados (NooviChat)

NooviChat adiciona uma UI avançada para criação de templates de mensagem:

- Componentes: header (texto/imagem/documento), body, footer, buttons
- Parâmetros nomeados (`{{nome}}`, `{{empresa}}`, `{{link}}`)
- Botões URL e Quick Reply
- Preview antes de enviar

> Nota: Templates HSM (para iniciar conversa com cliente) requerem WhatsApp Cloud API e aprovação da Meta.
