#!/bin/bash

# Habit Tracker Docker Setup and Run Script

set -e

echo "🐳 Habit Tracker Docker Setup"
echo "=============================="

# Function to check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        echo "   Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi

    echo "✅ Docker is installed and running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
    elif command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
    else
        echo "❌ Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
    echo "✅ Docker Compose is available"
}

# Function to create data directory
create_data_dir() {
    mkdir -p backend/data
    echo "✅ Created data directory for database"
}

# Function to run the application
run_app() {
    local mode=${1:-prod}
    
    if [ "$mode" = "dev" ]; then
        echo "🚀 Starting Habit Tracker in development mode..."
        $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml up --build
    else
        echo "🚀 Starting Habit Tracker in production mode..."
        $DOCKER_COMPOSE_CMD up --build -d
        echo ""
        echo "🎉 Habit Tracker is running!"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend API: http://localhost:8000"
        echo "   API Docs: http://localhost:8000/docs"
        echo ""
        echo "To view logs: $DOCKER_COMPOSE_CMD logs -f"
        echo "To stop: $DOCKER_COMPOSE_CMD down"
    fi
}

# Function to stop the application
stop_app() {
    echo "🛑 Stopping Habit Tracker..."
    $DOCKER_COMPOSE_CMD down
    $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml down 2>/dev/null || true
    echo "✅ Habit Tracker stopped"
}

# Function to show logs
show_logs() {
    $DOCKER_COMPOSE_CMD logs -f
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    $DOCKER_COMPOSE_CMD down -v --rmi local
    $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml down -v --rmi local 2>/dev/null || true
    docker system prune -f
    echo "✅ Cleanup complete"
}

# Main script logic
case "${1:-run}" in
    "run"|"start")
        check_docker
        check_docker_compose
        create_data_dir
        run_app "prod"
        ;;
    "dev"|"development")
        check_docker
        check_docker_compose
        create_data_dir
        run_app "dev"
        ;;
    "stop")
        check_docker_compose
        stop_app
        ;;
    "logs")
        check_docker_compose
        show_logs
        ;;
    "clean"|"cleanup")
        check_docker_compose
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "Habit Tracker Docker Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  run, start     Start the application in production mode (default)"
        echo "  dev            Start the application in development mode"
        echo "  stop           Stop the application"
        echo "  logs           Show application logs"
        echo "  clean          Clean up Docker resources"
        echo "  help           Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0              # Start in production mode"
        echo "  $0 dev          # Start in development mode"
        echo "  $0 stop         # Stop the application"
        echo "  $0 logs         # View logs"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
