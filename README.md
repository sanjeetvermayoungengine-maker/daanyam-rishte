# 🎯 Biodata App - Engineering Documentation

A matrimonial biodata platform for creating, sharing, and managing matrimonial profiles with complete privacy controls.

## 📋 Quick Navigation

- **[Engineering Plan](./Biodata_App_Engineering_Plan.docx)** - Architecture, tech stack, database design, security
- **[Local Setup Guide](./LOCAL_SETUP.md)** - Get started in 5 minutes with Docker
- **[Task Breakdown](./TASK_BREAKDOWN.md)** - Detailed sprint planning and work items
- **[docker-compose.yml](./docker-compose.yml)** - Local development environment

## 🚀 Quick Start (Docker)

```bash
# Clone and start
git clone <this-repo>
cd biodata-app
docker-compose up

# Open in browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

That's it! All services will start automatically:
- ✅ React frontend (Vite)
- ✅ Node.js backend (Express)
- ✅ PostgreSQL database
- ✅ Redis cache

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for troubleshooting and detailed commands.

## 📁 Project Structure

```
biodata-app/
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux state management
│   │   └── utils/           # Helper functions
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.ts
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── db/              # Database connection
│   │   └── migrations/      # Database migrations
│   ├── package.json
│   ├── Dockerfile
│   └── tsconfig.json
├── docker-compose.yml       # Local development orchestration
├── LOCAL_SETUP.md           # Development setup guide
├── TASK_BREAKDOWN.md        # Sprint planning & tasks
├── Biodata_App_Engineering_Plan.docx  # Architecture document
└── README.md                # This file
```

## 🏗️ System Architecture

```
Client (React SPA)
    ↓
API Gateway / Express
    ↓
PostgreSQL Database + Redis Cache
    ↓
AWS S3 (Photos)
```

**Tech Stack:**
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Redux
- **Backend**: Node.js 18+, Express, TypeScript
- **Database**: PostgreSQL 14
- **Cache**: Redis
- **Storage**: AWS S3
- **DevOps**: Docker, GitHub Actions, AWS

## 📅 Timeline (3-6 months)

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | Weeks 1-3 | Setup, authentication, user accounts |
| Phase 2 | Weeks 4-8 | Biodata creation, forms, photo upload |
| Phase 3 | Weeks 9-12 | Sharing, privacy controls, public viewer |
| Phase 4 | Weeks 13-18 | Testing, security audit, deployment |

See [TASK_BREAKDOWN.md](./TASK_BREAKDOWN.md) for detailed sprint planning.

## 👥 Team Structure (4-5 people)

- **Tech Lead** (1): Architecture, code reviews, critical path
- **Frontend Engineer** (1.5): React components, UI/UX, responsive design
- **Backend Engineer** (1.5): APIs, database, integrations, security
- **DevOps/QA** (1): Docker, AWS, testing, monitoring

## 📚 Documentation

### For Developers
- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - How to run locally, troubleshoot
- **[TASK_BREAKDOWN.md](./TASK_BREAKDOWN.md)** - What to build, sprint planning
- **[API.md](./backend/API.md)** - REST API specification (to be created)

### For Architects
- **[Biodata_App_Engineering_Plan.docx](./Biodata_App_Engineering_Plan.docx)** - Architecture, design decisions, database schema
- **[Database Schema](./backend/migrations/)** - SQL migrations

### For DevOps
- **[docker-compose.yml](./docker-compose.yml)** - Local setup
- **[.github/workflows/](../.github/workflows/)** - CI/CD pipeline
- **[AWS Setup Guide](./docs/AWS_SETUP.md)** (to be created)

## 🔐 Security & Privacy

✅ HTTPS only  
✅ JWT with httpOnly cookies  
✅ Password hashing (bcrypt, 12 salt rounds)  
✅ Role-based access control (RBAC)  
✅ Input validation & sanitization  
✅ Rate limiting on auth endpoints  
✅ Privacy-controlled sharing  
✅ Audit logging for sensitive operations  

See [Biodata_App_Engineering_Plan.docx](./Biodata_App_Engineering_Plan.docx) section 8 for details.

## 🧪 Testing

```bash
# Backend tests
docker-compose exec backend npm run test

# Frontend tests
docker-compose exec frontend npm run test

# E2E tests
docker-compose exec frontend npm run test:e2e
```

Target: >80% coverage for critical paths (auth, sharing, privacy)

## 🚢 Deployment

### Staging
```bash
git push origin feature-branch
# Automatic CI/CD runs tests, builds Docker images
# Deploy to AWS staging on PR approval
```

### Production
```bash
git merge to main
# Automatic deployment to production
# Blue-green deployment with rollback capability
```

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) section "Deployment" for full instructions.

## 📈 Key Features (MVP)

### Phase 1: Authentication
- User registration & login
- JWT-based sessions
- Password reset

### Phase 2: Biodata Creation
- Multi-step form (7 screens)
- Personal details, education, family, horoscope
- Photo upload to AWS S3
- Template selection

### Phase 3: Sharing & Privacy
- Share biodata via email or link
- Permission control (who can view what)
- Public viewer for anonymous access
- Activity logging

### Phase 4: Deployment
- Full test coverage
- Security audit
- Production deployment
- Monitoring & alerts

## 🐛 Common Issues & Solutions

### Port conflicts
If `localhost:5173`, `3000`, `5432`, or `6379` is already in use:
```bash
# Modify docker-compose.yml
# Change "5173:5173" to "5174:5173" etc.
```

### Database connection errors
```bash
# Wait for PostgreSQL to start
docker-compose logs postgres

# Verify network
docker network ls
```

### Node modules issues
```bash
docker-compose down -v
docker-compose up --build
```

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for more troubleshooting.

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push and create PR: `git push origin feature/your-feature`
4. Require 2 approvals before merging to main

## 📞 Support

- **Architecture questions**: Tech Lead
- **Frontend help**: Frontend Engineer
- **Backend/database**: Backend Engineer
- **DevOps/deployment**: DevOps Engineer

## 📄 License

[Your License Here]

---

## 🎯 Next Steps

1. **Week 1**: Read [Biodata_App_Engineering_Plan.docx](./Biodata_App_Engineering_Plan.docx) and [TASK_BREAKDOWN.md](./TASK_BREAKDOWN.md)
2. **Week 1**: Set up local environment using [LOCAL_SETUP.md](./LOCAL_SETUP.md)
3. **Week 2**: Start Phase 1 tasks (auth & setup)
4. **Weekly**: Standups on Mon/Wed/Fri at 10 AM

**Let's build something great! 🚀**
