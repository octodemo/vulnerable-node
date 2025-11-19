# User Profile CRUD Endpoints

This document describes the user profile management endpoints that have been added to the vulnerable-node application.

## Overview

The user profile endpoints provide complete CRUD (Create, Read, Update, Delete) functionality for managing user profiles in the system. All endpoints require authentication.

## Database Schema

The `user_profiles` table contains the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | VARCHAR(100) | Yes | Primary key, unique identifier |
| email | VARCHAR(100) | Yes | User's email address |
| full_name | VARCHAR(200) | No | User's full name |
| bio | TEXT | No | User biography |
| avatar_url | VARCHAR(500) | No | URL to user's avatar image |

## API Endpoints

### 1. Create User Profile

Creates a new user profile.

**Endpoint:** `POST /api/profiles`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "bio": "Software developer",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Success Response:**
- **Code:** 201 Created
- **Content:** The created profile object

**Error Response:**
- **Code:** 400 Bad Request - Missing required fields
- **Code:** 500 Internal Server Error - Database error

**Example:**
```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "bio": "Software developer"
  }'
```

### 2. List All User Profiles

Retrieves all user profiles.

**Endpoint:** `GET /api/profiles`

**Success Response:**
- **Code:** 200 OK
- **Content:** Array of profile objects

**Error Response:**
- **Code:** 500 Internal Server Error

**Example:**
```bash
curl http://localhost:3000/api/profiles \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE"
```

### 3. Get User Profile

Retrieves a specific user profile by username.

**Endpoint:** `GET /api/profiles/:username`

**URL Parameters:**
- `username` - The username of the profile to retrieve

**Success Response:**
- **Code:** 200 OK
- **Content:** Profile object

**Error Response:**
- **Code:** 404 Not Found - Profile does not exist

**Example:**
```bash
curl http://localhost:3000/api/profiles/johndoe \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE"
```

### 4. Update User Profile

Updates an existing user profile.

**Endpoint:** `PUT /api/profiles/:username`

**URL Parameters:**
- `username` - The username of the profile to update

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "full_name": "John Smith",
  "bio": "Senior software developer",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:** Updated profile object

**Error Response:**
- **Code:** 400 Bad Request - Missing required fields
- **Code:** 404 Not Found - Profile does not exist

**Example:**
```bash
curl -X PUT http://localhost:3000/api/profiles/johndoe \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "email": "newemail@example.com",
    "full_name": "John Smith",
    "bio": "Senior software developer"
  }'
```

### 5. Delete User Profile

Deletes a user profile.

**Endpoint:** `DELETE /api/profiles/:username`

**URL Parameters:**
- `username` - The username of the profile to delete

**Success Response:**
- **Code:** 200 OK
- **Content:** 
```json
{
  "message": "Profile deleted successfully",
  "data": { /* deleted profile object */ }
}
```

**Error Response:**
- **Code:** 404 Not Found - Profile does not exist

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/profiles/johndoe \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE"
```

## Authentication

All endpoints require authentication. Users must be logged in with a valid session cookie. If not authenticated, the endpoints will redirect to the login page.

To authenticate, first login using:

```bash
curl -X POST http://localhost:3000/login/auth \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin" \
  -c cookies.txt

# Then use the session cookie for subsequent requests
curl http://localhost:3000/api/profiles \
  -b cookies.txt
```

## Implementation Details

### Security Features

1. **Parameterized Queries**: All database operations use parameterized queries to prevent SQL injection attacks.
2. **Authentication Required**: All endpoints check for authenticated sessions before processing requests.
3. **Input Validation**: Required fields are validated before database operations.

### Code Structure

- **Model**: `/model/user_profiles.js` - Contains database operations
- **Routes**: `/routes/user_profiles.js` - Defines API endpoints
- **Database Init**: `/model/init_db.js` - Creates the user_profiles table

### Error Handling

The endpoints include comprehensive error handling:
- Validation errors return 400 Bad Request
- Missing resources return 404 Not Found
- Database errors return 500 Internal Server Error with descriptive messages

## Testing

A verification script is available at `/tmp/test_profile_endpoints.js` that validates:
- Model function exports
- Route definitions
- Database table creation
- App.js integration

Run with:
```bash
node /tmp/test_profile_endpoints.js
```
