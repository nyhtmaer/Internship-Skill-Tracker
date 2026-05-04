# Frontend-Backend Integration Guide

## Setup

The frontend is fully connected to the backend via a centralized API client. All backend communication is routed through the API service layer.

### Environment Configuration

**Development (`.env.local`)**
```env
VITE_API_URL=http://localhost:5000
```

**Production (`.env.production`)**
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## Architecture

### 1. API Client (`src/services/apiClient.ts`)
- Centralized HTTP client for all backend calls
- Handles JWT authentication automatically
- Manages token storage in `localStorage`
- Automatic session expiry handling — redirects to `/login` on 403

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)
- Manages user state globally across the app
- Provides `useAuth()` hook for any component
- Handles login, register, and logout operations
- Persists user session across page refreshes

### 3. Custom Hooks (`src/hooks/`)
| Hook | Purpose |
|------|---------|
| `useSkills()` | CRUD operations for skills with automatic fetching |
| `useRecords()` | CRUD operations for internships/certifications |
| `useAnalytics()` | Fetch skill decay rate analytics |

> **Key Design Decision:** All data-fetching logic is encapsulated in custom hooks to keep components clean and promote reusability across pages.

---

## Usage Examples

### Authentication

```tsx
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (email, password) => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
    </form>
  );
}
```

### Fetching Skills

```tsx
import { useSkills } from '../hooks';

function SkillsComponent() {
  const { skills, isLoading, error, addSkill, deleteSkill } = useSkills();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {skills.map(skill => (
        <div key={skill._id}>
          <span>{skill.skill_name}</span>
          <button onClick={() => deleteSkill(skill._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Uploading Evidence

```tsx
import { apiClient } from '../services/apiClient';

function EvidenceUpload() {
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('linked_to', 'React');

    try {
      const response = await apiClient.uploadEvidence(formData);
      console.log('Upload successful:', response);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => handleFileUpload(e.target.files?.[0])}
    />
  );
}
```

### Exporting Portfolio PDF

```tsx
function ExportComponent() {
  const handleExportPDF = async () => {
    try {
      const blob = await apiClient.exportPortfolioPDF();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.pdf';
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return <button onClick={handleExportPDF}>Export PDF</button>;
}
```

### Fetching Analytics

```tsx
import { useAnalytics } from '../hooks';

function AnalyticsComponent() {
  const { analytics, isLoading, error } = useAnalytics();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analytics) return <div>No data</div>;

  return (
    <div>
      <h2>Skill Decay Rates</h2>
      {analytics.data.map(skill => (
        <div key={skill._id}>
          <span>{skill.skill_name}</span>
          <span>Decay Rate: {(skill.decay_rate * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}
```

---

## API Endpoints Integrated

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login user |
| `GET` | `/api/v1/health` | Server health check |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/skills` | Get all user's skills |
| `POST` | `/api/v1/skills` | Add new skill |
| `PUT` | `/api/v1/skills/{id}` | Update skill |
| `DELETE` | `/api/v1/skills/{id}` | Delete skill |

### Records (Internships / Certifications)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/records` | Get all records |
| `POST` | `/api/v1/records` | Add new record |
| `PUT` | `/api/v1/records/{id}` | Update record |
| `DELETE` | `/api/v1/records/{id}` | Delete record |

### Evidence
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/evidence` | Upload file evidence |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/analytics` | Get skill decay analytics |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/portfolio/export` | Download portfolio as PDF |

---

## Token Management

Tokens are automatically stored in `localStorage` under the key `authToken`. On every API call:

1. Token is read from `localStorage`
2. Attached as `Authorization: Bearer {token}` header
3. If the response returns `403` (token expired), the user is logged out and redirected to login

---

## Error Handling

All API calls return standardized responses:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

| Field | Meaning |
|-------|---------|
| `success: true` | Operation successful — check `data` field |
| `success: false` | Operation failed — check `message` or `error` field |

Errors throw exceptions which can be caught with `try-catch`.

---

## Starting Development

1. **Start backend** (in `BackEnd/` folder):
   ```bash
   npm run dev
   # or
   npm start
   ```

2. **Start frontend** (in `FrontEnd/` folder):
   ```bash
   npm run dev
   ```

3. **Build frontend**:
   ```bash
   npm run build
   ```

The frontend will connect to `http://localhost:5000` automatically in development.

---

## Production Deployment

1. Set `VITE_API_URL` to your backend domain via environment variable:
   ```bash
   VITE_API_URL=https://api.yourdomain.com npm run build
   ```

2. Or create `.env.production`:
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

3. Build:
   ```bash
   npm run build
   ```

4. Deploy the `dist/` folder to your hosting provider.
