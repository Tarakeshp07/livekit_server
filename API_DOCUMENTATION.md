# User Management API Documentation

## Overview
This API provides complete CRUD operations for user management following the MCR (Model-Controller-Route) pattern. The API includes user creation, retrieval, updating, deletion, search functionality, and statistics.

## Base URL
```
http://localhost:3000/api/users
```

## User Schema
```javascript
{
    username: String (required, unique, 3-30 chars),
    password: String (required, min 6 chars),
    role: String (enum: ['admin', 'user'], default: 'user'),
    age: Number (required, 0-150),
    healthConditions: [String] (optional array),
    sleepData: Number (default: 0, min: 0),
    institutionName: String (required, max 100 chars),
    email: String (required, unique, valid email format),
    createdAt: Date (auto-generated),
    updatedAt: Date (auto-updated)
}
```

## API Endpoints

### 1. Get All Users
**GET** `/api/users`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Users per page (default: 10)
- `role` (optional): Filter by role ('admin' or 'user')
- `institutionName` (optional): Filter by institution name (partial match)

**Example:**
```bash
GET /api/users?page=1&limit=5&role=admin
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "user_id",
            "username": "john_doe",
            "role": "admin",
            "age": 25,
            "healthConditions": ["diabetes"],
            "sleepData": 8,
            "institutionName": "University of Technology",
            "email": "john@example.com",
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 2,
        "totalUsers": 15,
        "hasNext": true,
        "hasPrev": false
    }
}
```

### 2. Get User by ID
**GET** `/api/users/:id`

**Example:**
```bash
GET /api/users/507f1f77bcf86cd799439011
```

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "role": "admin",
        "age": 25,
        "healthConditions": ["diabetes"],
        "sleepData": 8,
        "institutionName": "University of Technology",
        "email": "john@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

### 3. Create New User
**POST** `/api/users`

**Request Body:**
```json
{
    "username": "jane_smith",
    "password": "securepassword123",
    "role": "user",
    "age": 28,
    "healthConditions": ["asthma", "allergies"],
    "sleepData": 7,
    "institutionName": "Medical College",
    "email": "jane@example.com"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "_id": "new_user_id",
        "username": "jane_smith",
        "role": "user",
        "age": 28,
        "healthConditions": ["asthma", "allergies"],
        "sleepData": 7,
        "institutionName": "Medical College",
        "email": "jane@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

### 4. Update User
**PUT** `/api/users/:id`

**Request Body (all fields optional):**
```json
{
    "username": "jane_smith_updated",
    "password": "newpassword123",
    "role": "admin",
    "age": 29,
    "healthConditions": ["asthma"],
    "sleepData": 8,
    "institutionName": "Advanced Medical College",
    "email": "jane.updated@example.com"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "_id": "user_id",
        "username": "jane_smith_updated",
        "role": "admin",
        "age": 29,
        "healthConditions": ["asthma"],
        "sleepData": 8,
        "institutionName": "Advanced Medical College",
        "email": "jane.updated@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
    }
}
```

### 5. Delete User
**DELETE** `/api/users/:id`

**Example:**
```bash
DELETE /api/users/507f1f77bcf86cd799439011
```

**Response:**
```json
{
    "success": true,
    "message": "User deleted successfully",
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com"
    }
}
```

### 6. Search Users
**GET** `/api/users/search`

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example:**
```bash
GET /api/users/search?q=john&page=1&limit=5
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "user_id",
            "username": "john_doe",
            "role": "admin",
            "age": 25,
            "healthConditions": ["diabetes"],
            "sleepData": 8,
            "institutionName": "University of Technology",
            "email": "john@example.com",
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 1,
        "totalUsers": 1,
        "hasNext": false,
        "hasPrev": false
    }
}
```

### 7. Get User Statistics
**GET** `/api/users/stats`

**Response:**
```json
{
    "success": true,
    "data": {
        "totalUsers": 150,
        "adminUsers": 15,
        "regularUsers": 135,
        "usersByInstitution": [
            {
                "_id": "University of Technology",
                "count": 45
            },
            {
                "_id": "Medical College",
                "count": 32
            }
        ],
        "averageAge": 28.5
    }
}
```

## Error Responses

### Validation Error (400)
```json
{
    "success": false,
    "message": "Validation error",
    "errors": [
        "Username is required",
        "Email must be a valid email address"
    ]
}
```

### User Not Found (404)
```json
{
    "success": false,
    "message": "User not found"
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Error creating user",
    "error": "Detailed error message"
}
```

## Testing the API

### Using cURL

**Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "password123",
    "age": 25,
    "institutionName": "Test University",
    "email": "test@example.com"
  }'
```

**Get all users:**
```bash
curl http://localhost:3000/api/users
```

**Update a user:**
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "age": 26,
    "sleepData": 8
  }'
```

**Delete a user:**
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs with 12 salt rounds
2. **Input Validation**: Comprehensive validation for all input fields
3. **Password Exclusion**: Passwords are never returned in API responses
4. **Email Validation**: Proper email format validation
5. **Unique Constraints**: Username and email must be unique

## Performance Features

1. **Pagination**: All list endpoints support pagination
2. **Indexing**: Database indexes on frequently queried fields
3. **Filtering**: Support for filtering by role and institution
4. **Search**: Full-text search across username, email, and institution
5. **Statistics**: Aggregated statistics for dashboard views

## Getting Started

1. Start the server:
```bash
npm run dev
```

2. Test the API by visiting: `http://localhost:3000`

3. Use the endpoints as documented above to manage users.

The API is now ready to use with full CRUD operations, search functionality, and comprehensive error handling!
