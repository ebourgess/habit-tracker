# Habit Tracker

A full-stack habit tracking application built with Python/FastAPI backend and TypeScript/React frontend, fully containerized with Docker.

## ⚠️ Disclaimer

**This project was built using GitHub Copilot and is for educational and testing purposes only. It is NOT production-ready code and should not be used in a production environment without proper review, testing, and security hardening.**

Key considerations before production use:
- Security vulnerabilities may exist
- Error handling may be incomplete
- Performance optimizations are not implemented
- Database schema and migrations need proper management
- Authentication and authorization are not implemented
- Input validation and sanitization may be insufficient
- Logging and monitoring are not configured
- Backup and recovery procedures are not established

## Features

- ✅ Create and manage habits
- 📅 Track daily progress 
- 📊 View completion statistics and streaks
- 🎯 Beautiful, responsive UI
- 🔄 Real-time updates
- 🐳 Fully containerized with Docker

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database
- **Pydantic**: Data validation using Python type annotations

### Frontend  
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **Axios**: HTTP client
- **Lucide React**: Beautiful icons
- **date-fns**: Date manipulation

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy and static file serving

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop or Docker Engine
- Docker Compose

### 🚀 Run the Application

1. Clone and navigate to the project:
```bash
git clone <your-repo-url>
cd habit-tracker
```

2. Start the application:
```bash
./docker-run.sh
```

Or manually with Docker Compose:
```bash
docker compose up --build -d
```

3. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### 🛠️ Development Mode

For development with hot reloading:
```bash
./docker-run.sh dev
```

Or manually:
```bash
docker compose -f docker-compose.dev.yml up --build
```

### 📊 Other Docker Commands

```bash
# View logs
./docker-run.sh logs

# Stop the application
./docker-run.sh stop

# Clean up Docker resources
./docker-run.sh clean

# Get help
./docker-run.sh help
```

## Manual Setup (Alternative)

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

### Habits
- `GET /habits/` - Get all habits
- `POST /habits/` - Create a new habit
- `PUT /habits/{id}` - Update a habit
- `DELETE /habits/{id}` - Delete a habit
- `GET /habits/{id}/stats` - Get habit statistics

### Habit Entries
- `POST /habit-entries/` - Create a habit entry
- `PUT /habit-entries/{id}` - Update a habit entry
- `GET /habits/{id}/entries` - Get all entries for a habit

## Project Structure

```
habit-tracker/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database models and connection
│   ├── schemas.py           # Pydantic models
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Production Docker image
│   └── .dockerignore        # Docker ignore rules
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── api.ts          # API client
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # App entry point
│   ├── package.json        # Node dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── Dockerfile          # Production Docker image
│   ├── Dockerfile.dev      # Development Docker image
│   ├── nginx.conf          # Nginx configuration
│   └── .dockerignore       # Docker ignore rules
├── docker-compose.yml      # Production compose file
├── docker-compose.dev.yml  # Development compose file
├── docker-run.sh          # Convenient Docker script
└── README.md
```

## Docker Architecture

### Production Mode
- **Frontend**: Built React app served by Nginx with API proxy
- **Backend**: FastAPI server with SQLite database
- **Networking**: Internal Docker network with Nginx reverse proxy

### Development Mode
- **Frontend**: Vite dev server with hot reloading
- **Backend**: FastAPI with auto-reload on code changes
- **Volumes**: Source code mounted for live editing

## Environment Variables

### Backend
- `DATABASE_URL`: SQLite database path (default: `sqlite:///./data/habits.db`)

### Frontend
- `NODE_ENV`: Environment mode (`development` or `production`)

## Development

### Backend Development
- The SQLite database will be created automatically in the `backend/data` directory
- API documentation is available at `http://localhost:8000/docs` when running
- Database persists in Docker volume

### Frontend Development
- Hot module replacement is enabled for fast development
- TypeScript checking happens in real-time
- The frontend proxies API requests to the backend automatically

### Docker Development Tips
- Use `docker compose logs -f [service]` to view specific service logs
- Use `docker compose exec [service] bash` to access service shell
- Database file persists in `./backend/data/` directory

## Deployment

### Production Deployment
1. Set up your server with Docker and Docker Compose
2. Clone the repository
3. Run `./docker-run.sh` or `docker compose up -d`
4. Configure reverse proxy (nginx/traefik) if needed
5. Set up SSL certificates

### Environment-Specific Configuration
- Update `docker-compose.yml` for production settings
- Configure environment variables
- Set up proper networking and security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `./docker-run.sh dev`
5. Submit a pull request

## Troubleshooting

### Common Issues
- **Port conflicts**: Change ports in docker-compose files if needed
- **Permission issues**: Ensure Docker has proper permissions
- **Build failures**: Clear Docker cache with `docker system prune`

### Logs and Debugging
```bash
# View all logs
./docker-run.sh logs

# View specific service logs
docker compose logs backend
docker compose logs frontend

# Access service shell
docker compose exec backend bash
docker compose exec frontend sh
```

## License

MIT License - feel free to use this project for learning and development!
