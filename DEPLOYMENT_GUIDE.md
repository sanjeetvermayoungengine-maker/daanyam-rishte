# 🚀 Deployment Guide - Rishta App

Complete guide to deploy your biodata app to production.

---

## Phase 1: Pre-Deployment Checklist

Before deploying, ensure everything works locally:

### ✅ Local Testing

```bash
# 1. Clean slate
docker-compose down -v

# 2. Rebuild with production config
docker-compose up --build

# 3. Run migrations
docker-compose exec backend npm run migrate

# 4. Test all flows:
#    - User registration
#    - Login
#    - Biodata creation (all 7 steps)
#    - Photo upload
#    - Sharing
#    - Public viewer
```

### ✅ Code Quality Checks

```bash
# Lint frontend
docker-compose exec frontend npm run lint

# Lint backend
docker-compose exec backend npm run lint

# Run tests
docker-compose exec backend npm run test
docker-compose exec frontend npm run test
```

### ✅ Environment Variables Audit

**Backend (.env)** - Create secure versions:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=<production-postgres-url>
REDIS_URL=<production-redis-url>
JWT_SECRET=<generate-strong-secret>
AWS_S3_BUCKET=<your-bucket-name>
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env)** - For production:
```
VITE_API_URL=https://api.yourdomain.com
```

### ✅ Database Backups

```bash
# Export current database
docker-compose exec postgres pg_dump -U biodata_user biodata_db > backup.sql

# Save to safe location (cloud storage)
```

---

## Phase 2: Choose Your Hosting Platform

Pick one based on your needs:

| Platform | Cost | Ease | Scale | Recommendation |
|----------|------|------|-------|---|
| **AWS** (EC2 + RDS) | $50-200/mo | Medium | High | Production, scaling |
| **Railway** | $5-50/mo | Easy | Medium | Fast deployment |
| **Render** | $7-100/mo | Easy | Medium | Good free tier |
| **DigitalOcean** | $6-40/mo | Easy | Medium | Simple, reliable |
| **Heroku** | $50+/mo | Very Easy | Medium | Legacy, expensive |

**Recommendation for MVP**: Start with **Railway** or **Render** (easier, faster), then migrate to **AWS** when scaling.

---

## Option 1: Deploy to Railway.app (⭐ Easiest)

Railway is the fastest way to get live. 10 minutes deployment.

### Step 1: Prepare Repository

```bash
# Ensure all code is committed
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Connect to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `daanyam-rishte` repo
5. Railway auto-detects Docker setup

### Step 3: Configure Services

Railway will detect 4 services: frontend, backend, postgres, redis

**For Backend Service:**
- Set environment variables (click service → Variables tab)
- Add all secrets from `.env`:
  ```
  DATABASE_URL = ${{Postgres.DATABASE_URL}}
  REDIS_URL = ${{Redis.REDIS_URL}}
  JWT_SECRET = generate-and-paste-strong-secret
  NODE_ENV = production
  AWS_S3_BUCKET = your-bucket
  AWS_ACCESS_KEY_ID = your-key
  AWS_SECRET_ACCESS_KEY = your-secret
  ```

**For Frontend Service:**
- Add VITE_API_URL pointing to backend URL (Railway generates one automatically)
  ```
  VITE_API_URL = https://backend-url-from-railway.com
  ```

### Step 4: Run Database Migrations

```bash
# After services start, open backend service terminal
# Click "Connect" on backend service → Shell tab
# Run:
npm run migrate
```

### Step 5: Get Your URLs

Railway assigns public URLs automatically:
- Frontend: `https://your-app-name.railway.app`
- Backend API: `https://api-your-app-name.railway.app`

**Done! Your app is live in ~10 minutes.** 🎉

---

## Option 2: Deploy to AWS (Production-Grade)

For scaling and long-term production.

### Architecture
```
User
  ↓
CloudFront (CDN)
  ↓
ALB (Load Balancer)
  ↓
EC2 Auto Scaling Group (Frontend + Backend)
  ↓
RDS PostgreSQL (Database)
  ↓
ElastiCache Redis (Cache)
  ↓
S3 (Photo storage)
```

