from flask import Blueprint, request, jsonify
from src.services.gemini import summarize, search

ai_bp = Blueprint('ai', __name__)


@ai_bp.route('/summarize', methods=['POST'])
def summarize_endpoint():
    """
    POST /api/summarize
    Generate a summary of video transcript
    """
    data = request.get_json()
    text = data.get('text') if data else None
    
    if not text:
        return jsonify({'error': 'Text is required'}), 400
    
    try:
        summary = summarize(text)
        return jsonify({'summary': summary})
    except Exception as e:
        print(f'Error summarizing: {e}')
        return jsonify({'error': 'Failed to generate summary'}), 500


@ai_bp.route('/search', methods=['POST'])
def search_endpoint():
    """
    POST /api/search
    Answer a question based on video transcript
    """
    data = request.get_json()
    text = data.get('text') if data else None
    query = data.get('query') if data else None
    
    if not text or not query:
        return jsonify({'error': 'Text and query are required'}), 400
    
    try:
        answer = search(text, query)
        return jsonify({'answer': answer})
    except Exception as e:
        print(f'Error searching: {e}')
        return jsonify({'error': 'Failed to search content'}), 500
