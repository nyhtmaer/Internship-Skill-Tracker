# Internship Skill Tracker - Backend API

A comprehensive Node.js + Express + MongoDB REST API for managing internship portfolios, tracking professional skills, automating skill decay analysis, and exporting professional portfolios as PDF documents.

## 🎯 Overview

The Internship Skill Tracker backend provides a complete solution for students to:
- **Manage Portfolio**: Track internships, certifications, and professional experiences
- **Track Skills**: Log and rate technical skills (1-5 proficiency levels)
- **Monitor Decay**: Automatic daily analysis of skill freshness/recency
- **Export Portfolio**: Generate professional PDF portfolios for job applications

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (ES Modules support)
- **MongoDB** 4.4+ (local or cloud)
- **npm** or **yarn** package manager

### Installation

1. **Clone and Install**
```bash
cd BackEnd
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration (see Configuration section below)
```

3. **Start MongoDB** (if using local)
```bash
# macOS:
brew services start mongodb-community

# Linux:
sudo service mongod start

# Windows:
mongod
```

4. **Start Server**
```bash
npm start
# Server runs on http://localhost:5000
# Health check: http://localhost:5000/api/v1/health
```

### Development Mode (with auto-restart)
```bash
npm run dev
# Hot reload enabled - changes apply automatically
```

---

## 📋 Configuration

Edit `.env` file with your settings:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/internship-tracker

# Server Configuration
PORT=5000
NODE_ENV=development

