FROM node:20-bullseye-slim

# Install Python and ffmpeg (dependencies for yt-dlp)
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 ffmpeg curl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create temp directory
RUN mkdir -p temp

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "index.js"]
