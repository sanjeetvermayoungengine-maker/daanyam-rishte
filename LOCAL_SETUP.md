# Biodata App - Local Development Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Docker Desktop** (includes Docker Engine and Docker Compose)
  - [Download for Mac](https://www.docker.com/products/docker-desktop)
  - [Download for Windows](https://www.docker.com/products/docker-desktop)
  - [Download for Linux](https://docs.docker.com/engine/install/)
- **Git**
- **Node.js 18+** (optional, but helpful for local development without Docker)

## Quick Start (Docker)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/biodata-app.git
cd biodata-app
```

### 2. Start all services with Docker Compose

```bash
docker-compose up
```

This will start:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 3. Initialize the database

In a new terminal, run migrations:

```bash
docker-compose exec backend npm run migrate
```

### 4. Test the setup

Open your browser and navigate to:

- Frontend: [http://localhost:5173](http://localhost:5173)
- API Health: [http://localhost:3000/api/health](http://localhost:3000/api/health)

You should see the app login screen.

## Service Details

### Frontend (React + Vite)

- **URL**: [http://localhost:5173](http://localhost:5173)
- **Technology**: React 18+, TypeScript, Tailwind CSS
- **Port**: 5173
- **Dev Mode**: Hot reload enabled
- **Build Command**: `npm run build`

### Backend (Node.js + Express)

- **URL**: [http://localhost:3000](http://localhost:3000)
- **Technology**: Node.js 18+, Express, TypeScript
- **Port**: 3000
- **Dev Mode**: Nodemon enabled (auto-restart on file changes)
- **Build Command**: `npm run build`

### PostgreSQL

- **Host**: localhost
- **Port**: 5432
- **Username**: biodata_user
- **Password**: biodata_password
- **Database**: biodata_db
- **Data Persistence**: Docker volume `postgres_data`

### Redis

- **Host**: localhost
- **Port**: 6379
- **Data Persistence**: Docker volume `redis_data`

## Common Commands

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop all services

```bash
docker-compose down
```

### Stop and remove all data

```bash
docker-compose down -v
```

### Rebuild containers

```bash
docker-compose up --build
```

### Run backend migrations

```bash
docker-compose exec backend npm run migrate
```

### Access database with psql

```bash
docker-compose exec postgres psql -U biodata_user -d biodata_db
```

### Access Redis CLI

```bash
docker-compose exec redis redis-cli
```

## Troubleshooting

### Port conflicts

If port 5173, 3000, 5432, or 6379 is already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "5173:5173"  # Change first number to a different port
```

### Database connection errors

1. Wait 10-15 seconds for PostgreSQL to start (health checks help)
2. Check logs: `docker-compose logs postgres`
3. Verify network: `docker network ls`

### Node modules issues

```bash
# Rebuild node_modules
docker-compose down -v
docker-compose up --build
```

### Frontend doesn't load

1. Check if Vite is running: `docker-compose logs frontend`
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart frontend: `docker-compose restart frontend`

## Local Development Without Docker

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with local database credentials
npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
DATABASE_URL=postgresql://biodata_user:biodata_password@localhost:5432/biodata_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
PORT=3000
AWS_S3_BUCKET=your-s3-bucket
AWS_REGION=us-east-1
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

## Database Schema

The database includes these tables:

- **users**: User accounts
- **biodatas**: Biodata records
- **family_info**: Family information
- **horoscope**: Horoscope/astrological data
- **photos**: Photo storage references
- **shares**: Sharing and privacy controls
- **audit_logs**: Activity logs

Migrations are in `backend/migrations/`. Run them with:

```bash
docker-compose exec backend npm run migrate
```

## Testing

### Run backend tests

```bash
docker-compose exec backend npm run test
```

### Run frontend tests

```bash
docker-compose exec frontend npm run test
```

### Run e2e tests

```bash
docker-compose exec frontend npm run test:e2e
```

## Debugging

### Backend debugging with Node Inspector

```bash
docker-compose exec backend node --inspect=0.0.0.0:9229 dist/index.js
```

Then open `chrome://inspect` in Chrome.

### Frontend debugging

Open browser DevTools (F12) - Vite supports source maps by default.

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push and create pull request
git push origin feature/your-feature-name
```

## Next Steps

1. Read the **Engineering Plan** document for architecture details
2. Check out the **API Documentation** in `backend/README.md`
3. Review the **Component Library** in `frontend/COMPONENTS.md`
4. Join the team Slack/Discord for daily standups

## Need Help?

- **Architecture Questions**: Ask the Tech Lead
- **Frontend Issues**: Ask the Frontend Engineer
- **Backend/Database Issues**: Ask the Backend Engineer
- **DevOps/Deployment**: Ask the DevOps Engineer

Happy coding! 🚀