### Step 1: AWS Account Setup

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# Enter: Access Key, Secret Key, Region (us-east-1), Output format (json)
```

### Step 2: Create RDS PostgreSQL Database

```bash
# Using AWS Console is easier, but CLI version:
aws rds create-db-instance \
  --db-instance-identifier biodata-prod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username biodata_admin \
  --master-user-password 'strong-password-here' \
  --allocated-storage 20 \
  --publicly-accessible false \
  --db-name biodata_prod \
  --region us-east-1
```

**Via AWS Console** (easier):
1. Go to RDS → Create database
2. Choose PostgreSQL 14
3. Template: Free tier
4. DB instance identifier: `biodata-prod-db`
5. Master username: `biodata_admin`
6. Password: Generate strong password
7. Public accessibility: No
8. Create database (takes 5 mins)
9. Copy endpoint from "Connectivity & security" tab

### Step 3: Create ElastiCache Redis

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id biodata-prod-redis \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --region us-east-1
```

Or via AWS Console:
1. Go to ElastiCache → Create Redis cluster
2. Name: `biodata-prod-redis`
3. Node type: `cache.t3.micro`
4. Engine version: `7.0`
5. Create
6. Copy Primary Endpoint

### Step 4: Create S3 Bucket for Photos

```bash
aws s3 mb s3://biodata-app-photos --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket biodata-app-photos \
  --versioning-configuration Status=Enabled
```

### Step 5: Create IAM User for S3 Access

1. Go to IAM → Users → Create user
2. Name: `biodata-app-user`
3. Create access key (for AWS CLI)
4. Attach policy: `AmazonS3FullAccess` (or create custom policy for specific bucket)
5. Save Access Key ID and Secret

### Step 6: Build Docker Images

```bash
# Build backend image
cd backend
docker build -t biodata-backend:latest .
docker tag biodata-backend:latest <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/biodata-backend:latest

# Build frontend image
cd ../frontend
docker build -t biodata-frontend:latest .
docker tag biodata-frontend:latest <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/biodata-frontend:latest

# Push to ECR (Elastic Container Registry)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/biodata-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/biodata-frontend:latest
```

### Step 7: Deploy Using ECS or EC2

**Using ECS (easier):**

1. Go to ECS → Create cluster (name: `biodata-prod`)
2. Create task definitions:
   - Backend task: container image = ECR backend image
   - Frontend task: container image = ECR frontend image
3. Create services (run tasks in cluster)
4. Attach load balancer

**Using EC2 + Docker Compose:**

1. Launch EC2 instance (t3.small, Ubuntu 22.04)
2. SSH into instance and install Docker:
   ```bash
   sudo apt update && sudo apt install docker.io docker-compose
   sudo usermod -aG docker $USER
   ```
3. Clone repo and update docker-compose.yml with RDS/Redis URLs
4. Run: `docker-compose up -d`

### Step 8: Set Up CloudFront (CDN)

1. Go to CloudFront → Create distribution
2. Origin: Your ALB/EC2 public IP
3. Compress objects automatically
4. Enable HTTPS
5. Create distribution

### Step 9: Run Database Migrations

```bash
# SSH into EC2 or RDS client
psql -h <rds-endpoint> -U biodata_admin -d biodata_prod < migrations.sql
```

Or use backend container:
```bash
docker-compose exec backend npm run migrate
```

### Step 10: Monitor & Alert

```bash
# Enable CloudWatch monitoring
aws cloudwatch put-metric-alarm \
  --alarm-name biodata-cpu-high \
  --alarm-description "Alert when CPU > 70%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold
```

**Set up SNS for email alerts:**
1. SNS → Create topic → Subscribe with your email
2. CloudWatch alarms → Add SNS action

---

## Option 3: Deploy to Render.com (Good Balance)

Similar ease to Railway, with more features.

### Step 1: Connect GitHub

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize repo access

