# API Documentation - Internship Skill Tracker

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Public Endpoints

### 1. Health Check
**Endpoint**: `GET /health`

**Description**: Check if server is running and responsive

**Response (200 OK)**:
```json
{
  "status": "ok",
  "timestamp": "2026-05-03T12:34:56.789Z",
  "environment": "development"
}
```

---

### 2. User Registration
**Endpoint**: `POST /auth/register`

**Description**: Create a new user account and receive JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe",
  "bio": "Software developer interested in web technologies"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "Software developer interested in web technologies",
    "role": "student",
    "createdAt": "2026-05-03T12:34:56.789Z",
    "updatedAt": "2026-05-03T12:34:56.789Z"
  }
}
```

**Error Responses**:
- **400 Bad Request**: Missing fields or invalid email format
- **409 Conflict**: Email already exists

---

### 3. User Login
**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "Software developer interested in web technologies",
    "role": "student"
  }
}
```

**Error Responses**:
- **400 Bad Request**: Missing email or password
- **401 Unauthorized**: Invalid credentials

---

## Protected Endpoints

### Skills Management

#### 4. Get User Skills
**Endpoint**: `GET /skills`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Description**: Get all skills for authenticated user with decay status

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "skill_name": "javascript",
      "skill_level": 4,
      "last_updated": "2026-04-28T10:30:00.000Z",
      "decay_status": {
        "days_since_practiced": 5,
        "is_decaying": false,
        "decay_threshold": 30
      },
      "createdAt": "2026-04-20T08:15:30.000Z",
      "updatedAt": "2026-04-28T10:30:00.000Z"
    }
  ]
}
```

#### 5. Create Skill
**Endpoint**: `POST /skills`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Request Body**:
```json
{
  "skill_name": "TypeScript",
  "skill_level": 3
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439011",
    "skill_name": "typescript",
    "skill_level": 3,
    "last_updated": "2026-05-03T12:34:56.789Z",
    "decay_status": {
      "days_since_practiced": 0,
      "is_decaying": false,
      "decay_threshold": 30
    },
    "createdAt": "2026-05-03T12:34:56.789Z",
    "updatedAt": "2026-05-03T12:34:56.789Z"
  }
}
```

**Validation**:
- `skill_name`: Required, will be converted to lowercase
- `skill_level`: Required, must be 1-5

**Error Responses**:
- **400 Bad Request**: Missing skill_name or skill_level
- **400 Bad Request**: skill_level not between 1-5

#### 6. Update Skill
**Endpoint**: `PUT /skills/:id`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Request Body**:
```json
{
  "skill_level": 5
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439011",
    "skill_name": "typescript",
    "skill_level": 5,
    "last_updated": "2026-05-03T12:40:00.000Z",
    "decay_status": {
      "days_since_practiced": 0,
      "is_decaying": false,
      "decay_threshold": 30
    }
  }
}
```

**Note**: Updating skill_level also updates `last_updated` timestamp (refreshes decay counter)

#### 7. Delete Skill
**Endpoint**: `DELETE /skills/:id`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

---

### Records Management (Internships/Certifications)

#### 8. Get User Records
**Endpoint**: `GET /records`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Description**: Get all professional records (internships/certifications)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "user_id": "507f1f77bcf86cd799439011",
      "type": "internship",
      "title": "Frontend Developer Intern",
      "organization": "Tech Corp",
      "start_date": "2026-06-01T00:00:00.000Z",
      "end_date": "2026-08-31T00:00:00.000Z",
      "description": "Developed React components for e-commerce platform",
      "linked_skills": ["507f1f77bcf86cd799439012"],
      "evidence_file": "a1b2c3d4.pdf",
      "createdAt": "2026-05-03T12:34:56.789Z",
      "updatedAt": "2026-05-03T12:34:56.789Z"
    }
  ]
}
```

#### 9. Create Record
**Endpoint**: `POST /records`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Request Body**:
```json
{
  "type": "internship",
  "title": "Full Stack Developer Internship",
  "organization": "Startup Inc",
  "start_date": "2026-06-15",
  "end_date": "2026-08-15",
  "description": "Developed full stack web application",
  "linked_skills": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "user_id": "507f1f77bcf86cd799439011",
    "type": "internship",
    "title": "Full Stack Developer Internship",
    "organization": "Startup Inc",
    "start_date": "2026-06-15T00:00:00.000Z",
    "end_date": "2026-08-15T00:00:00.000Z",
    "description": "Developed full stack web application",
    "linked_skills": [
      "507f1f77bcf86cd799439012",
      "507f1f77bcf86cd799439013"
    ],
    "evidence_file": null,
    "createdAt": "2026-05-03T12:45:30.000Z",
    "updatedAt": "2026-05-03T12:45:30.000Z"
  }
}
```

**Validation**:
- `type`: Required, must be "internship" or "certification"
- `title`: Required
- `organization`: Required
- `start_date`: Required, ISO 8601 format
- `end_date`: Optional
- `linked_skills`: Optional array of skill IDs

#### 10. Update Record
**Endpoint**: `PUT /records/:id`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Request Body**: Same as Create Record (all fields optional)

