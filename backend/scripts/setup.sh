#!/bin/bash
# ===== FILE: /Users/nabin/TrackU/backend/scripts/setup.sh =====

echo "🚀 Setting up TrackU Backend..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Create uploads directory
mkdir -p uploads

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up database
echo "🗃️  Setting up database..."
docker-compose up -d db redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations (if you have them)
# echo "🔄 Running database migrations..."
# npm run db:migrate

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update your .env file with proper configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. The API will be available at http://localhost:8000"
echo ""
echo "📚 Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run start        - Start production server"
echo "  npm test             - Run tests"
echo ""