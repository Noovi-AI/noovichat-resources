"""
NooviChat API — Bulk Create Contacts (Python)
Importa contatos em massa de uma lista, evitando duplicatas via upsert.

Requisitos: pip install requests
"""

import csv
import time
import requests
import os
from typing import Optional

NOOVICHAT_URL = os.getenv("NOOVICHAT_URL", "https://sua-instancia.noovichat.com")
API_TOKEN = os.getenv("NOOVICHAT_API_TOKEN")
ACCOUNT_ID = os.getenv("NOOVICHAT_ACCOUNT_ID", "1")

HEADERS = {
    "api_access_token": API_TOKEN,
    "Content-Type": "application/json",
}


def upsert_contact(
    name: str,
    phone: str,
    email: Optional[str] = None,
    company: Optional[str] = None,
    custom_attributes: Optional[dict] = None,
) -> dict:
    """
    Cria ou atualiza um contato pelo telefone (upsert).
    NooviChat usa phone_number como identificador único.
    """
    # Normalizar telefone BR para E.164
    clean_phone = "".join(filter(str.isdigit, phone))
    if not clean_phone.startswith("55"):
        clean_phone = "55" + clean_phone
    phone_e164 = "+" + clean_phone

    payload = {
        "name": name,
        "phone_number": phone_e164,
    }
    if email:
        payload["email"] = email
    if company:
        payload["company_name"] = company
    if custom_attributes:
        payload["custom_attributes"] = custom_attributes

    response = requests.post(
        f"{NOOVICHAT_URL}/api/v1/accounts/{ACCOUNT_ID}/contacts",
        headers=HEADERS,
        json=payload,
    )

    if response.status_code == 422:
        # Contato já existe — retornar existente
        existing = requests.get(
            f"{NOOVICHAT_URL}/api/v1/accounts/{ACCOUNT_ID}/contacts/search",
            headers=HEADERS,
            params={"q": phone_e164, "include_contacts": "true"},
        )
        existing.raise_for_status()
        results = existing.json().get("payload", [])
        return results[0] if results else {}

    response.raise_for_status()
    return response.json()


def bulk_import_from_csv(csv_path: str, delay_between: float = 0.2) -> dict:
    """
    Importa contatos de um arquivo CSV.

    Formato do CSV:
    name,phone,email,company,cargo,setor

    Args:
        csv_path: Caminho para o arquivo CSV
        delay_between: Delay entre requests (segundos) para não sobrecarregar a API

    Returns:
        dict com contagens de criados, atualizados e erros
    """
    stats = {"created": 0, "updated": 0, "errors": 0}

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            try:
                contact = upsert_contact(
                    name=row["name"],
                    phone=row["phone"],
                    email=row.get("email"),
                    company=row.get("company"),
                    custom_attributes={
                        k: v for k, v in row.items()
                        if k not in ("name", "phone", "email", "company") and v
                    },
                )
                if contact.get("id"):
                    stats["created"] += 1
                else:
                    stats["updated"] += 1

                if (i + 1) % 50 == 0:
                    print(f"Progresso: {i + 1} contatos processados...")

                time.sleep(delay_between)

            except Exception as e:
                stats["errors"] += 1
                print(f"Erro na linha {i + 2}: {row.get('name', '?')} — {e}")

    return stats


if __name__ == "__main__":
    # Exemplo: importar de CSV
    result = bulk_import_from_csv("contatos.csv")
    print(f"\nResultado:")
    print(f"  Criados: {result['created']}")
    print(f"  Atualizados: {result['updated']}")
    print(f"  Erros: {result['errors']}")
