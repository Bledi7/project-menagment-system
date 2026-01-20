# Migration Guide: Firebase Authentication → JWT

This guide explains the changes made when migrating from Firebase Authentication to JWT authentication.

## 🔄 Key Changes

### Authentication System

**Before (Firebase):**
- Firebase Admin SDK for token verification
- Firebase user creation/deletion
- Firebase token exchange for refresh tokens
- No refresh token storage in database

**After (JWT):**
- JWT (jsonwebtoken) for token generation and verification
- Custom JWT access tokens (15 min expiry)
- Refresh tokens stored in PostgreSQL (7 day expiry)
- Token refresh endpoint for rotating tokens

### Database Changes

**New Table: `refresh_tokens`**
```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Updated Schema:**
- Cards: Now directly reference sprints (removed sprint_cards join table)
- Cards: Added `description`, `status` (enum), `assignedTo` (FK to users)
- Sprints: Added `projectId` (FK to projects)

### Code Changes

1. **Removed Firebase Admin SDK** - No longer needed
2. **Added JWT utilities** - `src/utils/jwt.ts`
3. **Updated authentication middleware** - `src/middleware/auth.ts` now uses JWT
4. **New Auth controller** - `src/controllers/AuthController.ts` with JWT endpoints
5. **Updated all controllers** - Replaced Firebase auth with JWT middleware
6. **Updated Socket.io** - Uses JWT for authentication
7. **Added DTOs** - Zod schemas for request validation

## 📝 Migration Steps

### 1. Update Environment Variables

Remove Firebase-related variables:
```env
# Remove these:
FIREBASE_API_KEY=...
# serviceAccountKey.json file
```

Add JWT secrets:
```env
# Add these:
JWT_SECRET=your-super-secret-access-token-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-min-32-characters
```

### 2. Run Database Migrations

```bash
npm run migrate
```

This will create the `refresh_tokens` table and update existing tables.

### 3. Update Frontend

**Before:**
```javascript
// Firebase authentication
import { signInWithEmailAndPassword } from "firebase/auth";
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();

// API call
fetch("/api/login", {
  headers: {
    Authorization: idToken
  }
});
```

**After:**
```javascript
// JWT authentication
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
const { accessToken, refreshToken } = data;

// Store tokens
localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", refreshToken);

// API calls with access token
fetch("/api/users", {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});
```

### 4. Handle Token Refresh

```javascript
// Refresh token when access token expires
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  
  const { data } = await response.json();
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  
  return data.accessToken;
}

// Axios interceptor example
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newAccessToken = await refreshAccessToken();
      error.config.headers.Authorization = `Bearer ${newAccessToken}`;
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 5. Update Socket.io Client

**Before:**
```javascript
const socket = io("http://localhost:2000", {
  query: {
    userId: user.id
  }
});
```

**After:**
```javascript
const socket = io("http://localhost:2000", {
  auth: {
    token: accessToken  // JWT access token
  }
});
```

## 🔐 Token Lifecycle

1. **User logs in** → Server generates access token (15 min) + refresh token (7 days)
2. **Client stores both tokens**
3. **Client uses access token** for API requests
4. **Access token expires** → Client calls `/api/auth/refresh` with refresh token
5. **Server validates refresh token** → Issues new access token + new refresh token (rotation)
6. **User logs out** → Client calls `/api/auth/logout` → Server deletes refresh token

## 🛡️ Security Considerations

1. **JWT Secrets** - Use strong, random secrets (min 32 characters)
2. **HTTPS** - Always use HTTPS in production
3. **Token Storage** - Store tokens securely (httpOnly cookies recommended)
4. **Token Rotation** - Refresh tokens are rotated on each refresh
5. **Token Revocation** - Logout deletes refresh tokens from database

## ✅ Benefits of JWT Migration

1. **No External Dependencies** - No Firebase SDK needed
2. **Full Control** - Complete control over token lifecycle
3. **Database Integration** - Refresh tokens stored in PostgreSQL
4. **Better Performance** - No external API calls for token verification
5. **Flexibility** - Easy to customize token payload and expiry
6. **Cost Savings** - No Firebase usage costs

## 🔍 Testing

Test the migration:

1. **Register a new user** - `POST /api/auth/register`
2. **Login** - `POST /api/auth/login` (verify tokens are returned)
3. **Access protected route** - `GET /api/users` (verify JWT works)
4. **Refresh token** - `POST /api/auth/refresh` (verify new tokens)
5. **Logout** - `POST /api/auth/logout` (verify token is deleted)
6. **Socket.io** - Connect with JWT token (verify authentication)

## 📚 API Changes Summary

### New Endpoints
- `POST /api/auth/register` - Register with JWT
- `POST /api/auth/login` - Login with JWT
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (revoke refresh token)
- `GET /api/auth/me` - Get current user

### Removed Endpoints
- `POST /api/exchangeToken` - No longer needed (handled by `/api/auth/refresh`)

### Updated Endpoints
- All protected endpoints now require `Authorization: Bearer <access-token>` header
- All endpoints now return standardized responses with `success`, `message`, and `data` fields

---

**Migration Complete! 🎉**

Your backend now uses JWT authentication with full type safety and modern best practices.
