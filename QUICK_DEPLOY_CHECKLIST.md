# ⚡ Quick Deploy Checklist - Go Live in 30 Minutes

Choose your platform and follow the steps.

---

## 🏃 FASTEST PATH: Deploy to Railway (Recommended for MVP)

**Time: 10 minutes | Cost: $5-50/month**

### Step 1: Prepare Code (2 min)

```bash
# Make sure everything is committed
cd /Users/sanjeet/Desktop/daanyam-rishte
git add .
git commit -m "ready for production deployment"
git push origin main
```

### Step 2: Create Railway Account (2 min)

1. Go to https://railway.app
2. Sign up with GitHub (authorize repo access)
3. Click "New Project" button

### Step 3: Import from GitHub (2 min)

1. Select "Deploy from GitHub repo"
2. Find and select `daanyam-rishte`
3. Railway auto-detects Docker setup
4. Click "Deploy"

### Step 4: Configure Secrets (3 min)

**Go to Backend Service → Variables tab**

Add these environment variables:

```
NODE_ENV=production
JWT_SECRET=<GENERATE-STRONG-SECRET>
AWS_S3_BUCKET=<your-bucket>
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
CORS_ORIGIN=<frontend-url-from-railway>
```

**Go to Frontend Service → Variables tab**

```
VITE_API_URL=<backend-url-from-railway>
```

### Step 5: Run Database Migrations (1 min)

1. Open Backend Service → "Connect" → Shell tab
2. Paste:
```bash
npm run migrate
```
3. Hit enter, wait for migrations to complete

### ✅ DONE! Your app is live!

Railway gives you public URLs:
- **Frontend**: `https://yourdomain-production.railway.app`
- **Backend**: `https://yourdomain-api-production.railway.app`

Visit frontend URL in browser → your app is live!

---

## 🎯 Alternative: Deploy to AWS (Production-Ready)

**Time: 30 minutes | Cost: $50-200/month**

### Prerequisite: AWS Account

Create account at https://aws.amazon.com

### Step 1: Create RDS Database (5 min)

```bash
aws rds create-db-instance \
  --db-instance-identifier biodata-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username biodata_admin \
  --master-user-password "$(openssl rand -base64 32)" \
  --allocated-storage 20 \
  --region us-east-1
```

Or use AWS Console: RDS → Create Database → PostgreSQL Free Tier

**Save endpoint** from outputs (something like `biodata-prod.abc123.us-east-1.rds.amazonaws.com`)

### Step 2: Create ElastiCache Redis (5 min)

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id biodata-redis-prod \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --engine-version 7.0 \
  --region us-east-1
```

**Save endpoint** from outputs

### Step 3: Create S3 Bucket (2 min)

```bash
aws s3 mb s3://biodata-photos-prod --region us-east-1
aws s3api put-bucket-versioning \
  --bucket biodata-photos-prod \
  --versioning-configuration Status=Enabled
```

### Step 4: Create IAM User for S3 (3 min)

```bash
aws iam create-user --user-name biodata-app
aws iam attach-user-policy \
  --user-name biodata-app \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam create-access-key --user-name biodata-app
```

**Save Access Key ID and Secret Key**

### Step 5: Build & Push Docker Images (10 min)

```bash
# Install AWS CLI and Docker (if not already installed)

# Set your AWS account ID
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1

# Create ECR repositories
aws ecr create-repository --repository-name biodata-backend --region $AWS_REGION
aws ecr create-repository --repository-name biodata-frontend --region $AWS_REGION

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push backend
cd /Users/sanjeet/Desktop/daanyam-rishte/backend
docker build -t biodata-backend:latest .
docker tag biodata-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/biodata-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/biodata-backend:latest

# Build and push frontend
cd ../frontend
docker build -t biodata-frontend:latest .
docker tag biodata-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/biodata-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/biodata-frontend:latest
```

### Step 6: Launch EC2 Instance (5 min)

```bash
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t3.small \
  --key-name my-key \
  --security-groups default \
  --region us-east-1
```

Or use AWS Console: EC2 → Launch Instance → Ubuntu 22.04

**Save public IP**

### Step 7: Connect & Install Docker (5 min)

```bash
# SSH into instance
ssh -i my-key.pem ubuntu@<public-ip>

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 8: Deploy with Docker Compose (5 min)

