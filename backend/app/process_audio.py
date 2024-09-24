from fastapi import File, UploadFile
from pydub import AudioSegment
import openai 
from app.config import settings
import io


async def process_audio_file(file: UploadFile = File(...)):
    # Read the uploaded file into memory
    contents = await file.read()

    # Convert the audio to a WAV format using pydub
    audio = AudioSegment.from_file(io.BytesIO(contents), format="webm")
    wav_io = io.BytesIO()
    audio.export(wav_io, format="wav")

    # Ensure the buffer is reset before sending to Whisper API
    wav_io.seek(0)

    # Use OpenAI Whisper (or another speech-to-text API) to convert to text
    transcription = openai.audio.transcriptions.create(
        model="whisper-1",
        file=wav_io
    )

    return transcription