### Step 2: Create Web Services

**Create Backend Service:**
1. New → Web Service
2. Connect repo → select branch `main`
3. Name: `biodata-api`
4. Runtime: `Docker`
5. Build command: (leave default)
6. Start command: (leave default)
7. Instance type: Free/Starter
8. Environment variables:
   ```
   DATABASE_URL = postgres://user:pass@host/db
   REDIS_URL = redis://host:port
   JWT_SECRET = strong-secret
   NODE_ENV = production
   ```
9. Create service

**Create Frontend Service:**
1. New → Static Site
2. Connect repo
3. Name: `biodata-ui`
4. Build command: `npm run build`
5. Publish directory: `frontend/dist`
6. Add environment:
   ```
   VITE_API_URL = https://biodata-api.render.com
   ```
7. Create service

### Step 3: Connect Database & Redis

Add PostgreSQL and Redis services from Render dashboard:
1. New → PostgreSQL
2. New → Redis

Copy connection URLs to web service environment.

### Step 4: Run Migrations

1. Backend service → Shell tab
2. Run: `npm run migrate`

---

## Option 4: Deploy to DigitalOcean (Simple & Affordable)

Good balance of price and features.

### Step 1: Create Droplet

```bash
# Via CLI or console
doctl compute droplet create biodata-app \
  --region sfo3 \
  --size s-1vcpu-2gb \
  --image ubuntu-22-04-x64 \
  --enable-monitoring
```

Or via Console:
1. Create droplet (Ubuntu 22.04, $6/mo)
2. Add SSH key
3. Create

### Step 2: Install Docker

```bash
# SSH into droplet
ssh root@<ip>

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker root

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 3: Clone & Deploy

```bash
# Clone repo
git clone https://github.com/yourusername/daanyam-rishte.git
cd daanyam-rishte

# Create .env files with production secrets
# Update docker-compose.yml for DigitalOcean managed database

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate
```

### Step 4: Set Up Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

### Step 5: Enable HTTPS (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Phase 3: Post-Deployment Setup

### ✅ Configure Custom Domain

1. Buy domain (Namecheap, GoDaddy, etc.)
2. Update DNS records:
   ```
   A Record: yourdomain.com → your-server-ip
   CNAME: api.yourdomain.com → backend-url
   CNAME: www.yourdomain.com → yourdomain.com
   ```
3. Wait 24 hours for DNS propagation

### ✅ Set Up SSL/HTTPS

**For Railway/Render**: Automatic with custom domain

**For AWS**: Use ACM (AWS Certificate Manager):
```bash
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS
```

**For DigitalOcean/EC2**: Use Let's Encrypt (see above)

### ✅ Configure Email (Optional)

For password resets and share notifications:

**Using SendGrid:**
```bash
# 1. Create SendGrid account
# 2. Get API key
# 3. Add to backend .env:
SENDGRID_API_KEY=your-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### ✅ Enable Monitoring & Logging

**CloudWatch (AWS):**
```bash
aws logs create-log-group --log-group-name /biodata/app
aws logs put-retention-policy --log-group-name /biodata/app --retention-in-days 7
```

**DataDog (any platform):**
1. Sign up at datadoghq.com
2. Install agent
3. Get dashboards for CPU, memory, request rates

### ✅ Set Up Backups

**Database backups:**
```bash
# Automated daily backups (AWS RDS: done automatically)
# For PostgreSQL on EC2:
0 2 * * * pg_dump -U biodata_admin biodata_db | gzip > /backups/biodata_$(date +\%Y\%m\%d).sql.gz
```

**S3 backups** (automatic with versioning enabled)

---

## Phase 4: Verification Checklist

After deployment, verify everything works:

```bash
# ✅ API is accessible
curl https://yourdomain.com/api/health

# ✅ Database is running
# Should return 200 with {"status": "ok"}

# ✅ Frontend loads
# Visit https://yourdomain.com in browser

# ✅ User registration works
# Sign up with test account

# ✅ Database migrations ran
# Check users table exists

# ✅ Photos upload to S3
# Upload photo in biodata form, check S3 bucket

# ✅ Email works (if configured)
# Request password reset

# ✅ Sharing works
# Create biodata, share with link, access publicly
```

