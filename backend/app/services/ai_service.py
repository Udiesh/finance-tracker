from groq import Groq
from app.config import GROQ_API_KEY
from datetime import date, timedelta
import json

client = Groq(api_key=GROQ_API_KEY)


def parse_transaction_text(text: str, categories: list[str]) -> dict:
    """
    Takes natural language like "spent 500 on groceries yesterday"
    and returns structured transaction data.
    
    We pass the user's existing categories so the AI can 
    match to one of them instead of inventing new ones.
    """
    today = date.today().isoformat()

    prompt = f"""You are a financial transaction parser. 
    
Today's date is {today}.

The user said: "{text}"

Available categories: {', '.join(categories) if categories else 'Food, Transport, Shopping, Salary, Entertainment, Bills, Health, Other'}

Extract the following and return ONLY valid JSON, no other text:
{{
    "amount": <number>,
    "description": "<short description>",
    "category": "<best matching category from the list>",
    "date": "<YYYY-MM-DD format>",
    "type": "<income or expense>"
}}

Rules:
- If user says "yesterday", calculate the actual date from today
- If user says "today", use today's date
- If no date mentioned, use today's date
- If user says "earned", "received", "salary", "got paid" — it's income
- Otherwise assume expense
- Pick the closest matching category from the available list
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a JSON-only response bot. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,  # Low temperature = more predictable output
            max_tokens=200
        )

        result_text = response.choices[0].message.content.strip()

        # Clean up in case LLM wraps JSON in markdown backticks
        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
            result_text = result_text.strip()

        return json.loads(result_text)

    except Exception as e:
        return {"error": str(e)}