import os
import glob
import time
import json
from yt_dlp import YoutubeDL
from src.utils.helpers import (
    ensure_temp_dir,
    parse_vtt,
    cleanup_temp_file,
    TEMP_DIR,
    extract_video_id,
    get_youtube_url
)


def get_metadata(input_url: str) -> dict:
    """
    Fetch video metadata from YouTube
    
    Args:
        input_url: YouTube video URL or video ID
        
    Returns:
        dict: Video metadata
    """
    try:
        video_id = extract_video_id(input_url)
        url = get_youtube_url(video_id)
        print(f'Extracted video ID: {video_id}')
        print(f'YouTube URL: {url}')
        
        # Use yt-dlp Python API to get metadata
        ydl_opts = {
            'quiet': False,
            'no_warnings': False,
            'socket_timeout': 30,
        }
        
        with YoutubeDL(ydl_opts) as ydl:
            print('Extracting info...')
            info = ydl.extract_info(url, download=False)
        
        result = {
            'title': info.get('title'),
            'channel': info.get('uploader'),
            'uploadDate': info.get('upload_date'),
            'viewCount': info.get('view_count'),
            'duration': info.get('duration'),
            'thumbnail': info.get('thumbnail'),
            'id': info.get('id')
        }
        print(f'Metadata retrieved: {result}')
        return result
    except Exception as e:
        print(f'Exception in get_metadata: {e}')
        import traceback
        traceback.print_exc()
        raise


def get_subtitles(input_url: str) -> dict:
    """
    Fetch subtitles from YouTube video
    
    Args:
        input_url: YouTube video URL or video ID
        
    Returns:
        dict: Raw and parsed subtitles
    """
    try:
        video_id = extract_video_id(input_url)
        url = get_youtube_url(video_id)
        print(f'Extracted video ID: {video_id}')
        print(f'YouTube URL: {url}')
        
        temp_dir = ensure_temp_dir()
        timestamp = int(time.time() * 1000)
        output_template = os.path.join(temp_dir, f'{timestamp}.%(ext)s')
        print(f'Using temp dir: {temp_dir}')
        print(f'Output template: {output_template}')
        
        # Use yt-dlp Python API to download subtitles
        ydl_opts = {
            'quiet': False,
            'no_warnings': False,
            'skip_download': True,
            'writeautosub': True,
            'writesubtitles': True,
            'subtitleslangs': ['en'],
            'subtitlesformat': 'vtt',
            'outtmpl': output_template,
            'socket_timeout': 30,
        }
        
        print('Downloading subtitles...')
        with YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=False)
        
        # Find the generated file
        pattern = os.path.join(temp_dir, f'{timestamp}*.vtt')
        print(f'Looking for files matching pattern: {pattern}')
        files = glob.glob(pattern)
        print(f'Found files: {files}')
        
        if not files:
            raise Exception('No English subtitles found')
        
        sub_file = files[0]
        print(f'Using subtitle file: {sub_file}')
        
        with open(sub_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Cleanup temp file
        cleanup_temp_file(os.path.basename(sub_file))
        
        # Parse VTT content
        subtitles = parse_vtt(content)
        print(f'Parsed {len(subtitles)} subtitle entries')
        
        return {'raw': content, 'parsed': subtitles}
    except Exception as e:
        print(f'Exception in get_subtitles: {e}')
        import traceback
        traceback.print_exc()
        raise
