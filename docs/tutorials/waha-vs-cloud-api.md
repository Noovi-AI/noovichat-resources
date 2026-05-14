# WAHA vs WhatsApp Cloud API — Qual escolher?

Guia completo para ajudar você a decidir entre WAHA (protocolo não-oficial) e WhatsApp Cloud API (Meta oficial) para conectar WhatsApp ao NooviChat.

## TL;DR — Decisão rápida

| Perfil | Recomendação |
|--------|-------------|
| PME brasileira, atendimento local, <1000 conversas/mês | **WAHA** |
| Empresa com compliance Meta exigido, templates HSM | **Cloud API** |
| Alto volume com custo controlado e sem compliance específico | **WAHA Plus** |
| Enterprise com WhatsApp Business Platform oficial | **Cloud API** |

## Comparativo detalhado

### Setup e aprovação

**WAHA:**
- Setup em 15 minutos (Docker + QR code)
- Sem aprovação da Meta
- Funciona com qualquer número (pessoal ou Business)
- Nenhuma documentação de empresa necessária

**Cloud API:**
- Processo de aprovação: 3-14 dias
- Requer Meta Business Manager verificado
- Business Verification obrigatório (CNPJ, documentos)
- Número deve ser registrado no Meta

### Custo

**WAHA:**
- WAHA Plus incluído nos planos NooviChat pagos
- Zero custo por conversa
- Custo total: apenas seu plano NooviChat

**Cloud API:**
- Gratuito para até 1.000 conversas/mês iniciadas pelo usuário
- Após isso: USD $0.06 (marketing) a $0.09 (serviço) por conversa — cobrado pela Meta
- Para 5.000 conversas/mês: ~R$2.500/mês apenas em fees Meta

### Funcionalidades

**WAHA suporta:**
- Envio e recebimento de texto, imagens, documentos, áudio, vídeo
- Stickers e reactions
- Grupos (consultar no WhatsApp Web)
- Múltiplos dispositivos vinculados (WAHA Plus)
- Sessões persistentes (não precisa escanear QR code toda semana)

**WAHA NÃO suporta:**
- Templates HSM para iniciar conversa com cliente (apenas receber)
- Verificação oficial da conta

**Cloud API suporta:**
- Templates HSM aprovados pela Meta (iniciar conversa proativamente)
- Verificação da conta (badge verde)
- Análise de qualidade do número
- Catalog e botões interativos (via templates)
- Status "negócio verificado"

**Cloud API NÃO suporta:**
- Stickers
- Status/Stories
- Grupos (na maioria dos casos)

### Risco de ban

**WAHA:**
- Risco existe para alto volume não-solicitado
- Mitigações: envio gradual, opt-in real, broadcasts com anti-block NooviChat
- Números pessoais com WAHA têm maior risco que Business Numbers
- Risco aceitável para uso moderado (atendimento receptivo)

**Cloud API:**
- Praticamente zero risco de ban (protocolo oficial Meta)
- Meta pode suspender templates por qualidade baixa

## Quando usar cada um

### Use WAHA quando:

✅ Você precisa de setup rápido (hoje, não em 2 semanas)  
✅ Seu volume é < 2.000 conversas/mês  
✅ Usa atendimento receptivo (clientes que te procuram)  
✅ Não precisa de templates HSM para campanhas  
✅ Quer economizar (sem custo por conversa Meta)  
✅ Tem múltiplos números pequenos (1 WAHA container por número)  

### Use Cloud API quando:

✅ Precisa de campanhas proativas em escala (templates HSM)  
✅ Seu setor exige compliance com termos Meta (financeiro, jurídico, saúde)  
✅ Precisa do badge verde de conta verificada  
✅ Volume > 5.000 conversas/mês justifica o setup  
✅ Tem time de TI para gerenciar o processo de aprovação  

### Posso usar os dois?

**Sim!** NooviChat suporta múltiplos inboxes. Você pode ter:
- Inbox 1: WAHA → Atendimento receptivo (suporte, vendas inbound)
- Inbox 2: Cloud API → Campanhas proativas (follow-up em escala, broadcast oficial)

## Configurando WAHA no NooviChat

WAHA Plus já está provisionado nos planos pagos. Veja [docs/features/waha-integration.md](../features/waha-integration.md) para setup completo.

## Configurando Cloud API no NooviChat

1. Crie conta no [Meta Business Manager](https://business.facebook.com/)
2. Adicione e verifique o número no WhatsApp Business Platform
3. Gere token de acesso permanente
4. No NooviChat: Settings → Inboxes → Add → WhatsApp (Cloud API)
5. Insira: Phone Number ID, Business Account ID, Token

## WAHA + Proteção anti-ban

Para uso responsável com WAHA:

1. **Só atendimento receptivo**: NÃO inicie conversas em massa com WAHA
2. **Opt-in real**: o cliente deve ter iniciado contato antes
3. **Broadcasts com anti-block**: use o módulo Broadcasts NooviChat com batches e delays
4. **Limite diário**: < 300 novas mensagens/dia por número no período inicial
5. **Aquecimento do número**: comece com pouco volume e aumente gradualmente na primeira semana
