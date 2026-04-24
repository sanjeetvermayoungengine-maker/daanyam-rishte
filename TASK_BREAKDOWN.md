# Biodata App - Task Breakdown & Sprint Planning

## Overview

This document breaks down all engineering work into sprints and tasks. Each task has clear acceptance criteria and a team owner.

---

## Phase 1: Setup & Authentication (Weeks 1-3)

### Sprint 1.1: Infrastructure & Project Setup (Week 1)

**Task 1.1.1 - Repository Setup**
- Owner: Tech Lead
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] GitHub repo created with proper structure (backend/, frontend/, .github/workflows)
  - [ ] Branch protection rules: main branch requires PR + 2 approvals
  - [ ] Gitignore configured (.env, node_modules, dist, .DS_Store, etc.)
  - [ ] README.md with project overview
- Deliverables: GitHub repo ready for team

**Task 1.1.2 - Docker & Docker Compose Setup**
- Owner: DevOps Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] docker-compose.yml created with all services
  - [ ] Backend Dockerfile created (development + production multistage)
  - [ ] Frontend Dockerfile created (development + production multistage)
  - [ ] All services start successfully: `docker-compose up`
  - [ ] Volumes configured for data persistence (postgres_data, redis_data)
  - [ ] Health checks configured for postgres and redis
- Deliverables: docker-compose.yml, Dockerfiles, LOCAL_SETUP.md

**Task 1.1.3 - Database Schema Design**
- Owner: Backend Engineer
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] Entity-relationship diagram (ERD) created
  - [ ] All tables defined: users, biodatas, family_info, horoscope, photos, shares, audit_logs
  - [ ] Primary keys and foreign keys defined
  - [ ] Indexes on frequently queried columns (email, user_id, biodata_id)
  - [ ] Migration scripts created and tested
  - [ ] SQL schema documented
- Deliverables: Database schema, migration files, ERD diagram

**Task 1.1.4 - CI/CD Pipeline Setup**
- Owner: DevOps Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] GitHub Actions workflow created for CI/CD
  - [ ] Linting on every push (ESLint, TypeScript)
  - [ ] Unit tests run on every PR
  - [ ] Docker image builds on main branch
  - [ ] Deployment script to AWS (staging environment)