# Decay Configuration (in days)
SKILL_DECAY_THRESHOLD=30

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=30m
```

**Important Notes**:
- `.env`: Local configuration file (DO NOT commit to git) ✋
- `.env.example`: Template for team members (commit to git) ✅
- **JWT_SECRET**: Use a strong random string in production
- **MONGODB_URI**: For production, use managed MongoDB service

---

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete endpoint reference with examples
- **[Architecture](./ARCHITECTURE.md)** - System design, data flows, and security
- **[Deployment Guide](./DEPLOYMENT.md)** - Production setup, security checklist, troubleshooting
- **[Push to GitHub](./PUSH_TO_GIT.md)** - Complete guide to push code to your repository
- **[PHASE_4_FINAL_REPORT.md](./PHASE_4_FINAL_REPORT.md)** - Implementation details of latest features

---

## 🔧 API Endpoints

### Authentication (Public)
```
POST   /api/v1/auth/register       - Register new user
POST   /api/v1/auth/login          - Login and receive JWT
GET    /api/v1/health              - Server health check
```

### Skills Management (Protected)
```
GET    /api/v1/skills              - Get user's skills with decay status
POST   /api/v1/skills              - Create new skill
PUT    /api/v1/skills/:id          - Update skill proficiency
DELETE /api/v1/skills/:id          - Delete skill
```

### Records Management (Protected)
```
GET    /api/v1/records             - Get internships/certifications
POST   /api/v1/records             - Create new record
PUT    /api/v1/records/:id         - Update record
DELETE /api/v1/records/:id         - Delete record
```

### User Profile (Protected)
```
GET    /api/v1/users/profile       - Get user profile
PUT    /api/v1/users/profile       - Update profile
```

### File Management (Protected)
```
POST   /api/v1/evidence            - Upload file (image/PDF)
GET    /uploads/:filename          - Download uploaded file
```

### Analytics & Export (Protected)
```
GET    /api/v1/analytics           - Get skill decay analytics
GET    /api/v1/portfolio/export    - Export portfolio as PDF
```

For complete endpoint documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token
1. Call `POST /auth/register` or `POST /auth/login`
2. Receive JWT token in response
3. Include in Authorization header for protected requests
4. Token expires after 30 minutes (configurable)

---

## 📊 Key Features

### 1. **Skill Management**
- Track technical skills with proficiency levels (1-5)
- Automatic last_updated timestamp
- Decay status calculation based on SKILL_DECAY_THRESHOLD

### 2. **Skill Decay Monitoring**
- Daily automated job runs at midnight
- Identifies skills not practiced within threshold period (default: 30 days)
- Daily analytics endpoint shows decay_rate (0.0-1.0) for each skill:
  - **0.0**: Skill actively practiced
  - **0.5**: Moderately aged
  - **1.0**: Fully decayed (90+ days)

### 3. **Professional Records**
- Log internships and certifications with:
  - Company/Organization name
  - Position title
  - Start and end dates
  - Description of work/achievements
  - Link to related skills
  - Evidence file attachment

### 4. **File Upload Management**
- Upload evidence files (certificates, screenshots, etc.)
- Supported formats: jpg, jpeg, png, gif, pdf
- Maximum file size: 5MB
- Files stored with UUID names (secure, non-guessable)
- Static file serving from `/uploads` directory

### 5. **Portfolio PDF Export**
- Generate professional PDF portfolio
- Includes: name, bio, professional records, skill ratings
- Skill proficiency shown as visual rating (●●●○○)
- Formatted dates and clear sections
- Download-ready file

### 6. **Analytics Dashboard**
- Decay rate calculation for all skills
- Summary statistics:
  - Total skills count
  - Number of decaying skills (decay_rate > 0.5)
  - Average decay rate across portfolio
- Useful for identifying skills needing practice

---

## 🏗️ Project Structure

```
BackEnd/
├── config/
│   └── database.js              # MongoDB connection setup
├── controllers/
│   └── authController.js        # Auth logic
├── middleware/
│   └── authMiddleware.js        # JWT verification
├── models/
│   ├── User.js                  # User schema
│   ├── Skill.js                 # Skill schema
│   ├── Record.js                # Record schema
│   └── index.js                 # Model exports
├── routes/
│   ├── index.js                 # Route orchestration
│   ├── auth.js                  # Auth endpoints
│   ├── skills.js                # Skill endpoints
│   ├── records.js               # Record endpoints
│   ├── users.js                 # User profile endpoints
│   ├── evidence.js              # File upload endpoints
│   ├── analytics.js             # Analytics endpoints
│   └── portfolio.js             # PDF export endpoints
├── jobs/
│   └── skillDecayJob.js         # Scheduled decay check job
├── uploads/                     # Uploaded files (git ignored)
├── server.js                    # Express app & startup
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── API_DOCUMENTATION.md         # Complete API reference
├── ARCHITECTURE.md              # System design & architecture
└── README.md                    # This file
```

---

## 🔄 Data Models

### User
```javascript
{
  email: String (unique),
  password_hash: String (hashed),
  name: String,
  bio: String,
  role: String (default: 'student'),
  createdAt: Date,
  updatedAt: Date
}
```

### Skill
```javascript
{
  user_id: ObjectId (ref: User),
  skill_name: String (lowercase),
  skill_level: Number (1-5),
  last_updated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Record
```javascript
{
  user_id: ObjectId (ref: User),
  type: String (enum: ['internship', 'certification']),
  title: String,
  organization: String,
  start_date: Date,
  end_date: Date (optional),
  description: String,
  linked_skills: [ObjectId] (ref: Skill array),
  evidence_file: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing

### Manual API Testing with cURL

**Register User**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Get Skills (requires JWT)**
```bash
curl -X GET http://localhost:5000/api/v1/skills \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Skill**
```bash
curl -X POST http://localhost:5000/api/v1/skills \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"skill_name": "React", "skill_level": 4}'
```

**Export Portfolio PDF**
```bash
curl -X GET http://localhost:5000/api/v1/portfolio/export \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o portfolio.pdf
```

---

## 🛡️ Security Features

### Authentication
- JWT tokens with 30-minute expiry
- Bearer token format in Authorization header
- Token expiry and invalid token detection

### Authorization
- User isolation: All queries filtered by authenticated user's ID
- Cannot access other users' data
- User_id extracted from JWT (not from request body)

### Data Protection
- Passwords hashed with bcryptjs (10 salt rounds)
- Password hash never returned in responses
- MongoDB injection prevention via Mongoose schemas

### File Security
- Whitelist file types (jpg, jpeg, png, gif, pdf)
- 5MB file size limit
- UUID-generated filenames (not user-provided)
- Prevents directory traversal attacks

### Validation
- Email format validation
- Skill level range validation (1-5)
- Enum validation for record types
- Required field validation

---

## 📈 Performance

### Database Queries
- **Time Complexity**: O(n) where n = user's records count
- **Response Time**: Typical 50-200ms per request
- **Caching**: Currently not cached (opportunity for improvement)

### File Operations
- **Upload Speed**: Depends on file size and network
- **PDF Generation**: 100-200ms for typical portfolio
- **Memory**: PDF streamed to response (efficient)

### Scaling Recommendations
- Add Redis caching for analytics endpoint
- Implement pagination for large skill/record lists
- Use database indexes on frequently queried fields
- Consider horizontal scaling with load balancer

---

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET` (use random generator)
- [ ] Configure `MONGODB_URI` to production database
- [ ] Update `JWT_EXPIRY` for security (recommend 1h)
- [ ] Set appropriate `SKILL_DECAY_THRESHOLD`
- [ ] Enable CORS for specific domains only
- [ ] Set up error logging service (Sentry, DataDog)
- [ ] Use process manager (PM2, systemd)
- [ ] Enable HTTPS (reverse proxy: nginx)
- [ ] Configure database backups
- [ ] Monitor server logs and performance

### Deployment Platforms
- **Heroku**: `git push heroku main` (free tier available)
- **Railway**: Connect GitHub repo for auto-deploy
- **DigitalOcean**: Deploy with App Platform
- **AWS**: EC2 + RDS for MongoDB Atlas
- **Google Cloud**: App Engine or Compute Engine

---

## 📋 Dependencies

### Core
- `express` 4.18.2 - Web framework
- `mongoose` 8.0.0 - MongoDB ODM
- `dotenv` 16.3.1 - Environment configuration

### Security
- `jsonwebtoken` 9.0.3 - JWT authentication
- `bcryptjs` 2.4.3 - Password hashing

### File Handling
- `multer` 2.1.1 - File upload middleware
- `uuid` 14.0.0 - UUID generation

### Utilities
- `cors` 2.8.5 - CORS middleware
- `node-cron` 3.0.2 - Scheduled jobs

### PDF Export
- `pdfkit` 0.18.0 - PDF document generation

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
**Error**: `❌ MongoDB connection failed`
- Check MongoDB is running: `mongod`
- Verify MONGODB_URI in .env
- For MongoDB Atlas, check whitelist IP address

### JWT Authentication Failed
**Error**: `{"error": "Invalid token", "status": 403}`
- Ensure Authorization header format: `Bearer <token>`
- Check token hasn't expired (30 min default)
- Verify JWT_SECRET matches server config

### File Upload Failed
**Error**: `{"error": "Only jpg, jpeg, png, gif, and pdf files are allowed"}`
- Verify file type is whitelisted
- Check file size < 5MB
- Ensure `/uploads` directory exists and is writable

### Skill Decay Job Not Running
**Error**: No decay job logs in console
- Verify server started successfully
- Check NODE_ENV is set
- Job runs daily at midnight UTC
- Check application logs for errors

---

## 📞 Support & Contributing

### Getting Help
1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Check error messages for specific guidance

### Reporting Issues
Include:
- Error message and stack trace
- Steps to reproduce
- Environment details (Node version, OS, MongoDB)
- Relevant logs or screenshots

---

## 📝 License

MIT License - Feel free to use this project for educational and commercial purposes.

---

## 🎉 Features in Development

- [ ] Advanced analytics (trends, velocity, predictions)
- [ ] Rate limiting on endpoints
- [ ] Pagination for large datasets
- [ ] OAuth2 / Social login
- [ ] Two-factor authentication
- [ ] Portfolio sharing/public links
- [ ] Skill recommendations based on decay
- [ ] Multiple export formats (JSON, CSV)
- [ ] Redis caching

---

**Backend Version**: 1.0.0
**Last Updated**: May 3, 2026
**Status**: Production Ready ✅
**Framework**: Node.js + Express + MongoDB
**Authentication**: JWT + bcryptjs
