/**
 * NooviChat API — Batch Export (Node.js)
 * Exporta contatos e conversas em lotes para análise ou migração.
 *
 * npm install node-fetch
 */

const fs = require("fs");

const NOOVICHAT_URL = process.env.NOOVICHAT_URL || "https://sua-instancia.noovichat.com";
const API_TOKEN = process.env.NOOVICHAT_API_TOKEN;
const ACCOUNT_ID = process.env.NOOVICHAT_ACCOUNT_ID || "1";

const headers = {
  "api_access_token": API_TOKEN,
  "Content-Type": "application/json",
};

async function fetchPage(endpoint, params = {}) {
  const url = new URL(`${NOOVICHAT_URL}/api/v1/accounts/${ACCOUNT_ID}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

/**
 * Exporta todos os contatos com paginação automática.
 * @param {string} outputFile - caminho do arquivo JSON de saída
 */
async function exportAllContacts(outputFile = "contacts_export.json") {
  const allContacts = [];
  let page = 1;
  let hasMore = true;

  console.log("Exportando contatos...");

  while (hasMore) {
    const data = await fetchPage("contacts", { page, include_contacts: true });
    const contacts = data.payload || [];

    allContacts.push(...contacts);
    console.log(`  Página ${page}: ${contacts.length} contatos (total: ${allContacts.length})`);

    hasMore = contacts.length === 100; // NooviChat retorna 100 por página por padrão
    page++;

    // Rate limiting gentil
    await new Promise((r) => setTimeout(r, 100));
  }

  fs.writeFileSync(outputFile, JSON.stringify(allContacts, null, 2));
  console.log(`✅ ${allContacts.length} contatos exportados → ${outputFile}`);
  return allContacts;
}

/**
 * Exporta conversas resolvidas de um período.
 * @param {string} since - data ISO (ex: "2026-01-01")
 * @param {string} outputFile
 */
async function exportResolvedConversations(since, outputFile = "conversations_export.json") {
  const allConversations = [];
  let page = 1;
  let hasMore = true;

  console.log(`Exportando conversas resolvidas desde ${since}...`);

  while (hasMore) {
    const data = await fetchPage("conversations", {
      status: "resolved",
      page,
      assignee_type: "all",
    });

    const conversations = data.data?.payload || [];

    // Filtrar pelo período
    const filtered = conversations.filter(
      (c) => new Date(c.created_at) >= new Date(since)
    );

    allConversations.push(...filtered);

    // Se todos os itens da página são mais novos que `since`, continuar
    // Se algum é mais antigo, parar
    const hasOlder = conversations.some(
      (c) => new Date(c.created_at) < new Date(since)
    );

    hasMore = conversations.length > 0 && !hasOlder;
    page++;

    console.log(`  Página ${page - 1}: ${filtered.length} conversas no período`);
    await new Promise((r) => setTimeout(r, 150));
  }

  fs.writeFileSync(outputFile, JSON.stringify(allConversations, null, 2));
  console.log(`✅ ${allConversations.length} conversas exportadas → ${outputFile}`);
  return allConversations;
}

// Executar
(async () => {
  try {
    await exportAllContacts();
    await exportResolvedConversations("2026-01-01");
  } catch (e) {
    console.error("Erro na exportação:", e.message);
    process.exit(1);
  }
})();