- Deliverables: .github/workflows/*.yml files

### Sprint 1.2: Backend Authentication (Week 2)

**Task 1.2.1 - Express Server Setup**
- Owner: Backend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] Express server created with middleware (CORS, helmet, rate limiting)
  - [ ] Environment variables configured (.env.example provided)
  - [ ] TypeScript configuration (tsconfig.json)
  - [ ] Dev server runs: `npm run dev`
  - [ ] Health check endpoint: GET /api/health
- Deliverables: src/index.ts, middleware setup, .env.example

**Task 1.2.2 - Database Connection & ORM Setup**
- Owner: Backend Engineer
- Effort: 5 hours
- Acceptance Criteria:
  - [ ] PostgreSQL connection pool configured
  - [ ] Migrations runnable with `npm run migrate`
  - [ ] Users table created via migration
  - [ ] Connection pooling configured (pool size: 20)
  - [ ] Tested with docker-compose postgres service
- Deliverables: src/db/connection.ts, migrations/001_init_users.sql

**Task 1.2.3 - Authentication Service (JWT)**
- Owner: Backend Engineer
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] JWT token generation on login
  - [ ] JWT verification middleware created
  - [ ] Tokens stored in httpOnly, secure cookies
  - [ ] Password hashing with bcrypt (12 salt rounds)
  - [ ] Refresh token mechanism
  - [ ] Tests written with >80% coverage
- Deliverables: src/services/auth.ts, src/middleware/auth.ts

**Task 1.2.4 - Auth Endpoints**
- Owner: Backend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] POST /api/auth/register endpoint
  - [ ] POST /api/auth/login endpoint
  - [ ] POST /api/auth/logout endpoint
  - [ ] POST /api/auth/refresh endpoint
  - [ ] Input validation with Joi
  - [ ] Error handling (400, 401, 500 responses)
  - [ ] Rate limiting (5 attempts per 15 minutes)
- Deliverables: src/routes/auth.ts, comprehensive error handling

**Task 1.2.5 - Redis Session Management**
- Owner: Backend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] Redis client configured
  - [ ] Session storage in Redis
  - [ ] Session expiry: 7 days
  - [ ] Logout clears session from Redis
- Deliverables: src/services/session.ts

### Sprint 1.3: Frontend Authentication UI (Week 3)

**Task 1.3.1 - React + Vite Setup**
- Owner: Frontend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] React 18 + TypeScript + Vite configured
  - [ ] Hot reload working
  - [ ] Tailwind CSS configured
  - [ ] Redux store created
  - [ ] Routing with React Router
- Deliverables: vite.config.ts, tsconfig.json, src/store/index.ts

**Task 1.3.2 - Login & Register UI**
- Owner: Frontend Engineer
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] Login form component created
  - [ ] Register form component created
  - [ ] Form validation (client-side)
  - [ ] API calls to backend endpoints
  - [ ] Error messages displayed (email already exists, wrong password, etc.)
  - [ ] Loading state during submission
  - [ ] Mobile-responsive design (Tailwind utilities)
- Deliverables: src/components/LoginForm.tsx, src/components/RegisterForm.tsx

**Task 1.3.3 - Protected Routes & Auth Context**
- Owner: Frontend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] PrivateRoute component that checks authentication
  - [ ] Auth context/Redux for storing user state
  - [ ] Token refresh on page load
  - [ ] Redirect unauthenticated users to login
  - [ ] Persist auth state in localStorage (secure way)
- Deliverables: src/components/PrivateRoute.tsx, src/store/authSlice.ts

**Task 1.3.4 - Navigation & Layout**
- Owner: Frontend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] Main navigation/header created
  - [ ] Footer component
  - [ ] Dashboard/home page layout
  - [ ] Logout button works
  - [ ] Mobile menu (hamburger) for mobile screens
- Deliverables: src/components/Header.tsx, src/components/Layout.tsx

---

## Phase 2: Biodata Creation (Weeks 4-8)

### Sprint 2.1: Biodata Endpoints & Backend (Weeks 4-5)

**Task 2.1.1 - Biodata CRUD Endpoints**
- Owner: Backend Engineer
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] POST /api/biodata - Create new biodata
  - [ ] GET /api/biodata/:id - Retrieve biodata
  - [ ] PUT /api/biodata/:id - Update biodata
  - [ ] GET /api/biodata/user/me - Get current user's biodata
  - [ ] DELETE /api/biodata/:id - Delete biodata
  - [ ] Authorization checks (user can only access own biodata)
  - [ ] Input validation for all fields
- Deliverables: src/routes/biodata.ts

**Task 2.1.2 - Photo Upload to AWS S3**
- Owner: Backend Engineer
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] AWS S3 client configured
  - [ ] POST /api/biodata/:id/photos - Upload photos
  - [ ] Photos stored with unique S3 keys
  - [ ] Photo records saved in database
  - [ ] Image validation (type, size <5MB)
  - [ ] S3 URL returned to client
  - [ ] Delete photo endpoint
- Deliverables: src/services/s3.ts, src/routes/photos.ts

**Task 2.1.3 - Family Info & Horoscope Endpoints**
- Owner: Backend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] POST /api/family-info - Create/update family info
  - [ ] POST /api/horoscope - Create/update horoscope
  - [ ] GET endpoints for both
  - [ ] Linked to biodata_id
  - [ ] Authorization checks
- Deliverables: src/routes/family.ts, src/routes/horoscope.ts

### Sprint 2.2: Biodata Creation UI (Weeks 5-6)

**Task 2.2.1 - Multi-Step Form Component**
- Owner: Frontend Engineer
- Effort: 10 hours
- Acceptance Criteria:
  - [ ] Multi-step form (7 screens from wireframe)
  - [ ] Step 1: Personal Details (name, age, caste, religion, height, education, profession, income, location)
  - [ ] Step 2: Photos (upload photos, set profile picture)
  - [ ] Step 3: Family (father name, mother name, siblings, occupation)
  - [ ] Step 4: Horoscope (DOB, birth time, birth place, rashi, nakshatra)
  - [ ] Step 5: Template selection
  - [ ] Form state management (Redux or Context)
  - [ ] Validation on each step
  - [ ] Save progress (can go back and edit)
  - [ ] Mobile-responsive (all screens stack vertically on mobile)
- Deliverables: src/pages/BioDataForm.tsx, src/components/FormStep*.tsx

**Task 2.2.2 - Photo Upload UI Component**
- Owner: Frontend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] Drag & drop photo upload
  - [ ] File picker fallback
  - [ ] Preview photos before upload
  - [ ] Crop/resize capability
  - [ ] Set profile picture from uploaded photos
  - [ ] Progress bar during upload
  - [ ] Error handling (file type, size)
- Deliverables: src/components/PhotoUploader.tsx

**Task 2.2.3 - Form Validation & Error Handling**
- Owner: Frontend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] Client-side validation (Joi schema)
  - [ ] Error messages below each field
  - [ ] Disable submit button until form is valid
  - [ ] Show API errors (server-side validation failures)
  - [ ] Loading state during submission
- Deliverables: src/utils/validation.ts, updated form components

### Sprint 2.3: Biodata Preview & Polish (Weeks 7-8)

**Task 2.3.1 - Biodata View/Preview**
- Owner: Frontend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] View own biodata with template design
  - [ ] Display all sections: personal, family, horoscope, photos
  - [ ] Beautiful layout matching wireframe design
  - [ ] Edit button to modify any section
  - [ ] Mobile-responsive preview
- Deliverables: src/pages/BioDataPreview.tsx

**Task 2.3.2 - Template System**
- Owner: Frontend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] Multiple biodata templates available
  - [ ] Template selection during form
  - [ ] Template preview before saving
  - [ ] Easy template switching in preview
  - [ ] Store selected template in database
- Deliverables: src/components/TemplateSelector.tsx, src/styles/templates/

**Task 2.3.3 - Mobile Responsiveness Testing**
- Owner: QA/Frontend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] All forms work on mobile (320px+)
  - [ ] Photo upload works on mobile
  - [ ] No horizontal scroll
  - [ ] Touch-friendly buttons (min 44x44px)
  - [ ] Tested on Chrome Mobile, Safari, Firefox
- Deliverables: Mobile testing report

---

## Phase 3: Sharing & Privacy (Weeks 9-12)

### Sprint 3.1: Sharing Backend (Weeks 9-10)

**Task 3.1.1 - Share Endpoints**
- Owner: Backend Engineer
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] POST /api/shares - Create share (email or public link)
  - [ ] GET /api/shares/:id - Get share details
  - [ ] GET /api/shares - List shares for user's biodata
  - [ ] PUT /api/shares/:id - Update permissions
  - [ ] DELETE /api/shares/:id - Revoke share
  - [ ] Share tokens generated (unique, secure)
  - [ ] Expiry dates enforced
- Deliverables: src/routes/shares.ts

**Task 3.1.2 - Privacy Controls**
- Owner: Backend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] Permission levels: view_basic, view_photos, view_horoscope, view_contact
  - [ ] Check permissions before returning data
  - [ ] Audit log for share access
  - [ ] Prevent unauthorized access
- Deliverables: src/services/permissions.ts

**Task 3.1.3 - Public Viewer Endpoint**
- Owner: Backend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] GET /api/public/:shareToken - Access shared biodata
  - [ ] Verify token validity and expiry
  - [ ] Return only permitted fields
  - [ ] No authentication required
  - [ ] Log access in audit_logs
- Deliverables: src/routes/public.ts

### Sprint 3.2: Sharing UI (Weeks 10-11)

**Task 3.2.1 - Share Dialog/Modal**
- Owner: Frontend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] Share button on biodata view
  - [ ] Modal to select sharing method (email or link)
  - [ ] Email field for direct sharing
  - [ ] Generate shareable link (copy to clipboard)
  - [ ] Set share permissions (view_photos, view_horoscope, etc.)
  - [ ] Set expiry date
  - [ ] Success message after share
- Deliverables: src/components/ShareModal.tsx

**Task 3.2.2 - Privacy Settings Page**
- Owner: Frontend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] List all active shares
  - [ ] Show permissions for each share
  - [ ] Show expiry date
  - [ ] Revoke share button
  - [ ] Edit permissions button
  - [ ] Confirm before revoking
  - [ ] Mobile-responsive
- Deliverables: src/pages/PrivacySettings.tsx

**Task 3.2.3 - Public Viewer Page**
- Owner: Frontend Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] Page accessible via /share/:token URL
  - [ ] Fetch biodata using share token
  - [ ] Display biodata with respected permissions
  - [ ] Hide fields not permitted
  - [ ] Show expiry warning if close to expiry
  - [ ] No login required
  - [ ] Mobile-responsive
- Deliverables: src/pages/PublicBioDataView.tsx

### Sprint 3.3: Privacy Features & Polish (Weeks 11-12)

**Task 3.3.1 - Activity/Audit Logging**
- Owner: Backend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] Log all share creations
  - [ ] Log all share revokes
  - [ ] Log public viewer access
  - [ ] Store timestamp, user_id, action, share_id
  - [ ] Retrievable via API for user's own logs
- Deliverables: Audit logging system

**Task 3.3.2 - Activity Log UI**
- Owner: Frontend Engineer
- Effort: 4 hours
- Acceptance Criteria:
  - [ ] Activity page showing recent shares/access
  - [ ] Timestamp and who accessed
  - [ ] Filterable by action (shared, accessed, revoked)
  - [ ] Mobile-responsive
- Deliverables: src/pages/ActivityLog.tsx

**Task 3.3.3 - Security & Bug Fixes**
- Owner: Tech Lead / DevOps
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] Security audit of sharing logic
  - [ ] Penetration testing (share token brute force resistance)
  - [ ] Fix any bugs from QA
  - [ ] Performance optimization (caching)
- Deliverables: Security report, fixes

---

## Phase 4: Testing & Deployment (Weeks 13-18)

### Sprint 4.1: Unit & Integration Tests (Weeks 13-14)

**Task 4.1.1 - Backend Unit Tests**
- Owner: Backend Engineer
- Effort: 10 hours
- Acceptance Criteria:
  - [ ] Auth service tests (>80% coverage)
  - [ ] Biodata CRUD tests
  - [ ] Share logic tests
  - [ ] Permission checks tests
  - [ ] All tests passing
- Deliverables: Tests in src/__tests__/

**Task 4.1.2 - Frontend Unit Tests**
- Owner: Frontend Engineer
- Effort: 10 hours
- Acceptance Criteria:
  - [ ] Form component tests
  - [ ] Photo uploader tests
  - [ ] Share modal tests
  - [ ] Redux slice tests
  - [ ] >80% coverage
- Deliverables: Tests in src/__tests__/

**Task 4.1.3 - Integration Tests**
- Owner: Backend Engineer
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] Auth flow (register → login → access protected route)
  - [ ] Biodata creation with photos
  - [ ] Share creation and access
  - [ ] Permission enforcement
  - [ ] All passing
- Deliverables: Integration test suite

### Sprint 4.2: E2E Testing & Performance (Weeks 14-15)

**Task 4.2.1 - E2E Tests**
- Owner: QA Engineer
- Effort: 10 hours
- Acceptance Criteria:
  - [ ] User signup flow
  - [ ] Biodata creation flow (all steps)
  - [ ] Photo upload flow
  - [ ] Share flow
  - [ ] Public viewer access
  - [ ] All scenarios passing
- Deliverables: E2E test suite (Playwright)

**Task 4.2.2 - Performance Testing**
- Owner: DevOps / Backend
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] Load testing (1000 concurrent users)
  - [ ] Database query optimization
  - [ ] Cache optimization
  - [ ] Response times <500ms for critical endpoints
  - [ ] No memory leaks
- Deliverables: Performance report

**Task 4.2.3 - Security Audit**
- Owner: Tech Lead / DevOps
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] OWASP Top 10 review
  - [ ] SQL injection prevention ✓
  - [ ] XSS prevention ✓
  - [ ] CSRF protection ✓
  - [ ] Rate limiting ✓
  - [ ] Secrets not in code ✓
  - [ ] Vulnerabilities documented
- Deliverables: Security audit report

### Sprint 4.3: Deployment (Weeks 16-18)

**Task 4.3.1 - Production Environment Setup**
- Owner: DevOps Engineer
- Effort: 10 hours
- Acceptance Criteria:
  - [ ] AWS EC2 instances configured
  - [ ] RDS PostgreSQL set up
  - [ ] ElastiCache Redis set up
  - [ ] S3 buckets created and configured
  - [ ] SSL/TLS certificates
  - [ ] Load balancer configured
  - [ ] Auto-scaling configured
- Deliverables: AWS infrastructure provisioned

**Task 4.3.2 - CI/CD Pipeline to Production**
- Owner: DevOps Engineer
- Effort: 8 hours
- Acceptance Criteria:
  - [ ] Automated deployments on main branch
  - [ ] Blue-green deployment strategy
  - [ ] Rollback capability
  - [ ] Health checks post-deployment
  - [ ] Monitoring and alerts configured
- Deliverables: GitHub Actions workflow for production

**Task 4.3.3 - Monitoring & Logging**
- Owner: DevOps Engineer
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] CloudWatch logs configured
  - [ ] Error tracking (Sentry or similar)
  - [ ] Performance monitoring (APM)
  - [ ] Uptime monitoring
  - [ ] Alert rules configured
- Deliverables: Monitoring dashboard

**Task 4.3.4 - Documentation & Handoff**
- Owner: Tech Lead
- Effort: 6 hours
- Acceptance Criteria:
  - [ ] API documentation (OpenAPI/Swagger)
  - [ ] Deployment runbook
  - [ ] Troubleshooting guide
  - [ ] Architecture documentation
  - [ ] Team training completed
- Deliverables: Comprehensive documentation

---

## Effort Summary

| Phase | Sprint | Effort (hours) | Duration |
|-------|--------|---|---|
| Phase 1 | 1.1 | 24 | Week 1 |
| | 1.2 | 35 | Week 2 |
| | 1.3 | 22 | Week 3 |
| Phase 2 | 2.1 | 22 | Weeks 4-5 |
| | 2.2 | 20 | Weeks 5-6 |
| | 2.3 | 16 | Weeks 7-8 |
| Phase 3 | 3.1 | 18 | Weeks 9-10 |
| | 3.2 | 18 | Weeks 10-11 |
| | 3.3 | 14 | Weeks 11-12 |
| Phase 4 | 4.1 | 28 | Weeks 13-14 |
| | 4.2 | 24 | Weeks 14-15 |
| | 4.3 | 30 | Weeks 16-18 |

**Total: ~271 hours of engineering work**

---

## Team Capacity

For a 4-person team working 40 hours/week over 18 weeks:
- Total available: 4 × 40 × 18 = 2,880 hours
- Allocated to coding: ~75% = 2,160 hours
- Available for meetings, planning, reviews: ~25% = 720 hours

**271 hours of planned work fits comfortably within capacity (~12.5% of available coding time)**

---

## Status Tracking

Use this template for weekly updates:

```
Week 4 Status:
- ✓ 2.1.1 - Biodata CRUD Endpoints (100%)
- 🔄 2.1.2 - Photo Upload (60% - S3 integration complete, testing in progress)
- ⏳ 2.1.3 - Family/Horoscope (not started, scheduled week 5)
- Blockers: None
- Next week: Complete S3 photo upload, start family info endpoints
```

---

## Questions?

- **Who's doing what**: Ask the Tech Lead
- **How do I start**: Read LOCAL_SETUP.md
- **Architecture questions**: Check Engineering Plan
- **Stuck on a task**: Pair with someone or ask in standups
