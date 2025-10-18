# JWT Authentication System

This document explains the JWT authentication system implemented for the Eco Roots Bloom backend.

## Features

### 🔐 Authentication Features

- **JWT-based authentication** with access and refresh tokens
- **Cookie-based token storage** for enhanced security
- **Role-based access control** (USER/ADMIN)
- **Token refresh mechanism** for seamless user experience
- **Password reset functionality** (email integration ready)
- **Secure logout** with cookie clearing

### 🛡️ Security Features

- **HttpOnly cookies** to prevent XSS attacks
- **Secure cookies** in production (HTTPS only)
- **SameSite strict** to prevent CSRF attacks
- **Short-lived access tokens** (15 minutes)
- **Long-lived refresh tokens** (7 days)
- **Password hashing** with bcrypt
- **Input validation** with Zod schemas

## API Endpoints

### Public Endpoints

```
POST /api/auth/register          - Register new user
POST /api/auth/login             - User login
POST /api/auth/admin/login       - Admin-specific login
POST /api/auth/logout            - Logout user
POST /api/auth/refresh           - Refresh access token
POST /api/auth/forgot-password   - Request password reset
POST /api/auth/reset-password    - Reset password with token
```

### Protected Endpoints

```
GET    /api/auth/profile         - Get user profile
PATCH  /api/auth/profile         - Update user profile
PATCH  /api/auth/change-password - Change password
```

### Admin Endpoints

```
GET    /api/admin/dashboard      - Admin dashboard stats
GET    /api/admin/users          - Get all users
PATCH  /api/admin/users/:id/role - Update user role
GET    /api/admin/trees          - Get all trees
POST   /api/admin/trees          - Create new tree
PUT    /api/admin/trees/:id      - Update tree
DELETE /api/admin/trees/:id      - Delete tree
GET    /api/admin/orders         - Get all orders
PATCH  /api/admin/orders/:id     - Update order status
GET    /api/admin/requests       - Get all service requests
PATCH  /api/admin/requests/:id   - Update request status
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eco_roots_bloom"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Copy the environment variables above to your `.env` file.

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Database Migrations

```bash
npm run prisma:migrate
```

### 5. Seed the Database

```bash
npm run prisma:seed
```

This will create:

- Admin user: `admin@ecoroots.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- Sample trees, orders, and service requests

### 6. Start the Server

```bash
npm run dev
```

## Testing the Authentication System

### Run the Test Script

```bash
node test-auth.js
```

This will test:

- User registration
- User login
- Admin login
- Profile access
- Admin dashboard access
- Token refresh
- Logout
- Protected route access
- Invalid credentials
- Role-based access control

### Manual Testing with cURL

#### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "mobile": "+91-9876543210"
  }' \
  -c cookies.txt
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

#### Access protected route

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -b cookies.txt
```

#### Admin login

```bash
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecoroots.com",
    "password": "admin123"
  }' \
  -c admin-cookies.txt
```

#### Access admin dashboard

```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -b admin-cookies.txt
```

## Token Structure

### Access Token (15 minutes)

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "USER",
  "type": "access",
  "iat": 1234567890,
  "exp": 1234567980
}
```

### Refresh Token (7 days)

```json
{
  "id": "user-id",
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1235170290
}
```

## Cookie Configuration

### Access Token Cookie

- **Name**: `accessToken`
- **HttpOnly**: `true`
- **Secure**: `true` (in production)
- **SameSite**: `strict`
- **MaxAge**: 15 minutes
- **Path**: `/`

### Refresh Token Cookie

- **Name**: `refreshToken`
- **HttpOnly**: `true`
- **Secure**: `true` (in production)
- **SameSite**: `strict`
- **MaxAge**: 7 days
- **Path**: `/api/auth/refresh`

## Security Considerations

1. **Never store sensitive data in JWT tokens**
2. **Use strong, unique JWT secrets**
3. **Rotate JWT secrets periodically**
4. **Monitor for token abuse**
5. **Implement rate limiting for auth endpoints**
6. **Use HTTPS in production**
7. **Consider implementing token blacklisting for logout**

## Frontend Integration

The frontend should:

1. Send requests with `credentials: 'include'`
2. Handle 401 responses by redirecting to login
3. Implement automatic token refresh
4. Clear cookies on logout

Example axios configuration:

```javascript
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
```

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure `FRONTEND_URL` is set correctly
2. **Cookie not set**: Check if `withCredentials: true` is set
3. **Token expired**: Implement automatic refresh
4. **Admin access denied**: Verify user role is 'ADMIN'

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages and logs.
