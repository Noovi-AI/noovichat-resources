# NooviChat API — Ruby client example
# Exemplos de uso da API NooviChat com Ruby puro (sem gems externas além de net/http)
#
# Ruby >= 2.7, sem dependências extras

require "net/http"
require "json"
require "uri"

class NooviChatClient
  BASE_PATH = "/api/v1/accounts"

  def initialize(url:, token:, account_id: 1)
    @uri = URI.parse(url)
    @token = token
    @account_id = account_id
  end

  # Buscar contato por telefone
  def find_contact_by_phone(phone)
    get("contacts/search", q: phone, include_contacts: true)
      .fetch("payload", [])
      .first
  end

  # Criar contato
  def create_contact(name:, phone:, email: nil, company: nil, custom_attributes: {})
    post("contacts", {
      name: name,
      phone_number: normalize_phone(phone),
      email: email,
      company_name: company,
      custom_attributes: custom_attributes
    }.compact)
  end

  # Criar conversa
  def create_conversation(contact_id:, inbox_id:, message: nil)
    payload = {
      contact_id: contact_id,
      inbox_id: inbox_id
    }
    payload[:message] = { content: message } if message
    post("conversations", payload)
  end

  # Enviar mensagem em conversa existente
  def send_message(conversation_id:, content:, private_note: false)
    post(
      "conversations/#{conversation_id}/messages",
      content: content,
      message_type: private_note ? "activity" : "outgoing",
      private: private_note
    )
  end

  # Adicionar label a uma conversa
  def add_label(conversation_id:, label:)
    post("conversations/#{conversation_id}/labels", labels: [label])
  end

  # Listar conversas abertas
  def open_conversations(page: 1)
    get("conversations", status: "open", page: page)
  end

  private

  def get(path, params = {})
    uri = build_uri(path, params)
    request = Net::HTTP::Get.new(uri)
    request["api_access_token"] = @token
    execute(request, uri)
  end

  def post(path, body)
    uri = build_uri(path)
    request = Net::HTTP::Post.new(uri)
    request["api_access_token"] = @token
    request["Content-Type"] = "application/json"
    request.body = body.to_json
    execute(request, uri)
  end

  def build_uri(path, params = {})
    uri = @uri.dup
    uri.path = "#{BASE_PATH}/#{@account_id}/#{path}"
    uri.query = URI.encode_www_form(params) unless params.empty?
    uri
  end

  def execute(request, uri)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    response = http.request(request)
    raise "API error #{response.code}: #{response.body}" unless response.code.to_i.between?(200, 299)
    JSON.parse(response.body)
  rescue JSON::ParserError
    {}
  end

  def normalize_phone(phone)
    digits = phone.gsub(/\D/, "")
    digits = "55#{digits}" unless digits.start_with?("55")
    "+#{digits}"
  end
end

# ---- Exemplo de uso ----
if __FILE__ == $PROGRAM_NAME
  client = NooviChatClient.new(
    url: ENV.fetch("NOOVICHAT_URL", "https://sua-instancia.noovichat.com"),
    token: ENV.fetch("NOOVICHAT_API_TOKEN"),
    account_id: ENV.fetch("NOOVICHAT_ACCOUNT_ID", 1).to_i
  )

  # Criar contato
  contact = client.create_contact(
    name: "João Silva",
    phone: "11999990001",
    email: "joao@empresa.com",
    company: "Empresa ABC",
    custom_attributes: { cargo: "CEO", setor: "Tecnologia" }
  )
  puts "Contato criado: #{contact['id']}"

  # Criar conversa e enviar mensagem de boas-vindas
  conversation = client.create_conversation(
    contact_id: contact["id"],
    inbox_id: 1,
    message: "Olá João! Bem-vindo ao NooviChat 👋"
  )
  puts "Conversa criada: ##{conversation['id']}"

  # Adicionar label
  client.add_label(conversation_id: conversation["id"], label: "novo-lead")
  puts "Label adicionada!"
end
