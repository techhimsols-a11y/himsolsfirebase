# API Documentation

## Overview

The Eco Roots Bloom API follows RESTful principles and uses JSON for request and response bodies. All endpoints are prefixed with `/api`.

## Authentication

### JWT Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Register User

```http
POST /api/auth/register
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "token": "jwt_token"
    }
  }
}
```

#### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "token": "jwt_token"
    }
  }
}
```

## Trees

### Endpoints

#### List Trees

```http
GET /api/trees
```

Query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Category name
- `search`: Search term
- `sort`: Sort field
- `order`: Sort order (asc/desc)

Response:

```json
{
  "status": "success",
  "data": {
    "trees": [
      {
        "id": "uuid",
        "name": "Tree Name",
        "description": "Tree Description",
        "price": 99.99,
        "stock": 50,
        "imageUrl": "https://example.com/image.jpg",
        "category": "Category Name",
        "scientificName": "Scientific Name",
        "growthTime": "2-3 years",
        "height": "10-15 meters",
        "benefits": ["Benefit 1", "Benefit 2"]
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

#### Get Tree

```http
GET /api/trees/:id
```

Response:

```json
{
  "status": "success",
  "data": {
    "tree": {
      "id": "uuid",
      "name": "Tree Name",
      "description": "Tree Description",
      "price": 99.99,
      "stock": 50,
      "imageUrl": "https://example.com/image.jpg",
      "category": "Category Name",
      "scientificName": "Scientific Name",
      "growthTime": "2-3 years",
      "height": "10-15 meters",
      "benefits": ["Benefit 1", "Benefit 2"]
    }
  }
}
```

## Cart

### Cart Token

All cart operations require a cart token in the `X-Cart-Token` header:

```
X-Cart-Token: <cart_token>
```

### Endpoints

#### Get Cart

```http
GET /api/cart/:cartToken
```

Response:

```json
{
  "status": "success",
  "data": {
    "cart": {
      "id": "uuid",
      "token": "cart_token",
      "items": [
        {
          "id": "uuid",
          "quantity": 2,
          "tree": {
            "id": "uuid",
            "name": "Tree Name",
            "description": "Tree Description",
            "price": 99.99,
            "imageUrl": "https://example.com/image.jpg",
            "category": "Category Name",
            "scientificName": "Scientific Name",
            "growthTime": "2-3 years",
            "height": "10-15 meters",
            "benefits": ["Benefit 1", "Benefit 2"]
          }
        }
      ]
    }
  }
}
```

#### Add Item to Cart

```http
POST /api/cart/:cartToken/items
```

Request body:

```json
{
  "treeId": "uuid",
  "quantity": 2
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "cartItem": {
      "id": "uuid",
      "quantity": 2,
      "tree": {
        "id": "uuid",
        "name": "Tree Name",
        "price": 99.99
      }
    }
  }
}
```

#### Update Cart Item

```http
PUT /api/cart/:cartToken/items/:itemId
```

Request body:

```json
{
  "quantity": 3
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "cartItem": {
      "id": "uuid",
      "quantity": 3,
      "tree": {
        "id": "uuid",
        "name": "Tree Name",
        "price": 99.99
      }
    }
  }
}
```

#### Remove Item from Cart

```http
DELETE /api/cart/:cartToken/items/:itemId
```

Response:

```json
{
  "status": "success",
  "message": "Item removed from cart"
}
```

#### Clear Cart

```http
DELETE /api/cart/:cartToken
```

Response:

```json
{
  "status": "success",
  "message": "Cart cleared"
}
```

## Service Requests

### Endpoints

#### Create Service Request

```http
POST /api/service-requests
```

Request body:

```json
{
  "serviceType": "planting",
  "address": "123 Main St",
  "pincode": "123456",
  "preferredDate": "2024-06-15",
  "notes": "Additional instructions"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "serviceRequest": {
      "id": "uuid",
      "serviceType": "planting",
      "status": "pending",
      "address": "123 Main St",
      "pincode": "123456",
      "preferredDate": "2024-06-15",
      "notes": "Additional instructions",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Get Service Request

```http
GET /api/service-requests/:id
```

Response:

```json
{
  "status": "success",
  "data": {
    "serviceRequest": {
      "id": "uuid",
      "serviceType": "planting",
      "status": "pending",
      "address": "123 Main St",
      "pincode": "123456",
      "preferredDate": "2024-06-15",
      "notes": "Additional instructions",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### List Service Requests

```http
GET /api/service-requests
```

Query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `serviceType`: Filter by service type

Response:

```json
{
  "status": "success",
  "data": {
    "serviceRequests": [
      {
        "id": "uuid",
        "serviceType": "planting",
        "status": "pending",
        "address": "123 Main St",
        "pincode": "123456",
        "preferredDate": "2024-06-15",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

## Status

### Endpoints

#### Get System Status

```http
GET /api/status
```

Response:

```json
{
  "serverStatus": "online",
  "uptime": 123456,
  "environment": "development",
  "memoryUsage": "45.23",
  "cpuUsage": "2.5",
  "dbStatus": "online",
  "dbLastSync": "2024-01-01T00:00:00Z",
  "dbConnections": 5
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "status": "error",
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:

- `INVALID_REQUEST`: Invalid request parameters
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

🌱 Eco-Roots-Bloom API Endpoints
🔐 Authentication Routes (/auth)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register new user | ❌ |
| POST | /auth/login | User login | ❌ |
| POST | /auth/admin/login | Admin login | ❌ |
| POST | /auth/logout | User logout | ❌ |
| POST | /auth/refresh | Refresh access token | ❌ |
| POST | /auth/forgot-password | Request password reset | ❌ |
| POST | /auth/reset-password | Reset password | ❌ |
| PATCH | /auth/change-password | Change password | ✅ |
| GET | /auth/profile | Get user profile | ✅ |
| PATCH | /auth/profile | Update user profile | ✅ |
�� Tree Routes (/trees)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /trees | Get all trees (public) | ❌ |
| GET | /trees/:id | Get tree by ID (public) | ❌ |
| POST | /trees | Create new tree | ✅ |
| PATCH | /trees/:id | Update tree | ✅ |
| DELETE | /trees/:id | Delete tree | ✅ |
�� Cart Routes (/cart)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /cart | Create new cart | ❌ |
| GET | /cart/:token | Get cart by token | ❌ |
| POST | /cart/:token/items | Add item to cart | ❌ |
| PATCH | /cart/:token/items/:itemId | Update cart item | ❌ |
| DELETE | /cart/:token/items/:itemId | Remove item from cart | ❌ |
| DELETE | /cart/:token | Clear cart | ❌ |
📦 Order Routes (/orders)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /orders | Create new order | ✅ |
| GET | /orders | Get user's orders | ✅ |
| GET | /orders/:id | Get order by ID | ✅ |
| PATCH | /orders/:id/status | Update order status | ✅ |
🛠️ Service Routes (/services)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /services | Create service request | ❌ |
| GET | /services | Get all services | ❌ |
| GET | /services/:token | Get service by token | ❌ |
| PATCH | /services/:token/status | Update service status | ❌ |
| DELETE | /services/:token | Delete service | ❌ |
📋 Service Request Routes (/requests)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /requests | Create service request | ❌ |
| GET | /requests/:requestId | Get service request by ID | ❌ |
| GET | /requests | Get user's service requests | ✅ |
| PATCH | /requests/:requestId | Update service request | ✅ |
| DELETE | /requests/:requestId | Delete service request | ✅ |
📊 Status Routes (/status)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /status | Get server & database status | ❌ |
👨‍💼 Admin Routes (/admin)
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | /admin/dashboard | Get dashboard statistics | ✅ | ADMIN |
| GET | /admin/users | Get all users | ✅ | ADMIN |
| PATCH | /admin/users/:userId/role | Update user role | ✅ | ADMIN |
| GET | /admin/trees | Get all trees (admin) | ✅ | ADMIN |
| POST | /admin/trees | Create new tree | ✅ | ADMIN |
| PUT | /admin/trees/:id | Update tree | ✅ | ADMIN |
| DELETE | /admin/trees/:id | Delete tree | ✅ | ADMIN |
| GET | /admin/orders | Get all orders | ✅ | ADMIN |
| PATCH | /admin/orders/:id/status | Update order status | ✅ | ADMIN |
| GET | /admin/service-requests | Get all service requests | ✅ | ADMIN |
| PATCH | /admin/service-requests/:id/status | Update service request status | ✅ | ADMIN |