```bash
# On EC2 instance
git clone <your-repo>
cd daanyam-rishte

# Create .env file
cat > .env <<EOF
NODE_ENV=production
DATABASE_URL=postgresql://biodata_admin:PASSWORD@RDS_ENDPOINT:5432/biodata_db
REDIS_URL=redis://REDIS_ENDPOINT:6379
JWT_SECRET=$(openssl rand -base64 32)
AWS_S3_BUCKET=biodata-photos-prod
AWS_ACCESS_KEY_ID=<from-step-4>
AWS_SECRET_ACCESS_KEY=<from-step-4>
AWS_REGION=us-east-1
CORS_ORIGIN=http://<public-ip>
VITE_API_URL=http://<public-ip>:3000
EOF

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate
```

### Step 9: Get Your URLs ✅

```bash
# Frontend: http://<ec2-public-ip>:5173
# Backend API: http://<ec2-public-ip>:3000
```

---

## 🔧 Verify Deployment

Run these tests after going live:

```bash
# 1. Check API is responding
curl https://yourdomain.com/api/health
# Should return: {"status": "ok"}

# 2. Check frontend loads
# Visit https://yourdomain.com in browser
# Should see login page

# 3. Test registration
# Create test account

# 4. Check database
# Go to backend service → shell
# Run: npm run migrate (should say "migrations completed")

# 5. Test photo upload
# Upload photo in biodata form
# Should see it in AWS S3 bucket

# 6. Test sharing
# Create biodata → click Share
# Copy share link
# Open in incognito (no login needed)
# Should see biodata

# 7. Check logs for errors
docker logs biodata-backend | tail -50
docker logs biodata-frontend | tail -50
```

---

## 🌐 Custom Domain Setup

After deployment:

### 1. Buy Domain

NameCheap, GoDaddy, or Domain.com
(Cost: $10-15/year)

### 2. Point to Your Server

**If using Railway:**
- Add custom domain in Railway dashboard
- Update DNS records to Railway's IP
- Railway auto-creates SSL certificate

**If using AWS EC2:**
```
Create A Record:
Name: yourdomain.com
Type: A
Value: <ec2-public-ip>

Create CNAME:
Name: api.yourdomain.com
Type: CNAME
Value: yourdomain.com
```

### 3. Enable HTTPS (If EC2)

```bash
# SSH into instance
ssh ubuntu@yourdomain.com

# Install Let's Encrypt
sudo apt update && sudo apt install certbot nginx
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Set up Nginx reverse proxy
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5173;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

Reload:
```bash
sudo systemctl restart nginx
```

---

## 🚨 Troubleshooting

### "Deployment Failed"
```bash
# Check logs
docker logs biodata-backend
docker logs biodata-frontend

# Check environment variables
docker inspect biodata-backend | grep -E "DATABASE_URL|REDIS"
```

### "Database Connection Error"
```bash
# Verify DATABASE_URL format
echo $DATABASE_URL

# Test connection manually
psql postgresql://user:pass@host:5432/db

# Check security group allows 5432
# (AWS EC2 → Security Groups → Inbound rules)
```

### "Photos not uploading"
```bash
# Check S3 credentials
aws s3 ls

# Verify bucket exists
aws s3 ls s3://biodata-photos-prod

# Check file upload endpoint
curl -X POST https://yourdomain.com/api/biodata/1/photos
```

### "Frontend shows blank page"
```bash
# Check VITE_API_URL
# Open browser DevTools (F12) → Console tab
# Should show no CORS errors

# Verify backend API URL
curl https://yourdomain.com/api/health
```

---

## 📋 Final Checklist

Before declaring "LIVE":

- [ ] App loads in browser without errors
- [ ] Can register new account
- [ ] Can login with account
- [ ] Can create biodata (all 7 steps)
- [ ] Can upload photos
- [ ] Photos appear in AWS S3
- [ ] Can create share link
- [ ] Share link works in incognito (no login)
- [ ] All shared fields display correctly
- [ ] Email notifications work (if configured)
- [ ] Database backups are running
- [ ] Monitoring/alerts are configured
- [ ] SSL certificate is valid
- [ ] Custom domain points correctly

---

## 🎉 Congratulations!

Your app is now live! Next steps:

1. **Monitor**: Set up CloudWatch/DataDog for alerts
2. **Backup**: Enable automated database backups
3. **Scale**: As users grow, upgrade instance type
4. **Security**: Run security audit, add WAF rules
5. **Iterate**: Roll out new features via CI/CD

**Share with beta users and gather feedback!** 📱

---

## 📞 Support

- Railway Issues: https://railway.app/support
- AWS Issues: https://console.aws.amazon.com/support
- Docker Issues: https://docs.docker.com
- PostgreSQL Issues: https://www.postgresql.org/docs

Good luck! 🚀
