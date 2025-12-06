import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from src.config import Config
from src.routes import register_routes

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../client/dist', static_url_path='')

# Configure CORS
CORS(app)

# Set max content length (10MB)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# Register API routes
register_routes(app)

# Serve static files from the React client (for production)
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Catch-all handler for client-side routing
@app.route('/<path:path>')
def catch_all(path):
    # Try to serve the file directly
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Otherwise, serve index.html for client-side routing
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=True)
