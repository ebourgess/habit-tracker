.PHONY: help build run dev stop logs clean

# Default target
help:
	@echo "Habit Tracker - Docker Commands"
	@echo "================================"
	@echo ""
	@echo "Available commands:"
	@echo "  make run      - Start the application in production mode"
	@echo "  make dev      - Start the application in development mode"
	@echo "  make build    - Build Docker images"
	@echo "  make stop     - Stop the application"
	@echo "  make logs     - Show application logs"
	@echo "  make clean    - Clean up Docker resources"
	@echo ""

# Build Docker images
build:
	docker compose build

# Run in production mode
run:
	docker compose up --build -d
	@echo ""
	@echo "🎉 Habit Tracker is running!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend API: http://localhost:8000"
	@echo "   API Docs: http://localhost:8000/docs"

# Run in development mode
dev:
	docker compose -f docker-compose.dev.yml up --build

# Stop the application
stop:
	docker compose down
	docker compose -f docker-compose.dev.yml down 2>/dev/null || true

# Show logs
logs:
	docker compose logs -f

# Clean up Docker resources
clean:
	docker compose down -v --rmi local
	docker compose -f docker-compose.dev.yml down -v --rmi local 2>/dev/null || true
	docker system prune -f
