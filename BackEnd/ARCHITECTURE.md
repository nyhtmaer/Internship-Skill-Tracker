# Backend Architecture - Internship Skill Tracker

## System Overview

The Internship Skill Tracker backend is a **Node.js + Express + MongoDB** REST API that manages user portfolios, skills, professional records, and automated skill decay tracking.

### Technology Stack
- **Runtime**: Node.js (ES Modules support)
- **Framework**: Express 4.18.2
- **Database**: MongoDB with Mongoose ODM 8.0.0
- **Authentication**: JWT (30-minute token expiry)
- **Security**: bcryptjs for password hashing (10 salt rounds)
- **File Uploads**: Multer (5MB size limit, format whitelist)
- **PDF Generation**: PDFKit library
- **Scheduling**: Node-cron (runs daily skill decay job)

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│         Express Server (PORT 5000)          │
├─────────────────────────────────────────────┤
│  Middleware Layer                           │
│  ├─ CORS                                    │
│  ├─ JSON Parser                             │
│  ├─ Static File Serving (/uploads)          │
│  └─ JWT Authentication (requireAuth)        │
├─────────────────────────────────────────────┤
│  Route Layer (API Endpoints)                │
│  ├─ /auth (register, login)                 │
│  ├─ /skills (CRUD operations)               │
│  ├─ /records (internships/certifications)   │
│  ├─ /users (profile management)             │
│  ├─ /evidence (file uploads)                │
│  ├─ /analytics (skill decay analysis)       │
│  └─ /portfolio (PDF export)                 │
├─────────────────────────────────────────────┤
│  Controller/Logic Layer                     │
│  ├─ Auth Logic (register, login, JWT)       │
│  ├─ Skill Management                        │
│  ├─ Record Management                       │
│  └─ Analytics Calculations                  │
├─────────────────────────────────────────────┤
│  Data Models Layer (Mongoose Schemas)       │
│  ├─ User (email, password, profile)         │
│  ├─ Skill (name, level, last_updated)       │
│  └─ Record (internship/cert, dates, org)    │
├─────────────────────────────────────────────┤
│  Database Layer (MongoDB)                   │
│  └─ Collections: users, skills, records     │
└─────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Registration Flow
```
POST /api/v1/auth/register
├─ Receive: email, password, name, bio
├─ Validate: email format, password length
├─ Hash Password: bcryptjs (10 salt rounds)
├─ Create User: Save to MongoDB
├─ Generate JWT: user_id in payload (30min expiry)
└─ Return: User object + token
```

### 2. Authenticated Request Flow
```
GET /api/v1/skills
├─ Headers: Authorization: Bearer <JWT_TOKEN>
├─ Middleware: requireAuth
│  ├─ Extract token from "Bearer {token}"
│  ├─ Verify JWT signature
│  ├─ Extract user_id from payload
│  └─ Attach to req.user.user_id
├─ Route Handler:
│  ├─ Query: Skill.find({ user_id: req.user.user_id })
│  ├─ Calculate: Decay status for each skill
│  └─ Return: Filtered user skills
└─ Response: Array of skills with metadata
```

### 3. Skill Decay Flow
```
Daily Cron Job (0 0 * * * - Midnight)
├─ Query: Skills where last_updated < (now - THRESHOLD)
├─ THRESHOLD: 30 days (configurable via env)
├─ For each decaying skill:
│  └─ Log: skill_name, user email, days old
├─ Report: Total decaying skills found
└─ Continue: Job runs again tomorrow
```

### 4. PDF Export Flow
```
GET /api/v1/portfolio/export
├─ Fetch: User profile data
├─ Fetch: All records (populated with linked skills)
├─ Fetch: All user skills
├─ Generate PDF:
│  ├─ Header: User name (24pt, bold)
│  ├─ Bio: User biography (12pt)
│  ├─ Records: Type, title, org, dates, description
│  ├─ Skills: Name with proficiency rating (●●●○○)
│  └─ Footer: Generation timestamp
├─ Stream: PDF to response (memory efficient)
└─ Headers: Content-Type: application/pdf
            Content-Disposition: attachment
```

---

## Security Architecture

### 1. Authentication Layer

- **JWT Tokens**:
  - Payload structure: `{ user_id, iat, exp }`
  - Secret key: `process.env.JWT_SECRET` (required)
  - Token expiry: 30 minutes
  - Token format: Bearer token sent in Authorization header

- **Password Security**:
  - Hashed using bcryptjs (10 salt rounds)
  - Excluded from queries (`select: false`)
  - Verified on login using `.comparePassword()` method

### 2. Authorization Layer

- **User Isolation**:
  - All protected routes require valid JWT token
  - `req.user.user_id` extracted from decoded token
  - All database queries filtered by: `{ user_id: req.user.user_id }`
  - Users cannot access or modify other users' data

- **HTTP Status Codes**:
  - 403: Missing token, invalid token, or token expired
  - 404: Resource not found or does not belong to authenticated user
  - 401: General authentication failure (fallback)
### 3. File Upload Security
- **Type Whitelist**: jpg, jpeg, png, gif, pdf only
- **Size Limit**: 5MB per file
- **Filename**: UUID-generated (not user-provided)
- **Storage**: `/uploads` directory with static serving
- **Path Security**: Multer prevents directory traversal

