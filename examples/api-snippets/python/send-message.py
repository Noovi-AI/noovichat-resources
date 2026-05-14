"""
NooviChat API — Send Message (Python)
Envia uma mensagem para uma conversa existente.

Requisitos: pip install requests
"""

import requests
import os

NOOVICHAT_URL = os.getenv("NOOVICHAT_URL", "https://sua-instancia.noovichat.com")
API_TOKEN = os.getenv("NOOVICHAT_API_TOKEN")  # Settings → API Access Tokens

def send_message(conversation_id: int, content: str, message_type: str = "outgoing") -> dict:
    """
    Envia mensagem em uma conversa.

    Args:
        conversation_id: ID da conversa
        content: Texto da mensagem
        message_type: "outgoing" (agente) ou "activity" (nota interna)

    Returns:
        dict com dados da mensagem criada
    """
    response = requests.post(
        f"{NOOVICHAT_URL}/api/v1/accounts/1/conversations/{conversation_id}/messages",
        headers={
            "api_access_token": API_TOKEN,
            "Content-Type": "application/json",
        },
        json={
            "content": content,
            "message_type": message_type,
            "private": message_type == "activity",  # notas internas são privadas
        },
    )
    response.raise_for_status()
    return response.json()


def send_private_note(conversation_id: int, note: str) -> dict:
    """Envia nota interna (não visível ao cliente)."""
    return send_message(conversation_id, note, message_type="activity")


if __name__ == "__main__":
    # Exemplo de uso
    msg = send_message(
        conversation_id=1234,
        content="Olá! Como posso te ajudar hoje?",
    )
    print(f"Mensagem enviada: ID {msg['id']}")

    # Nota interna
    note = send_private_note(
        conversation_id=1234,
        note="Cliente solicitou desconto — escalado para supervisor.",
    )
    print(f"Nota interna criada: ID {note['id']}")
