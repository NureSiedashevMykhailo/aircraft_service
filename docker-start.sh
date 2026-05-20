#!/bin/bash

# Docker startup script for Aircraft Monitoring System

set -e

echo "🚀 Starting Aircraft Monitoring System with Docker..."

# Check if .docker.env exists
if [ ! -f .docker.env ]; then
    echo "📝 Creating .docker.env from example..."
    cp .docker.env.example .docker.env
    echo "✅ Created .docker.env - you can edit it if needed"
fi

# Check if running in development or production mode
if [ "$1" == "dev" ]; then
    echo "🔧 Starting in DEVELOPMENT mode..."
    docker-compose -f docker-compose.dev.yml up -d --build
    echo ""
    echo "✅ Services started!"
    echo "📊 API: http://localhost:3000/api"
    echo "📚 Swagger: http://localhost:3000/api/docs"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo ""
    echo "View logs: docker-compose -f docker-compose.dev.yml logs -f"
else
    echo "🏭 Starting in PRODUCTION mode..."
    docker-compose up -d --build
    echo ""
    echo "✅ Services started!"
    echo "📊 API: http://localhost:3000/api"
    echo "📚 Swagger: http://localhost:3000/api/docs"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo ""
    echo "View logs: docker-compose logs -f"
fi

