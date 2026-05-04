#  Complete How to Run Guide

## ✅ PROJECT STATUS: FULLY VERIFIED & READY TO RUN

All 4 developmental phases have been implemented, tested, and verified working correctly:
- ✅ **Phase 1**: Server Bootstrap & Database (MongoDB connection, CRUD routes)
- ✅ **Phase 2**: JWT Authentication (30-min token expiry, password hashing)
- ✅ **Phase 3**: User Data Access Control & File Uploads (ownership validation, static file serving)
- ✅ **Phase 4 Task 4.1**: Analytics with Decay Rates (0.0-1.0 decay calculation)
- ✅ **Phase 4 Task 4.2**: PDF Portfolio Export (PDFKit generation)
- ✅ **Skill Decay Scheduler**: Daily job runs at midnight
- ✅ **Frontend-Backend Integration**: Full API client with all 17 endpoints

---

##  PREREQUISITES

Before starting the application, ensure you have:

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
  - Verify: `node --version` should show v18.0.0 or higher
- **MongoDB** 4.4+ ([Download](https://www.mongodb.com/try/download/community))
  - Verify: `mongod --version` should show version 4.4 or higher
- **npm** 9+ (comes with Node.js)
  - Verify: `npm --version` should show v9.0.0 or higher

### System Requirements
- **Available Ports**: 5000 (Backend), 5173 (Frontend)
- **RAM**: Minimum 1GB available
- **Disk Space**: Minimum 1GB for node_modules

### Check Prerequisites
```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB
mongod --version

# Test MongoDB connection (optional)
mongo --eval "db.version()"
```

---

##  QUICK START (5 Minutes)

### Step 1: Navigate to Project Directory
```bash
cd "c:\Users\vedhb\Downloads\Internship-Skill-Tracker-main (1)\Internship-Skill-Tracker-main"
```

### Step 2: Start Backend (Terminal 1)
```bash
cd BackEnd
npm start
```

**Expected Output:**
```
🔌 Connecting to MongoDB...
✅ MongoDB connected successfully
📅 Skill decay job scheduled to run daily at midnight
🚀 Server running on http://localhost:5000
📊 Health check: http://localhost:5000/api/v1/health
🗂️  MongoDB: mongodb://localhost:27017/internship-tracker
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd FrontEnd
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Open Application
```
Open browser: http://localhost:5173
```

---

##  DETAILED SETUP INSTRUCTIONS

### Complete Setup with Dependencies Installation

#### **Step 1: Verify MongoDB is Running**

**Option A: Windows (Installed as Service)**
```bash
# MongoDB should be running as a service automatically
# To verify, open Services app and search for "MongoDB"
```

**Option B: Windows (Manual Start)**
```bash
# Start MongoDB server (replace with your installation path)
"C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath "C:\data\db"

# Or if you have MongoDB installed via WSL:
wsl mongod --dbpath /data/db
```

**Option C: Verify Connection**
```bash
# Test MongoDB is accessible
curl http://localhost:27017

# Should return something like:
# It looks like you are trying to access MongoDB over HTTP on the native driver port.
```

#### **Step 2: Backend Setup**

**2a. Navigate to Backend Directory**
```bash
cd "c:\Users\vedhb\Downloads\Internship-Skill-Tracker-main (1)\Internship-Skill-Tracker-main\BackEnd"
```

**2b. Create Environment File**
```bash
# Copy .env.example to .env
cp .env.example .env

# Or manually create .env with these contents:
# MONGODB_URI=mongodb://localhost:27017/internship-tracker
# PORT=5000
# NODE_ENV=development
# SKILL_DECAY_THRESHOLD=30
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# JWT_EXPIRY=30m
```

**2c. Install Dependencies**
```bash
npm install
```

**2d. Start Backend Server**
```bash
npm start

# Or for development with hot reload:
npm run dev
```

#### **Step 3: Frontend Setup**

**3a. Navigate to Frontend Directory (New Terminal)**
```bash
cd "c:\Users\vedhb\Downloads\Internship-Skill-Tracker-main (1)\Internship-Skill-Tracker-main\FrontEnd"
```

**3b. Create Environment File**
```bash
# The .env.local should already exist with:
# VITE_API_URL=http://localhost:5000
# VITE_APP_ENV=development

# If it doesn't exist, create it:
# Note: Use backslashes on Windows or forward slashes
```

**3c. Install Dependencies**
```bash
npm install
```

**3d. Start Development Server**
```bash
npm run dev
```

**3e. Open in Browser**
```
Navigate to: http://localhost:5173
```

---

##  TESTING CHECKLIST

After starting both backend and frontend, verify functionality:

### Test 1: Access Application
- [ ] Open http://localhost:5173
- [ ] **Expected**: Login page loads without errors
- [ ] **Expected**: Console has no React errors

### Test 2: Authentication
- [ ] Click "Sign Up"
- [ ] Enter: Email, Password, Name
- [ ] Click "Create Account"
- [ ] **Expected**: Account created, redirected to dashboard
- [ ] **Expected**: localStorage shows JWT token

### Test 3: Skills Management
- [ ] Navigate to "Skills" page
- [ ] Click "Add Skill"
- [ ] Enter: Skill Name (e.g., "React"), Level (e.g., 4)
- [ ] Click "Add"
- [ ] **Expected**: Skill appears in list with today's date

### Test 4: Internship Records
- [ ] Navigate to "Internships"
- [ ] Click "Add Internship"
- [ ] Fill: Title, Company, Start Date, End Date
- [ ] Click "Create"
- [ ] **Expected**: Record appears in list

### Test 5: Analytics & Decay
- [ ] Navigate to "Analytics"
- [ ] **Expected**: See all skills with decay rates
- [ ] **Expected**: New skills show decay_rate ≈ 0.0 or 0.01
- [ ] **Expected**: See summary stats (Average Decay, Skills Decaying)

### Test 6: PDF Export
- [ ] Navigate to "Export Portfolio"
- [ ] Click "Export as PDF"
- [ ] **Expected**: PDF downloads with your data

### Test 7: File Upload
- [ ] Navigate to "Evidence Vault"
- [ ] Click "Upload File"
- [ ] Select JPG, PNG, or PDF
- [ ] **Expected**: File uploads and appears in vault

### Test 8: Backend Health Check
```bash
# In a new terminal, test the health endpoint
curl http://localhost:5000/api/v1/health

# Expected response (200 OK):
# {"status":"ok","timestamp":"2026-05-04T10:00:00.000Z","environment":"development"}
```

---

##  API ENDPOINTS (17 Total)

### Authentication (Public)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/register` | Create new account |
| POST | `/api/v1/auth/login` | Login & receive JWT |

### Protected Routes (Require JWT Token)

#### Users
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/users/profile` | Get user profile |
| PUT | `/api/v1/users/profile` | Update user profile |

#### Skills
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/skills` | Get user's skills |
| POST | `/api/v1/skills` | Create new skill |
| PUT | `/api/v1/skills/:id` | Update skill |
| DELETE | `/api/v1/skills/:id` | Delete skill |

#### Records (Internships/Certifications)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/records` | Get user's records |
| POST | `/api/v1/records` | Create new record |
| PUT | `/api/v1/records/:id` | Update record |
| DELETE | `/api/v1/records/:id` | Delete record |

#### Evidence Vault
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/evidence` | Upload file |
| GET | `/uploads/:filename` | Download file |

#### Analytics
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/analytics` | Get decay analytics |

#### Portfolio
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/portfolio/export` | Export portfolio as PDF |

### Server Status
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/health` | Check server status |

---

## 📁 PROJECT STRUCTURE

```
Internship-Skill-Tracker/
│
├── BackEnd/
│   ├── config/
│   │   ├── database.js          (MongoDB connection)
│   │   └── constants.js         (Configuration values)
│   ├── controllers/
│   │   └── authController.js    (Auth logic)
│   ├── middleware/
│   │   └── authMiddleware.js    (JWT verification)
│   ├── models/
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── Record.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js              (POST /auth/register, login)
│   │   ├── skills.js            (CRUD skills)
│   │   ├── records.js           (CRUD records)
│   │   ├── users.js             (User profile)
│   │   ├── evidence.js          (File upload)
│   │   ├── analytics.js         (Decay analytics)
│   │   ├── portfolio.js         (PDF export)
│   │   └── index.js             (Mount all routes)
│   ├── jobs/
│   │   └── skillDecayJob.js     (Daily decay scheduler)
│   ├── uploads/                 (User uploaded files)
│   ├── .env                     (Environment variables)
│   ├── .env.example             (Template)
│   ├── .gitignore               (Git ignore rules)
│   ├── package.json
│   ├── server.js                (Main entry point)
│   └── README.md
│
├── FrontEnd/
│   ├── src/
│   │   ├── services/
│   │   │   └── apiClient.ts     (HTTP client with auth)
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  (Global auth state)
│   │   ├── hooks/
│   │   │   ├── useSkills.ts     (Fetch skills)
│   │   │   ├── useRecords.ts    (Fetch records)
│   │   │   ├── useAnalytics.ts  (Fetch analytics)
│   │   │   └── index.ts         (Export hooks)
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Internships.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Export.tsx
│   │   │   └── ... (other components)
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── tailwind.css
│   │   │   └── theme.css
│   │   ├── main.tsx             (Entry point)
│   │   └── App.tsx
│   ├── .env.local               (Development config)
│   ├── .env.example             (Template)
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
└── HOW_TO_RUN.md               (This file)
```

---

##  ENVIRONMENT CONFIGURATION

### Backend (.env file)

**Location**: `BackEnd/.env`

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/internship-tracker

# Server Configuration
PORT=5000
NODE_ENV=development

# Decay Configuration (in days)
# Scheduler job runs daily at midnight
# Skills not updated within this period are marked as "decaying"
SKILL_DECAY_THRESHOLD=30

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=30m
```

### Frontend (.env.local file)

**Location**: `FrontEnd/.env.local`

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000

# Application Environment
VITE_APP_ENV=development
```

---

##  TROUBLESHOOTING

### Issue 1: MongoDB Connection Failed
**Error**: `MongooseError: getaddrinfo ENOTFOUND localhost`

**Solution**:
1. Ensure MongoDB is running
2. Check connection string in `.env` file
3. Try: `mongod --dbpath "C:\data\db"`

### Issue 2: Port 5000 Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID {PID} /F

# Or change PORT in .env file
```

### Issue 3: JWT Token Invalid
**Error**: `Unauthorized - Invalid token`

**Solution**:
1. Clear browser storage: DevTools → Application → Storage → Clear Site Data
2. Log out and log back in
3. Ensure `JWT_SECRET` in `.env` is consistent

### Issue 4: Frontend Cannot Connect to Backend
**Error**: `Failed to fetch from http://localhost:5000/...`

**Solution**:
1. Verify backend is running: Open http://localhost:5000/api/v1/health
2. Check VITE_API_URL in `FrontEnd/.env.local`
3. Check CORS is enabled in server.js
4. Try: `curl http://localhost:5000/api/v1/health`

### Issue 5: npm install Fails
**Error**: `npm ERR! code ERESOLVE` or `npm ERR! FETCH failed`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Retry install
npm install

# Or use legacy peer deps:
npm install --legacy-peer-deps
```

### Issue 6: Frontend npm start Fails
**Error**: `error when starting dev server: Error: ENOENT: no such file or directory`

**Solution**:
1. Ensure you're in FrontEnd directory
2. Delete `node_modules` and `package-lock.json`
3. Run: `npm install` again

### Issue 7: File Upload Fails
**Error**: `Error uploading file: ENOENT: no such file or directory, open 'uploads/...`

**Solution**:
1. Create `BackEnd/uploads` folder manually
2. Ensure file size < 5MB
3. Ensure file type is: jpg, jpeg, png, gif, or pdf

---

##  PRODUCTION DEPLOYMENT

### Pre-Deployment Checklist
- [ ] Update `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Set `MONGODB_URI` to production database
- [ ] Build frontend: `npm run build`
- [ ] Test all endpoints with production values
- [ ] Enable HTTPS for frontend
- [ ] Setup CORS with specific allowed origins

### Frontend Build
```bash
cd FrontEnd
npm run build

# Output will be in: FrontEnd/dist/
# Upload dist/ folder to hosting service
```

### Backend Deployment Options
- **Heroku**: `git push heroku main`
- **AWS Lambda**: Convert to serverless with AWS SDK
- **Docker**: Use Dockerfile for containerization
- **DigitalOcean**: Deploy via SSH and PM2

---

##  PHASE IMPLEMENTATION SUMMARY

### Phase 1: Server Bootstrap & Database ✅
- Express server on port 5000
- MongoDB connection with Mongoose
- CORS middleware
- Static file serving for uploads
- Health check endpoint

### Phase 2: JWT Authentication ✅
- User registration with email/password
- User login with JWT generation
- 30-minute token expiry
- Password hashing with bcryptjs
- Bearer token in Authorization header

### Phase 3: User Data Access Control & File Uploads ✅
- Ownership validation on all routes
- JWT-based user isolation
- File upload with multer (5MB limit)
- File type whitelist (jpg/jpeg/png/gif/pdf)
- Static file serving for downloads

### Phase 4 Task 4.1: Analytics with Decay Rates ✅
- Decay formula: `min(days_since_practiced / 90, 1.0)`
- Decay rates from 0.0 (fresh) to 1.0 (stale)
- Summary statistics (average decay, decaying skills)
- All calculations performed server-side

### Phase 4 Task 4.2: PDF Portfolio Export ✅
- PDFKit-based PDF generation
- Includes user name, bio, records, skills
- Proper HTTP headers for download
- User isolation (can only export own portfolio)

### Skill Decay Scheduler ✅
- Cron job running daily at midnight
- Identifies skills not updated within threshold
- Logs decaying skills to console
- Configurable threshold via `SKILL_DECAY_THRESHOLD`

### Frontend Integration ✅
- Centralized API client with auto token injection
- Global auth context for state management
- Custom hooks for data fetching (useSkills, useRecords, useAnalytics)
- Automatic redirect on 403 responses
- Environment-based configuration

---

##  WHAT YOU CAN DO WITH THIS APPLICATION

✅ **Create and manage skills** with levels and tracking dates
✅ **Record internships and certifications** with dates and organizations
✅ **Track skill decay** with automated daily scheduler and analytics
✅ **Calculate decay rates** based on practice frequency (0.0-1.0 scale)
✅ **Upload evidence files** (images, PDFs) to vault
✅ **Export portfolio** as professional PDF
✅ **Secure authentication** with JWT tokens
✅ **User data isolation** - each user sees only their data
✅ **Real-time analytics** with decay statistics

---

##  QUICK REFERENCE

### Most Common Commands

**Start Backend**
```bash
cd BackEnd && npm start
```

**Start Frontend**
```bash
cd FrontEnd && npm run dev
```

**Build Frontend for Production**
```bash
cd FrontEnd && npm run build
```

**Install Dependencies**
```bash
npm install
```

**Test Health Endpoint**
```bash
curl http://localhost:5000/api/v1/health
```

**View MongoDB Data**
```bash
# Connect to MongoDB
mongo

# Select database
use internship-tracker

# View users
db.users.find()

# View skills
db.skills.find()
```

---

##  YOU'RE ALL SET!

The application is fully implemented, tested, and ready to run. Follow the **Quick Start** section above to get started in 5 minutes.
 
 
 
 ## FAQ

**Q: Is my resume data private?**
A: 100%. Your file stays on your device. It's sent to OpenAI for analysis, but OpenAI doesn't store it (API request, not chat history). Never stored server-side.

**Q: Can I run this offline?**
A: The PDF parsing is client-side (works offline), but AI analysis requires an API key and internet. Future version could use local LLMs (Ollama) for completely offline operation.

**Questions?** Check the troubleshooting section or review the implementation files listed in the project structure.

**Last Verified**: May 4, 2026
**Status**: ✅ All phases complete and working
**Ready to Deploy**: Yes

Happy tracking! 🎉
