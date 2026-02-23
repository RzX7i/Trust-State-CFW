#!/bin/bash

echo "🚀 Trust State Deployment Script"
echo "================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with:"
    echo "  DISCORD_BOT_TOKEN=your_token"
    echo "  DISCORD_GUILD_ID=1385245747867422781"
    echo "  ADMIN_ROLE_ID=your_role_id"
    exit 1
fi

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo "📥 Pulling latest changes..."
    git pull
fi

# Build and start with Docker
echo "🐳 Building Docker image..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check if running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Trust State is running on port 3000!"
    echo "🌐 Access: http://your-server-ip:3000"
else
    echo "❌ Failed to start. Check logs: docker-compose logs"
fi
