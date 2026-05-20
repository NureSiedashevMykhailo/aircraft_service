#!/bin/bash

# Docker stop script for Aircraft Monitoring System

set -e

echo "🛑 Stopping Aircraft Monitoring System..."

# Check if running in development or production mode
if [ "$1" == "dev" ]; then
    echo "🔧 Stopping DEVELOPMENT environment..."
    docker-compose -f docker-compose.dev.yml down
else
    echo "🏭 Stopping PRODUCTION environment..."
    docker-compose down
fi

# Option to remove volumes
if [ "$2" == "--volumes" ] || [ "$2" == "-v" ]; then
    echo "🗑️  Removing volumes (database data will be deleted)..."
    if [ "$1" == "dev" ]; then
        docker-compose -f docker-compose.dev.yml down -v
    else
        docker-compose down -v
    fi
    echo "⚠️  All data has been removed!"
fi

echo "✅ Services stopped!"

