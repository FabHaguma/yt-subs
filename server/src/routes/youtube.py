from flask import Blueprint, request, jsonify
import traceback
from src.services.youtube import get_metadata, get_subtitles

youtube_bp = Blueprint('youtube', __name__)


@youtube_bp.route('/metadata', methods=['POST'])
def metadata():
    """
    POST /api/metadata
    Fetch video metadata from YouTube
    """
    try:
        data = request.get_json()
        url = data.get('url') if data else None
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        print(f'Fetching metadata for URL: {url}')
        metadata = get_metadata(url)
        return jsonify(metadata)
    except Exception as e:
        error_msg = f'Error fetching metadata: {str(e)}'
        print(error_msg)
        print(traceback.format_exc())
        return jsonify({'error': error_msg}), 500


@youtube_bp.route('/subtitles', methods=['POST'])
def subtitles():
    """
    POST /api/subtitles
    Fetch subtitles from YouTube video
    """
    try:
        data = request.get_json()
        url = data.get('url') if data else None
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        print(f'Fetching subtitles for URL: {url}')
        subtitles = get_subtitles(url)
        return jsonify(subtitles)
    except Exception as e:
        error_msg = f'Error fetching subtitles: {str(e)}'
        print(error_msg)
        print(traceback.format_exc())
        return jsonify({'error': error_msg}), 500
