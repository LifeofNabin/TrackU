# ===== FILE: /Users/nabin/TrackU/backend/Makefile =====
.PHONY: install dev start test build clean deploy setup help

# Install dependencies
install:
	npm install
	chmod +x scripts/*.sh

# Development server
dev:
	npm run dev

# Production server
start:
	npm start

# Run tests
test:
	npm test

# Build Docker image
build:
	docker build -t tracku-backend .

# Clean up
clean:
	docker-compose down
	docker system prune -f

# Setup project
setup:
	./scripts/setup.sh

# Docker operations
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f backend

# Help
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make setup      - Set up the project"
	@echo "  make dev        - Start development server"
	@echo "  make start      - Start production server"
	@echo "  make test       - Run tests"
	@echo "  make build      - Build Docker image"
	@echo "  make clean      - Clean up Docker containers"
	@echo "  make docker-up  - Start Docker containers"
	@echo "  make docker-down - Stop Docker containers"