# 🐳 Docker Quick Start Guide

## Getting Started

### 1. Prerequisites
- Docker Desktop installed and running
- Git (to clone the repository)

### 2. Quick Start (Recommended)

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd habit-tracker

# Start the application
./docker-run.sh

# Or use make
make run
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Documentation**: http://localhost:8000/docs

### 3. Alternative Commands

```bash
# Using Docker Compose directly
docker compose up --build -d

# View logs
docker compose logs -f

# Stop the application
docker compose down
```

## Development Mode

For development with hot reloading:

```bash
# Using the script
./docker-run.sh dev

# Using make
make dev

# Using Docker Compose directly
docker compose -f docker-compose.dev.yml up --build
```

In development mode:
- **Frontend**: http://localhost:5173 (with hot reloading)
- **Backend**: http://localhost:8000 (with auto-reload)

## Common Commands

```bash
# Start production mode
./docker-run.sh run
make run

# Start development mode  
./docker-run.sh dev
make dev

# View logs
./docker-run.sh logs
make logs

# Stop the application
./docker-run.sh stop
make stop

# Clean up Docker resources
./docker-run.sh clean
make clean

# Get help
./docker-run.sh help
make help
```

## Troubleshooting

### Port Conflicts
If ports 3000 or 8000 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:80"    # Change frontend port to 3001
  - "8001:8000"  # Change backend port to 8001
```

### Viewing Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Accessing Service Shells
```bash
# Backend shell
docker compose exec backend bash

# Frontend shell  
docker compose exec frontend sh
```

### Database Location
The SQLite database is stored in `./backend/data/habits.db` and persists between container restarts.

### Complete Reset
```bash
# Stop and remove everything
docker compose down -v --rmi local
./docker-run.sh clean

# Remove database (optional)
rm -rf backend/data/
```

## Project Structure
```
habit-tracker/
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml      # Development setup  
├── docker-run.sh              # Convenience script
├── Makefile                   # Make commands
├── backend/
│   ├── Dockerfile             # Backend container
│   └── data/                  # Database storage
└── frontend/
    ├── Dockerfile             # Frontend production container
    └── Dockerfile.dev         # Frontend development container
```

## Next Steps

1. **Customize the application**: Edit the source code in `backend/` and `frontend/` directories
2. **Add features**: The codebase is well-structured for adding new functionality
3. **Deploy**: Use the production Docker setup for deployment to any Docker-compatible platform
4. **Scale**: Add load balancers, multiple instances, or migrate to orchestration platforms like Kubernetes

Happy habit tracking! 🎯
