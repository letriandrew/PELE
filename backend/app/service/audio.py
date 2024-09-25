from fastapi import File, UploadFile
from openai import OpenAI
from app.config import settings
import io


async def process_audio_file(audio: UploadFile = File(...)) -> str:
    # Save or process the file
    audio_content = await audio.read()  # Read the content of the uploaded file

    if not audio_content:
            raise ValueError("Empty file or invalid content")

    buffer = io.BytesIO(audio_content)

    buffer.name = "test.mp3"

    client = OpenAI()
    client.api_key = settings.openai_api_key

    transcription =  client.audio.transcriptions.create(
        model="whisper-1",
        file=buffer,
    )
    return transcription
