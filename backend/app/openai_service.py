import openai
from app.config import settings

async def generate_text_from_prompt(prompt: str) -> str:
    openai.api_key = settings.openai_api_key
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()
