FROM python:3.12-slim-bookworm

# Install ffmpeg (dependency for yt-dlp)
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements file
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create temp directory
RUN mkdir -p temp

# Expose port
EXPOSE 3000

# Start server with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:3000", "--workers", "2", "app:app"]
