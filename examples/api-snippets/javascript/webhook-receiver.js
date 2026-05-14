/**
 * NooviChat Webhook Receiver — Node.js / Express
 * Recebe webhooks do NooviChat e processa eventos.
 *
 * npm install express crypto
 */

const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3001;
const WEBHOOK_SECRET = process.env.NOOVICHAT_WEBHOOK_SECRET; // configurado no NooviChat

// Parse raw body para verificação de assinatura
app.use(express.raw({ type: "application/json" }));

/**
 * Verifica assinatura HMAC-SHA256 do NooviChat.
 * @param {Buffer} rawBody - corpo bruto da requisição
 * @param {string} signature - header X-Noovichat-Signature
 * @returns {boolean}
 */
function verifySignature(rawBody, signature) {
  if (!WEBHOOK_SECRET) return true; // sem secret configurado, aceitar tudo (desenvolvimento)
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature || ""),
    Buffer.from(expected)
  );
}

// Handlers por tipo de evento
const eventHandlers = {
  "conversation.created": (data) => {
    console.log(`Nova conversa: #${data.id} — ${data.meta?.sender?.name}`);
    // Sua lógica: criar ticket no Jira, notificar Slack, etc.
  },

  "conversation.status_changed": (data) => {
    console.log(`Conversa #${data.id} → status: ${data.status}`);
    if (data.status === "resolved") {
      // Lógica para conversa resolvida: atualizar CRM, enviar pesquisa NPS, etc.
    }
  },

  "message.created": (data) => {
    if (data.message_type === "incoming") {
      console.log(
        `Nova mensagem de ${data.sender?.name}: "${data.content?.substring(0, 50)}"`
      );
    }
  },

  "contact.created": (data) => {
    console.log(`Novo contato: ${data.name} (${data.phone_number})`);
    // Sincronizar com CRM externo
  },

  "pipeline_card.stage_changed": (data) => {
    console.log(
      `Card #${data.card_id}: ${data.from_stage} → ${data.to_stage}`
    );
    // Atualizar Pipedrive, disparar automação, etc.
  },
};

// Endpoint principal do webhook
app.post("/webhook", (req, res) => {
  const signature = req.headers["x-noovichat-signature"];

  // Verificar assinatura
  if (!verifySignature(req.body, signature)) {
    console.warn("Assinatura inválida — possível requisição não autorizada");
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Responder 200 imediatamente (não bloquear o NooviChat)
  res.status(200).json({ received: true });

  // Processar o evento de forma assíncrona
  let payload;
  try {
    payload = JSON.parse(req.body.toString());
  } catch (e) {
    console.error("Payload inválido:", e.message);
    return;
  }

  const { event, data } = payload;
  const handler = eventHandlers[event];

  if (handler) {
    try {
      handler(data);
    } catch (e) {
      console.error(`Erro ao processar evento ${event}:`, e.message);
    }
  } else {
    console.log(`Evento não tratado: ${event}`);
  }
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Webhook receiver rodando na porta ${PORT}`);
});
