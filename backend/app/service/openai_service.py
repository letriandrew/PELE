from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

async def generate_text_from_prompt(prompt: str) -> str:
    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": prompt}])
    return response.choices[0].message.content.strip()
