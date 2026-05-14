# Frontend-Backend Connection Guide

## Connection Status

✅ **Frontend is configured to connect to Backend**

- **Backend URL**: `http://localhost:8080`
- **Frontend URL**: `http://localhost:5173`
- **CORS**: Configured for localhost:5173

## API Configuration

### Frontend API Setup (`src/api/api.js`)
```javascript
const api = axios.create({ baseURL: "http://localhost:8080" });
```

- Automatically adds JWT token to all requests
- Handles 401 errors (redirects to login)
- All API calls use this centralized instance

### Backend CORS (`CorsConfig.java`)
```java
config.setAllowedOrigins(List.of("http://localhost:5173"));
```

## How to Start

### 1. Start Backend (Port 8080)
```bash
cd IQAC_Backend-main
mvnw spring-boot:run
```

**Prerequisites:**
- Set environment variables: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`
- MySQL database running

### 2. Start Frontend (Port 5173)
```bash
cd IQAC_Frontend-main
npm install
npm run dev
```

### 3. Access Application
Open browser: `http://localhost:5173`

## API Endpoints Used by Frontend

### Authentication
- `POST /iqac/auth/login` - Login with username/password
- `POST /iqac/auth/change-password` - Change password

### IQAC Coordinator Dashboard
- `GET /iqac/coordinator/me` - Get coordinator profile
- `GET /iqac/department` - Get all departments
- `GET /iqac/faculty` - Get all faculties
- `GET /iqac/academics/planning/ccm/members` - Get CCM members
- `GET /iqac/academics/planning/cocm/members` - Get COCM members
- `GET /iqac/academics/planning/incharge` - Get class incharges
- `GET /iqac/academics/planning/mentor` - Get class mentors
- `GET /iqac/academics/planning/lesson-plan` - Get lesson plans
- `GET /iqac/academics/planning/materials` - Get materials
- `GET /iqac/academics/planning/e-resources` - Get e-resources
- `GET /iqac/academics/planning/video-lectures` - Get video lectures

### Faculty Dashboard
- `GET /iqac/faculty/me` - Get faculty profile
- `GET /iqac/academics/planning/lesson-plan/my` - Get my lesson plans
- `GET /iqac/academics/planning/materials/my` - Get my materials
- `GET /iqac/academics/planning/e-resources/my` - Get my e-resources
- `GET /iqac/academics/planning/video-lectures/my` - Get my video lectures

### HOD Dashboard
- `GET /iqac/hod/me` - Get HOD profile
- `GET /iqac/faculty` - Get department faculties
- `GET /iqac/academics/planning/lesson-plan` - Get lesson plans
- `PUT /iqac/academics/planning/lesson-plan/{id}/approve` - Approve lesson plan
- `PUT /iqac/academics/planning/lesson-plan/{id}/reject` - Reject lesson plan

## Testing Connection

### Method 1: Browser Console
Open browser console (F12) and run:
```javascript
fetch('http://localhost:8080/iqac/department')
  .then(r => r.json())
  .then(d => console.log('Backend connected:', d))
  .catch(e => console.error('Backend error:', e));
```

### Method 2: Using Test Utility
```javascript
import { testConnection } from './utils/testConnection';
testConnection();
```

### Method 3: Login Test
1. Go to `http://localhost:5173`
2. Enter credentials
3. Click Login
4. Check browser console for connection status

## Troubleshooting

### Error: "Network Error" or "ERR_NETWORK"
**Cause**: Backend not running
**Solution**: Start backend on port 8080

### Error: "CORS policy"
**Cause**: Frontend running on different port
**Solution**: Ensure frontend is on port 5173 or update CorsConfig.java

### Error: "401 Unauthorized"
**Cause**: Invalid or expired token
**Solution**: Login again to get new token

### Error: "Connection refused"
**Cause**: Backend not started or wrong port
**Solution**: 
- Check backend is running: `netstat -ano | findstr :8080`
- Verify application.properties doesn't override port

### Error: "Database connection failed"
**Cause**: MySQL not running or wrong credentials
**Solution**: 
- Start MySQL service
- Verify environment variables are set correctly

## Environment Variables Required

```bash
DB_URL=jdbc:mysql://localhost:3306/iqac_db
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_minimum_256_bits
```

## Request Flow

1. **User Login**
   - Frontend sends POST to `/iqac/auth/login`
   - Backend validates credentials
   - Returns JWT token + user role
   - Frontend stores token in localStorage

2. **Authenticated Requests**
   - Frontend adds `Authorization: Bearer <token>` header
   - Backend validates token via JwtFilter
   - Returns requested data

3. **Token Expiry**
   - Backend returns 401
   - Frontend intercepts and redirects to login

## API Response Format

### Success Response
```json
{
  "data": [...],
  "message": "Success"
}
```

### Error Response
```json
{
  "message": "Error description",
  "status": 400
}
```

## Next Steps

1. ✅ Backend configured with CORS
2. ✅ Frontend API client configured
3. ✅ Login endpoint integrated
4. ✅ JWT token handling implemented
5. ✅ All dashboard endpoints mapped

**The frontend is fully connected to the backend REST API!**
