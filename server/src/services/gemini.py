import google.generativeai as genai
from src.config import Config

# Initialize Gemini
genai.configure(api_key=Config.GEMINI_API_KEY)

# Max characters to send to Gemini (to stay within token limits)
MAX_CHARS = 30000
MODEL_NAME = 'gemini-2.0-flash'


def summarize(text: str) -> str:
    """
    Generate a summary of the video transcript
    
    Args:
        text: Video transcript text
        
    Returns:
        str: Generated summary
    """
    model = genai.GenerativeModel(MODEL_NAME)
    prompt = f'Summarize the following YouTube video transcript in a concise manner, highlighting key points:\n\n{text[:MAX_CHARS]}'
    
    response = model.generate_content(prompt)
    return response.text


def search(text: str, query: str) -> str:
    """
    Answer a question based on the video transcript
    
    Args:
        text: Video transcript text
        query: User's question
        
    Returns:
        str: Generated answer
    """
    model = genai.GenerativeModel(MODEL_NAME)
    prompt = f'Based on the following video transcript, answer the user\'s question.\n\nTranscript:\n{text[:MAX_CHARS]}\n\nQuestion: {query}'
    
    response = model.generate_content(prompt)
    return response.text
