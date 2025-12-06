import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration"""
    PORT = int(os.getenv('PORT', 3000))
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
