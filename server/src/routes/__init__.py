from flask import Blueprint
from .youtube import youtube_bp
from .ai import ai_bp


def register_routes(app):
    """Register all API routes with the Flask app"""
    app.register_blueprint(youtube_bp, url_prefix='/api')
    app.register_blueprint(ai_bp, url_prefix='/api')
