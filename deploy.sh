#!/bin/bash

echo "=============================="
echo "🚀 Starting deployment"
echo "=============================="

set -e

PROJECT_DIR="/home/frontend/bongo-shoes-frontend"
cd $PROJECT_DIR

echo "📁 Current directory: $(pwd)"

echo "📥 Pulling latest code from git..."
git pull

echo "🐳 Building & starting containers..."
docker compose up -d --build

echo "📦 Running containers:"
docker compose ps

echo "=============================="
echo "✅ Deployment finished successfully!"
echo "=============================="
