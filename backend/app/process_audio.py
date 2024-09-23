from fastapi import File, UploadFile
from pydub import AudioSegment
from openai import OpenAI
import io

async def process_audio(file: UploadFile = File(...)):
    # Read the uploaded file into memory
    contents = await file.read()
    
    # Convert the audio to a WAV format using pydub
    audio = AudioSegment.from_file(io.BytesIO(contents), format="webm")
    wav_io = io.BytesIO()
    audio.export(wav_io, format="wav")
    
    # Use OpenAI Whisper (or another speech-to-text API) to convert to text
    # You can use whisper from openai's API
    client = OpenAI()
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=wav_io
    )
    
    return transcription