#### 11. Delete Record
**Endpoint**: `DELETE /records/:id`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

---

### User Profile Management

#### 12. Get User Profile
**Endpoint**: `GET /users/profile`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "Software developer interested in web technologies",
    "role": "student",
    "createdAt": "2026-05-03T12:34:56.789Z",
    "updatedAt": "2026-05-03T12:34:56.789Z"
  }
}
```

#### 13. Update User Profile
**Endpoint**: `PUT /users/profile`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Request Body**:
```json
{
  "name": "John Doe Updated",
  "bio": "Full stack developer with 2 years experience"
}
```

**Response (200 OK)**: Updated user object

---

### File Management

#### 14. Upload File
**Endpoint**: `POST /evidence`

**Headers**: 
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Request Body** (multipart/form-data):
- `file`: File to upload (jpg, jpeg, png, gif, pdf only)

**File Restrictions**:
- Maximum size: 5MB
- Allowed formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.pdf`

**Response (201 Created)**:
```json
{
  "success": true,
  "filename": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6.pdf"
}
```

**Note**: Store filename in record's `evidence_file` field for later reference

#### 15. Download Uploaded File
**Endpoint**: `GET /uploads/:filename`

**Description**: No authentication required (public static file serving)

**Response (200 OK)**: Binary file data

**Example**: `GET /uploads/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6.pdf`

---

### Analytics & Exports

#### 16. Get Skill Analytics
**Endpoint**: `GET /analytics`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Description**: Get skill decay rates and analytics summary

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "skill_name": "javascript",
      "skill_level": 4,
      "last_updated": "2026-04-20T10:30:00.000Z",
      "decay_rate": 0.28,
      "days_since_practiced": 25
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "skill_name": "typescript",
      "skill_level": 3,
      "last_updated": "2026-04-01T08:00:00.000Z",
      "decay_rate": 0.67,
      "days_since_practiced": 60
    }
  ],
  "summary": {
    "total_skills": 2,
    "decaying_skills": 1,
    "average_decay_rate": 0.475
  }
}
```

**Decay Rate Calculation**:
- Formula: `decay_rate = min(days_since_practiced / 90, 1.0)`
- **0.0 - 0.3**: Skill actively practiced (< 27 days)
- **0.3 - 0.7**: Skill moderately aged (27-63 days)
- **0.7 - 1.0**: Skill significantly aged (63-90+ days)
- **1.0**: Skill fully decayed (90+ days)

#### 17. Export Portfolio as PDF
**Endpoint**: `GET /portfolio/export`

**Headers**: `Authorization: Bearer <JWT_TOKEN>`

**Description**: Generate downloadable PDF portfolio with profile and records

**Response (200 OK)**:
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="portfolio.pdf"`
- Body: Binary PDF file

**PDF Contents**:
- User name (header)
- User bio (if available)
- Professional Records:
  - Type (Internship/Certification)
  - Title, Organization
  - Start/End dates (MM/DD/YYYY format)
  - Description
  - Linked skills
- Skills with proficiency ratings (●●●○○ format)
- Footer with generation timestamp

**Example CURL**:
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:5000/api/v1/portfolio/export \
  -o portfolio.pdf
```

---

## Error Codes & Messages

### Authentication Errors (403 Forbidden)
```json
{
  "error": "Missing or invalid Authorization header",
  "status": 403
}
```

```json
{
  "error": "Token has expired",
  "status": 403
}
```

```json
{
  "error": "Invalid token",
  "status": 403
}
```

### Validation Errors (400 Bad Request)
```json
{
  "error": "skill_name and skill_level are required",
  "status": 400
}
```

```json
{
  "error": "skill_level must be between 1 and 5",
  "status": 400
}
```

### Not Found Errors (404)
```json
{
  "error": "Skill not found",
  "status": 404
}
```

```json
{
  "error": "User not found",
  "status": 404
}
```

### Server Errors (500)
```json
{
  "error": "Internal server error",
  "status": 500
}
```

---

## Rate Limiting

Currently **not implemented**. Recommended for production:
- Authentication endpoints: 5 requests per minute per IP
- General API: 100 requests per minute per user
- File uploads: 10 requests per minute per user

---

## Pagination

Currently **not implemented**. For large datasets, recommend:
- `/skills?page=1&limit=20`
- `/records?page=1&limit=10`
- `/analytics?page=1&limit=50`

---

## CORS Configuration

Default CORS allows all origins. For production, configure specific domains:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

---

## Testing Endpoints with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "bio": "Test bio"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Skills (with JWT)
```bash
curl -X GET http://localhost:5000/api/v1/skills \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Skill
```bash
curl -X POST http://localhost:5000/api/v1/skills \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skill_name": "React",
    "skill_level": 4
  }'
```

### Upload File
```bash
curl -X POST http://localhost:5000/api/v1/evidence \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

### Export Portfolio
```bash
curl -X GET http://localhost:5000/api/v1/portfolio/export \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o portfolio.pdf
```

---

**API Documentation Version**: 1.0
**Last Updated**: May 3, 2026
**Status**: Current