### 4. Data Validation
- **Email**: Regex validation + lowercase enforcement
- **Skill Level**: 1-5 range enforced in schema
- **Dates**: ISO 8601 format, optional end_date
- **Enums**: Record type must be 'internship' or 'certification'

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password_hash: String (select: false, hashed),
  name: String (required),
  bio: String (optional),
  role: String (enum: ['student', 'admin'], default: 'student'),
  createdAt: Date,
  updatedAt: Date
}
```

### Skill Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  skill_name: String (lowercase),
  skill_level: Number (1-5),
  last_updated: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

### Record Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  type: String (enum: ['internship', 'certification']),
  title: String,
  organization: String,
  start_date: Date,
  end_date: Date (optional),
  description: String (optional),
  linked_skills: [ObjectId] (ref: Skill array),
  evidence_file: String (filename or URL, optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Configuration

### Required Variables (.env.example → .env)
```
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

### Configuration Notes
- **MONGODB_URI**: Default: localhost (change for production)
- **PORT**: Default: 5000 (can be overridden)
- **NODE_ENV**: development (set to production for deployments)
- **SKILL_DECAY_THRESHOLD**: Days before skill marked as decaying (30 days)
- **JWT_SECRET**: MUST be changed in production (never commit actual secret)
- **JWT_EXPIRY**: Token lifetime (30m = 30 minutes)

---

## API Endpoints Summary

### Public Endpoints (No Authentication)
- `POST /api/v1/health` - Server health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Protected Endpoints (JWT Required)

#### Skills Management
- `GET /api/v1/skills` - Get user's skills with decay status
- `POST /api/v1/skills` - Create skill
- `PUT /api/v1/skills/:id` - Update skill
- `DELETE /api/v1/skills/:id` - Delete skill

#### Records Management
- `GET /api/v1/records` - Get user's professional records
- `POST /api/v1/records` - Create record (internship/cert)
- `PUT /api/v1/records/:id` - Update record
- `DELETE /api/v1/records/:id` - Delete record

#### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

#### File Management
- `POST /api/v1/evidence` - Upload file (image/pdf)
- `GET /uploads/:filename` - Serve uploaded file (static)

#### Analytics & Export
- `GET /api/v1/analytics` - Get skill decay analytics
- `GET /api/v1/portfolio/export` - Export portfolio as PDF

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Human-readable error message",
  "status": 400
}
```

### HTTP Status Codes Used
- **200**: OK (successful GET/PUT)
- **201**: Created (POST successful)
- **400**: Bad Request (validation error)
- **403**: Forbidden (missing/invalid JWT)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (unhandled exception)

### JWT Error Handling
- `TokenExpiredError`: 403 with "Token has expired"
- `JsonWebTokenError`: 403 with "Invalid token"
- Missing Authorization header: 403 with "Missing or invalid Authorization header"

---

## Scheduled Jobs

### Skill Decay Job
- **Schedule**: Every day at 00:00 (midnight)
- **Cron Expression**: `0 0 * * *`
- **Function**: Find skills not updated in SKILL_DECAY_THRESHOLD days
- **Action**: Log to console (informational, no data modification)
- **Logs**:
  - 🔄 Running skill decay check...
  - ⚠️ Found X decaying skills (if any)
  - ✅ No decaying skills found (if none)
  - ✅ Skill decay check completed

---

## Performance Considerations

### Query Optimization
- Indexes on: user_id (all collections), email (users)
- Sorting applied: skill_name ascending, start_date descending
- Mongoose `.select(false)` for password_hash (performance)

### Memory Efficiency
- PDF streaming via `doc.pipe(res)` (not buffered)
- File uploads handled with multer streams
- Limit on concurrent file size: 5MB

### Database Connection
- Connection pooling handled by Mongoose
- Graceful shutdown on connection failure
- Retry logic in initial connection

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `MONGODB_URI` to production database
- [ ] Generate strong `JWT_SECRET` (use random string generator)
- [ ] Update `JWT_EXPIRY` if needed (recommended: 1h for production)
- [ ] Set appropriate `SKILL_DECAY_THRESHOLD`
- [ ] Ensure `/uploads` directory writable
- [ ] Configure CORS origins for production domain
- [ ] Set up error logging (Sentry, DataDog, etc.)
- [ ] Enable HTTPS (reverse proxy: nginx, Apache)
- [ ] Set up database backups
- [ ] Configure process manager (PM2, systemd)
- [ ] Monitor disk space for uploads

---

## Development Workflow

### Local Setup
```bash
npm install
cp .env.example .env  # Create .env from template
npm start             # Start server
```

### Development Mode with File Watching
```bash
npm run dev           # Uses --watch flag for auto-restart
```

### Testing
```bash
# Run API tests against http://localhost:5000
node test-file-upload.js  # File upload functionality
```

---

## Future Enhancements

1. **Advanced Analytics**:
   - Skill usage trends over time
   - Learning velocity analysis
   - Predicted skill decay timeline

2. **Portfolio Features**:
   - Multiple export formats (JSON, CSV)
   - Portfolio templates (different layouts)
   - Public/shareable portfolio links

3. **Security Enhancements**:
   - Rate limiting on auth endpoints
   - Two-factor authentication
   - OAuth2 / Social login

4. **Performance Improvements**:
   - Redis caching for analytics
   - Database query result caching
   - Batch operations for bulk imports

5. **Integrations**:
   - GitHub profile sync
   - LinkedIn profile import
   - Calendar API for deadline reminders

---

**Architecture Document Version**: 1.0
**Last Updated**: May 3, 2026
**Framework**: Express.js + MongoDB
**Status**: Production Ready
