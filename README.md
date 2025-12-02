# yt-subs

A simple web app that downloads YouTube video subtitles, summarizes them using AI, and allows for semantic search.

## Features

*   **Download Subtitles**: Fetch subtitles in TXT, JSON, or VTT formats.
*   **AI Summarization**: Generate concise summaries of videos using Google Gemini.
*   **AI Search**: Ask questions about the video content and get answers based on the transcript.
*   **Metadata**: View video thumbnail, view count, duration, and upload date.

## Tech Stack

*   **Frontend**: React, Vite, CSS Modules
*   **Backend**: Node.js, Express
*   **AI**: Google Gemini (via `@google/generative-ai`)
*   **Core Tool**: `yt-dlp` (wrapped by `youtube-dl-exec`)
*   **Containerization**: Docker

## Prerequisites

*   **Docker** and **Docker Compose** installed on your machine.
*   A **Google Gemini API Key**.

## Installation & Running (Docker)

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd yt-subs
    ```

2.  **Set up Environment Variables**:
    Create a `.env` file in the root directory (or use the one in `server/.env` if running locally without docker, but for docker-compose, you can pass it inline or create a root `.env`).
    
    For Docker Compose, you can create a `.env` file in the root:
    ```
    GEMINI_API_KEY=your_actual_api_key_here
    ```

3.  **Build and Run**:
    ```bash
    docker-compose up --build
    ```

4.  **Access the App**:
    Open your browser and go to `http://localhost:3000`.

## Manual Installation (Ubuntu VPS)

If you prefer to run it without Docker or need to install `yt-dlp` manually on your Ubuntu VPS:

### 1. Install yt-dlp
`yt-dlp` is the engine used to fetch subtitles. It requires Python.

```bash
# Update package list
sudo apt update

# Install Python and ffmpeg
sudo apt install -y python3 python3-pip ffmpeg

# Install yt-dlp binary
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp

# Make it executable
sudo chmod a+rx /usr/local/bin/yt-dlp

# Verify installation
yt-dlp --version
```

### 2. Run the App
```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Build client
cd ../client && npm run build

# Start server
cd ../server
# Make sure .env has your GEMINI_API_KEY
npm start
```

