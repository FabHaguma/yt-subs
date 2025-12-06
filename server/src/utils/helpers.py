import os
import re
from urllib.parse import urlparse, parse_qs

TEMP_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'temp')


def ensure_temp_dir() -> str:
    """Ensure temp directory exists"""
    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR, exist_ok=True)
    return TEMP_DIR


def cleanup_temp_file(filename: str) -> None:
    """
    Clean up a temp file
    
    Args:
        filename: Name of the file to remove
    """
    filepath = os.path.join(TEMP_DIR, filename)
    if os.path.exists(filepath):
        os.unlink(filepath)


def extract_video_id(input_str: str) -> str:
    """
    Extract YouTube video ID from various URL formats
    
    Supports:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://www.youtube.com/watch?v=VIDEO_ID&list=...
    - https://www.youtube.com/watch?v=VIDEO_ID&pp=...
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - https://www.youtube.com/v/VIDEO_ID
    - Just the VIDEO_ID itself
    
    Args:
        input_str: YouTube URL or video ID
        
    Returns:
        str: Video ID
        
    Raises:
        ValueError: If video ID cannot be extracted
    """
    if not input_str:
        raise ValueError('URL or video ID is required')
    
    # Trim whitespace
    input_str = input_str.strip()
    
    # If it's already just a video ID (11 characters, alphanumeric with - and _)
    video_id_regex = re.compile(r'^[a-zA-Z0-9_-]{11}$')
    if video_id_regex.match(input_str):
        return input_str
    
    # Try to parse as URL
    try:
        parsed = urlparse(input_str)
        
        # Handle youtube.com/watch?v=VIDEO_ID
        if 'youtube.com' in parsed.hostname or 'youtube' in (parsed.hostname or ''):
            query_params = parse_qs(parsed.query)
            video_id = query_params.get('v', [None])[0]
            if video_id and video_id_regex.match(video_id):
                return video_id
            
            # Handle youtube.com/embed/VIDEO_ID or youtube.com/v/VIDEO_ID
            path_match = re.match(r'^/(embed|v)/([a-zA-Z0-9_-]{11})', parsed.path)
            if path_match:
                return path_match.group(2)
        
        # Handle youtu.be/VIDEO_ID
        if parsed.hostname == 'youtu.be':
            video_id = parsed.path[1:].split('?')[0]
            if video_id_regex.match(video_id):
                return video_id
    except Exception:
        pass
    
    # Fallback: try to extract video ID using regex patterns
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})',
        r'^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, input_str)
        if match and match.group(1) and len(match.group(1)) == 11:
            return match.group(1)
    
    raise ValueError('Could not extract video ID from the provided input')


def get_youtube_url(video_id: str) -> str:
    """
    Get a clean YouTube URL from video ID
    
    Args:
        video_id: YouTube video ID
        
    Returns:
        str: Clean YouTube URL
    """
    return f'https://www.youtube.com/watch?v={video_id}'


def parse_vtt(content: str) -> list:
    """
    Parse VTT content to extract subtitles
    
    Args:
        content: VTT file content
        
    Returns:
        list: Parsed subtitles with start, end, and text
    """
    lines = content.split('\n')
    subtitles = []
    current_sub = {}
    
    time_regex = re.compile(r'(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})')
    
    for line in lines:
        line = line.strip()
        if line == 'WEBVTT':
            continue
        if line == '':
            continue
        
        time_match = time_regex.match(line)
        if time_match:
            if current_sub.get('text'):
                subtitles.append(current_sub)
            current_sub = {
                'start': time_match.group(1),
                'end': time_match.group(2),
                'text': ''
            }
        elif current_sub.get('start'):
            # Remove formatting tags like <c> or <00:00:00>
            clean_text = re.sub(r'<[^>]*>', '', line)
            if current_sub.get('text'):
                current_sub['text'] = current_sub['text'] + ' ' + clean_text
            else:
                current_sub['text'] = clean_text
    
    if current_sub.get('text'):
        subtitles.append(current_sub)
    
    return subtitles
