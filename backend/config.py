import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    DEBUG = os.getenv("DEBUG", "False") == "True"

    # MongoDB configurations
    MONGO_URI = os.getenv("MONGO_URI")
