# Project Requirements & Dependencies

## System Requirements

### Minimum
- Node.js: 18.0.0+
- npm: 9.0.0+
- MongoDB: 4.4+
- RAM: 512MB
- Disk: 1GB

### Recommended for Production
- Node.js: 20.x LTS
- RAM: 2GB+
- Database: MongoDB Atlas (managed cloud service)
- Hosting: AWS, Heroku, DigitalOcean, or Azure

## npm Dependencies

All dependencies are defined in `package.json` and installed via `npm install`.

### Production Dependencies

```
bcryptjs@^2.4.3           - Password hashing library (10 salt rounds)
cors@^2.8.5               - Cross-origin resource sharing middleware
dotenv@^16.3.1            - Environment variable management
express@^4.18.2           - Web application framework
jsonwebtoken@^9.0.3       - JWT token creation and verification
mongoose@^8.0.0           - MongoDB ODM (Object Data Mapping)
multer@^2.1.1             - File upload middleware
node-cron@^3.0.2          - Task scheduler (skill decay job)
pdfkit@^0.18.0            - PDF document generation
uuid@^14.0.0              - Unique identifier generation
```

### Installation

```bash
npm install

# Verify installation
npm list

# Check for vulnerabilities
npm audit
```

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Fix security vulnerabilities
npm audit fix
```

## Database Requirements

### MongoDB Community (Local Development)
- Download: https://www.mongodb.com/try/download/community
- Supported versions: 4.4+
- Required for local development

### MongoDB Atlas (Cloud Production)
- Service: https://www.mongodb.com/cloud/atlas
- Free tier available
- Recommended for production deployments
- Requires IP whitelist configuration

## Environment Configuration

### Required Variables
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Token signing key (minimum 32 characters)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development, staging, production)
- `SKILL_DECAY_THRESHOLD` - Days before skill decay (default: 30)
- `JWT_EXPIRY` - Token lifetime (default: 30m)

### Development Environment
```env
MONGODB_URI=mongodb://localhost:27017/internship-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key
JWT_EXPIRY=30m
SKILL_DECAY_THRESHOLD=30
```

### Production Environment
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/internship-tracker
PORT=5000
NODE_ENV=production
JWT_SECRET=<strong-random-32-characters-minimum>
JWT_EXPIRY=24h
SKILL_DECAY_THRESHOLD=30
```

## Git & Version Control

### Repository Structure
```
Internship-Skill-Tracker/
├── BackEnd/                  # Node.js + Express API
│   ├── config/               # Configuration files
│   ├── controllers/          # Business logic
│   ├── middleware/           # Express middleware
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── jobs/                 # Scheduled tasks
│   ├── uploads/              # User file storage (gitignored)
│   ├── server.js             # Entry point
│   ├── package.json          # Dependencies
│   ├── .env.example          # Configuration template
│   ├── .gitignore            # Git ignore rules
│   └── *.md                  # Documentation
└── FrontEnd/                 # React + Vite frontend
    └── ...
```

### .gitignore Configuration

**MUST IGNORE** (never commit):
- `node_modules/` - Installed packages
- `.env` - Actual secrets
- `*.log` - Log files
- `dist/` - Build output
- `.DS_Store` - macOS system files
- `.vscode/` - Editor config
- `.idea/` - IDE config
- `uploads/` - User-uploaded files

**MUST COMMIT** (needed for new developers):
- `.env.example` - Configuration template
- `package.json` - Dependency list
- `package-lock.json` - Exact versions
- `.gitignore` - Ignore rules
- All source code and documentation

## Deployment Platforms

### Recommended Options (in order of ease)

1. **Heroku** ✅ (Easiest)
   - Platform-as-a-Service
   - Automatic deployment from GitHub
   - Free tier available (limited)
   - Perfect for learning/testing

2. **Railway.app** ✅ (Great UX)
   - Deploy from GitHub
   - Simple environment management
   - Good free tier

3. **Render** ✅ (Good alternative)
   - GitHub integration
   - Free static hosting + paid backend
   - Easy deployment

4. **AWS** (Most scalable)
   - EC2 for compute
   - RDS for database
   - More complex setup
   - Pay-as-you-go pricing

5. **DigitalOcean** (Best value)
   - Affordable droplets
   - App Platform for managed deployment
   - Simple setup

6. **Docker** (Most portable)
   - Containerize application
   - Deploy to any container service
   - AWS ECS, Google Cloud Run, etc.

## Development Tools

### Recommended Tools
- **Code Editor**: VS Code (free)
- **Git Client**: Git (command line) or GitHub Desktop
- **Database Client**: MongoDB Compass (free)
- **API Testing**: Postman or Insomnia
- **Version Control**: GitHub

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier Code Formatter
- Thunder Client (API testing)
- MongoDB for VS Code

## Testing Requirements

### Manual Testing
```bash
# Health check
curl http://localhost:5000/api/v1/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get skills (with JWT token)
curl http://localhost:5000/api/v1/skills \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Tools
- **Postman** - API testing (https://www.postman.com/)
- **Insomnia** - REST client (https://insomnia.rest/)
- **Thunder Client** - VS Code extension

## Security Requirements

### Code Level
- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens signed with secret key
- ✅ User data isolation by user_id
- ✅ Input validation on all endpoints
- ✅ File uploads restricted and validated

### Deployment Level
- [ ] HTTPS/TLS enabled
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] MongoDB SSL/TLS connection
- [ ] Regular security updates (`npm audit fix`)
- [ ] Database backups automated
- [ ] Secrets in environment variables only
- [ ] CORS whitelist configured

## Maintenance Schedule

### Daily
- Monitor logs
- Check server health endpoint

### Weekly
- Security audit: `npm audit`
- Review dependencies: `npm outdated`

### Monthly
- Update dependencies: `npm update`
- Full security review

### Quarterly
- Penetration testing
- Disaster recovery testing

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Quick start guide |
| `DEPLOYMENT.md` | Production deployment checklist |
| `API_DOCUMENTATION.md` | All endpoints with examples |
| `ARCHITECTURE.md` | System design and flows |
| `PUSH_TO_GIT.md` | Git setup and push instructions |
| `PHASE_4_FINAL_REPORT.md` | Latest features documentation |

## Useful Commands

```bash
# Development
npm start              # Run server
npm run dev           # Run with auto-reload

# Dependencies
npm install           # Install all packages
npm update            # Update packages
npm audit             # Security check
npm audit fix         # Fix vulnerabilities

# Git
git init              # Initialize git
git add .             # Stage files
git commit -m "msg"   # Commit changes
git push              # Push to GitHub

# MongoDB
mongosh               # Connect to local MongoDB
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install` |
| MongoDB connection failed | Start MongoDB service |
| JWT_SECRET undefined | Check `.env` file exists |
| Port 5000 in use | Change PORT in `.env` or kill process |
| Permission denied (git) | Use Personal Access Token or SSH key |

For detailed troubleshooting, see `DEPLOYMENT.md`

## Support & Resources

- **Node.js Docs**: https://nodejs.org/docs/
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **JWT**: https://jwt.io/
- **Git**: https://git-scm.com/doc

---

**Last Updated**: May 3, 2026
**Version**: 1.0.0
