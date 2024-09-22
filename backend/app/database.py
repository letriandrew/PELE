from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from urllib.parse import quote_plus

client = None

async def connect_to_mongo():
    # URL-encode username and password if present
    username = quote_plus(settings.mongo_url.split(":")[1])  # Assuming format: mongodb://username:password@...
    password = quote_plus(settings.mongo_url.split(":")[2].split("@")[0])  # Extract password from URI
    database = settings.mongo_url.split("/")[3]  # Extract database name
    
    # Construct the new URI
    encoded_url = f"mongodb://{username}:{password}@{settings.mongo_url.split('@')[1]}"
    

    global client
    client = AsyncIOMotorClient(encoded_url)  # Add your MongoDB URI to the config
    print("Connected to MongoDB")

async def disconnect_from_mongo():
    global client
    client.close()
    print("Disconnected from MongoDB")

# Optionally, create a function to get the database
def get_database():
    return client.mydatabase  # Replace 'mydatabase' with your actual database name