---

## Phase 5: Continuous Deployment (Optional)

Set up automatic deploys on git push:

### GitHub Actions CI/CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker images
        run: |
          docker build -t biodata-backend:latest backend/
          docker build -t biodata-frontend:latest frontend/
          # Push to ECR/Docker Hub
      
      - name: Deploy to Railway/Render/AWS
        run: |
          # Platform-specific deploy command
          
      - name: Run migrations
        run: |
          # Connect to prod database and migrate
```

---

## Phase 6: Monitoring & Maintenance

### Daily Checks

- [ ] App loads without errors
- [ ] Users can register/login
- [ ] No spike in errors

### Weekly Checks

- [ ] Database size is under control
- [ ] No slow queries
- [ ] Memory usage is stable

### Monthly Checks

- [ ] Review logs for errors
- [ ] Update dependencies
- [ ] Security patches
- [ ] Backup verification

### Commands for Monitoring

```bash
# Check app health
curl https://yourdomain.com/api/health

# View database size
# SSH to database and run: SELECT pg_size_pretty(pg_database_size('biodata_prod'));

# Check S3 bucket size
aws s3 ls s3://biodata-app-photos --recursive --human-readable --summarize

# View recent errors
docker logs biodata-backend | tail -100
```

---

## Troubleshooting Deployment Issues

### App not starting

```bash
# Check logs
docker logs biodata-backend
docker logs biodata-frontend

# Verify environment variables
docker inspect biodata-backend | grep Env

# Test database connection
docker exec biodata-backend node -e "require('./dist/db/connection').test()"
```

### Database connection error

```bash
# Test connection
psql -h <db-host> -U <username> -d <database>

# Check DATABASE_URL format
echo $DATABASE_URL

# Verify from app container
docker exec biodata-backend env | grep DATABASE
```

### Photos not uploading to S3

```bash
# Verify credentials
aws s3 ls --profile biodata

# Check bucket exists
aws s3 ls s3://biodata-app-photos

# Verify IAM permissions
aws iam get-user-policy --user-name biodata-app-user --policy-name S3Access
```

### Frontend doesn't load API

```bash
# Check VITE_API_URL
curl https://yourdomain.com/env  # or check browser console

# Test API directly
curl https://yourdomain.com/api/health

# Check CORS settings
# Verify CORS_ORIGIN in backend .env matches frontend domain
```

---

## Summary: Quick Start Path

**Fastest Path to Live (20 minutes):**

1. **Push code to GitHub** (5 min)
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy to Railway** (10 min)
   - Sign up with GitHub
   - Connect repo
   - Add RDS/Redis
   - Run migrations

3. **Buy custom domain** (5 min)
   - NameCheap / GoDaddy
   - Point to Railway URL
   - Enable auto-SSL

4. **Test thoroughly** (5 min)
   - Sign up
   - Create biodata
   - Share biodata
   - Access public viewer

**Done! App is live!** 🎉

---

## Need Help?

**Issues with specific platform:**
- Railway: Docs at https://docs.railway.app
- Render: Docs at https://render.com/docs
- AWS: Docs at https://docs.aws.amazon.com
- DigitalOcean: Docs at https://docs.digitalocean.com

**General Docker issues:**
- Check Docker logs: `docker logs <container-name>`
- Rebuild: `docker-compose down -v && docker-compose up --build`

**Database issues:**
- Check migrations ran: `docker-compose exec backend npm run migrate`
- Verify credentials in .env

**Environmental issues:**
- Print all vars: `docker exec <container> env | grep -E 'DATABASE|REDIS|JWT|AWS'`
- Update and restart: `docker-compose down && docker-compose up -d`

---

## Good luck with launch! 🚀

For ongoing support and updates, keep this doc handy and update it as you discover new best practices.
