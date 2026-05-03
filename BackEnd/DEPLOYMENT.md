# Deployment & Setup Guide

Complete guide for setting up, deploying, and maintaining the Internship Skill Tracker backend.

---

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Production Deployment](#production-deployment)
5. [MongoDB Setup](#mongodb-setup)
6. [Security Checklist](#security-checklist)
7. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher (ES Modules support)
- **npm**: 9.0.0 or higher
- **MongoDB**: 4.4 or higher
- **RAM**: 512MB minimum, 2GB+ recommended
- **Disk**: 1GB minimum for dependencies + database

### Supported Operating Systems
- Windows 10+
- macOS 10.15+
- Linux (Ubuntu 18.04+, CentOS 7+, Debian 10+)

### Check Your Versions
```bash
node --version      # Should be v18.0.0+
npm --version       # Should be 9.0.0+
mongo --version     # Should be 4.4+
```

---

## Local Development Setup

### Step 1: Install Dependencies

```bash
# Navigate to backend directory
cd BackEnd

# Install all npm packages
npm install

# Verify installation
npm list
```

### Step 2: Configure Environment

```bash
# Copy template to local config
cp .env.example .env

# Edit .env with your values (see Environment Variables section below)
nano .env
# OR on Windows:
notepad .env
```

### Step 3: Start MongoDB Locally

**Option A: MongoDB Community Edition (Recommended for development)**
```bash
# Start MongoDB service
# macOS/Linux:
brew services start mongodb-community

# Windows:
mongod

# Verify connection:
mongo  # or mongosh on newer versions
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`
- Use in MONGODB_URI

### Step 4: Run Development Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Output should show:
# 🚀 Server running on http://localhost:5000
# 📊 Health check: http://localhost:5000/api/v1/health
# 🗂️  MongoDB: mongodb://localhost:27017/internship-tracker
```

### Step 5: Verify Installation

```bash
# Test health endpoint
curl http://localhost:5000/api/v1/health

# Expected response:
# {"status":"ok","timestamp":"2026-05-03T...","environment":"development"}
```

---

## Environment Variables

### Development Configuration (.env)

```env
# ===== MongoDB Connection =====
# Local development
MONGODB_URI=mongodb://localhost:27017/internship-tracker

# OR Cloud MongoDB (Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/internship-tracker?retryWrites=true&w=majority

# ===== Server Configuration =====
PORT=5000
NODE_ENV=development

# ===== Decay Configuration =====
SKILL_DECAY_THRESHOLD=30  # Days before skill considered "decaying"

# ===== JWT Configuration =====
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRY=30m            # Token expiration time
```

### Production Configuration (.env for production server)

```env
# ===== MongoDB Connection =====
# CRITICAL: Use MongoDB Atlas or managed service, NEVER run unmanaged MongoDB in production
MONGODB_URI=mongodb+srv://prod_user:secure_password_here@prod-cluster.mongodb.net/internship-tracker?retryWrites=true&w=majority

# ===== Server Configuration =====
PORT=5000
NODE_ENV=production

# ===== Decay Configuration =====
SKILL_DECAY_THRESHOLD=30

# ===== JWT Configuration =====
# CRITICAL: Generate a strong random secret (minimum 32 characters)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-production-secret-key-minimum-32-characters
JWT_EXPIRY=24h            # Shorter expiry for production
```

### Environment Variable Reference

| Variable | Default | Description | Production Notes |
|----------|---------|-------------|-------------------|
| `MONGODB_URI` | `mongodb://localhost:27017/internship-tracker` | Database connection string | Must use MongoDB Atlas or managed service |
| `PORT` | `5000` | Server port | Use load balancer/reverse proxy in production |
| `NODE_ENV` | `development` | Environment mode | Set to `production` for production |
| `SKILL_DECAY_THRESHOLD` | `30` | Days before skill decay | Adjust based on business requirements |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` | Token signing key | **MUST generate strong random secret in production** |
| `JWT_EXPIRY` | `30m` | Token lifetime | Recommend `24h` for production |

### Critical Production Variables

⚠️ **JWT_SECRET** (MOST IMPORTANT)
- Used to sign and verify JWT tokens
- Must be cryptographically random and at least 32 characters
- Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never hardcode in code or commit to git
- Rotate periodically (requires re-authentication)

⚠️ **MONGODB_URI**
- Must use SSL/TLS encryption (`mongodb+srv://` protocol)
- Never use root credentials, create dedicated database user
- Connection string should not be visible in logs
- Enable IP whitelist in MongoDB Atlas

⚠️ **NODE_ENV**
- Set to `production` to enable production optimizations
- Affects error messages and logging verbosity

---

## Production Deployment

### Recommended Hosting Platforms

**Option 1: Heroku (Easiest)**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your-production-secret
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Option 2: AWS (EC2 + RDS)**
```bash
# 1. Launch EC2 instance (Ubuntu 20.04)
# 2. SSH into instance
# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone repository
git clone your-repo-url
cd Internship-Skill-Tracker-main/BackEnd

# 5. Install dependencies
npm install

# 6. Configure environment (.env file)
# 7. Use PM2 to manage process
npm install -g pm2
pm2 start server.js --name "skill-tracker"
pm2 startup
pm2 save
```

**Option 3: DigitalOcean (VPS)**
```bash
# Similar to AWS, use App Platform for managed deployment:
# 1. Push to GitHub
# 2. Connect GitHub to DigitalOcean
# 3. Set environment variables in dashboard
# 4. Deploy automatically
```

**Option 4: Docker + Container Service**
```bash
# Create Dockerfile in root:
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

# Deploy to:
# - AWS ECS
# - Google Cloud Run
# - Azure Container Instances
# - Railway.app
```

### Production Deployment Checklist

- [ ] Node.js 18+ installed on server
- [ ] MongoDB Atlas cluster created with IP whitelist
- [ ] `.env` file configured with production values
- [ ] `JWT_SECRET` generated with strong random string
- [ ] `NODE_ENV` set to `production`
- [ ] `MONGODB_URI` points to managed MongoDB service
- [ ] SSL/TLS certificate configured (use reverse proxy like Nginx)
- [ ] Process manager running (PM2, systemd, or container orchestration)
- [ ] Log aggregation service configured (Sentry, LogRocket, etc.)
- [ ] Database backups automated
- [ ] Rate limiting configured on API
- [ ] CORS properly configured for frontend domain
- [ ] Health checks configured on load balancer
- [ ] Monitoring and alerting setup
- [ ] Load testing completed
- [ ] Smoke tests run on production

---

## MongoDB Setup

### Local MongoDB Setup

**macOS (using Homebrew)**
```bash
brew install mongodb-community
brew services start mongodb-community
mongosh  # Connect to database
```

**Ubuntu/Linux**
```bash
sudo apt-get install -y mongodb
sudo service mongod start
mongosh
```

**Windows**
```bash
# Download installer from https://www.mongodb.com/try/download/community
# Run installer
# Start service:
net start MongoDB
```

### MongoDB Atlas (Cloud) Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (choose region closest to your deployment)
4. Whitelist IPs:
   - Local development: `127.0.0.1`
   - Production: Your server's static IP
5. Create database user with strong password
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/...`
7. Add to `.env` as `MONGODB_URI`

### Database Initialization

MongoDB collections are automatically created on first write. Collections created:
- `users` - User accounts and authentication
- `skills` - User technical skills with decay tracking
- `records` - Internships/certifications
- `_id_` (MongoDB internal)

---

## Security Checklist

### Code-Level Security ✓
- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens signed with secret key
- ✅ User isolation: All data filtered by `user_id`
- ✅ Input validation on all endpoints
- ✅ File uploads restricted to whitelisted types (jpg, jpeg, png, gif, pdf)
- ✅ File size limited to 5MB
- ✅ Filenames randomized with UUID (prevents guessing)

### Deployment Security

- [ ] `.env` file in `.gitignore` (never commit secrets)
- [ ] `.env.example` committed to git as template
- [ ] `JWT_SECRET` is random and strong (minimum 32 characters)
- [ ] `MONGODB_URI` uses SSL/TLS encryption
- [ ] CORS whitelist configured for frontend domain only
- [ ] Rate limiting implemented on public endpoints
- [ ] HTTPS/TLS enabled in production
- [ ] Database backups automated daily
- [ ] Database user has minimal required permissions
- [ ] Server logs don't expose sensitive data
- [ ] Dependencies kept up-to-date (`npm audit`)

### Infrastructure Security

- [ ] Firewall blocks unnecessary ports
- [ ] SSH key-based authentication (no passwords)
- [ ] Regular security patches applied
- [ ] Server behind reverse proxy (Nginx/Apache)
- [ ] DDoS protection (Cloudflare, AWS WAF)
- [ ] Monitoring and intrusion detection
- [ ] Offsite backup of critical data

---

## Troubleshooting

### "Cannot find module 'express'"
```bash
# Solution: Install dependencies
npm install
```

### "MongoDB connection refused"
```bash
# Solution: Start MongoDB
# macOS:
brew services start mongodb-community

# Linux:
sudo service mongod start

# Windows:
net start MongoDB
```

### "JWT_SECRET is undefined"
```bash
# Solution: Check .env file exists and has JWT_SECRET
cat .env  # Or type .env on Windows

# If .env doesn't exist:
cp .env.example .env
nano .env
```

### "Port 5000 already in use"
```bash
# Solution: Change port in .env or use different port
PORT=5001

# Or kill process using port:
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "MONGODB_URI connection timeout"
```bash
# Solution: Check if MongoDB is running and accessible
mongosh "your-mongodb-uri"

# If MongoDB Atlas: Check IP whitelist in dashboard
# Current IP: https://api.ipify.org
```

### "401 Unauthorized on protected endpoints"
```bash
# Solution: Include JWT token in Authorization header
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/v1/skills
```

### "npm ERR! code EACCES"
```bash
# Solution: Fix npm permissions
sudo npm install -g npm
# Or use nvm (Node Version Manager):
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm use 18
```

---

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/internship-tracker
JWT_SECRET=dev-secret-key-local-only
JWT_EXPIRY=30m
```

### Staging
```env
NODE_ENV=staging
PORT=5000
MONGODB_URI=mongodb+srv://staging_user:password@staging-cluster.mongodb.net/internship-tracker
JWT_SECRET=staging-secret-key-32-chars-minimum
JWT_EXPIRY=24h
```

### Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod_user:secure_password@prod-cluster.mongodb.net/internship-tracker
JWT_SECRET=production-secret-key-strong-random-32-chars
JWT_EXPIRY=24h
```

---

## Maintenance

### Regular Tasks

**Daily**
- Monitor error logs
- Check database size
- Review health endpoint: `/api/v1/health`

**Weekly**
- Run security audit: `npm audit`
- Update dependencies: `npm outdated`
- Database backup verification

**Monthly**
- Full security review
- Load testing
- Dependency updates: `npm update`

**Quarterly**
- Penetration testing
- JWT secret rotation (if compromised)
- Disaster recovery drill

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all to latest versions
npm update

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Additional Resources

- **Express.js Docs**: https://expressjs.com/
- **MongoDB Documentation**: https://docs.mongodb.com/
- **JWT Best Practices**: https://tools.ietf.org/html/rfc8725
- **Node.js Security**: https://nodejs.org/en/docs/guides/nodejs-security/
- **OWASP API Security**: https://owasp.org/www-project-api-security/

---

**Last Updated**: May 3, 2026
**Version**: 1.0.0
