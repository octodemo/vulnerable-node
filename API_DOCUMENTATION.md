# API Endpoints Documentation

This document describes the RESTful API endpoints available in the vulnerable-node application.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

The authentication endpoint allows you to validate user credentials.

### POST /api/auth

Authenticate a user with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "name": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Username and password are required"
}
```

## Products

### GET /api/products

Get a list of all products.

**Success Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": 0,
      "name": "Product Name",
      "description": "Product description",
      "price": 100,
      "image": "image-url"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET /api/products/search?q=query

Search for products by name or description.

**Query Parameters:**
- `q` (required): Search query string

**Success Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": 0,
      "name": "Product Name",
      "description": "Product description",
      "price": 100,
      "image": "image-url"
    }
  ],
  "query": "search term"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Query parameter \"q\" is required"
}
```

### GET /api/products/:id

Get details of a specific product by ID.

**URL Parameters:**
- `id`: Product ID

**Success Response (200):**
```json
{
  "success": true,
  "product": {
    "id": 0,
    "name": "Product Name",
    "description": "Product description",
    "price": 100,
    "image": "image-url"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

## Purchases

### POST /api/purchases

Create a new purchase.

**Request Body:**
```json
{
  "mail": "user@example.com",
  "address": "123 Main St",
  "ship_date": "2024-01-01",
  "phone": "555-1234",
  "product_id": 1,
  "product_name": "Product Name",
  "username": "john",
  "price": 100
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product purchased successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Missing parameter 'field_name'"
}
```

or

```json
{
  "success": false,
  "error": "Invalid mail format"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET /api/purchases?username=user

Get all purchases for a specific user.

**Query Parameters:**
- `username` (required): Username to retrieve purchases for

**Success Response (200):**
```json
{
  "success": true,
  "purchases": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "Product Name",
      "user_name": "john",
      "mail": "user@example.com",
      "address": "123 Main St",
      "phone": "555-1234",
      "ship_date": "2024-01-01",
      "price": 100
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Query parameter \"username\" is required"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Example Usage

### Using cURL

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Search for products:**
```bash
curl "http://localhost:3000/api/products/search?q=laptop"
```

**Get a specific product:**
```bash
curl http://localhost:3000/api/products/1
```

**Authenticate:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

**Create a purchase:**
```bash
curl -X POST http://localhost:3000/api/purchases \
  -H "Content-Type: application/json" \
  -d '{
    "mail": "user@example.com",
    "address": "123 Main St",
    "ship_date": "2024-01-01",
    "phone": "555-1234",
    "product_id": 1,
    "product_name": "Product Name",
    "username": "john",
    "price": 100
  }'
```

**Get user purchases:**
```bash
curl "http://localhost:3000/api/purchases?username=john"
```

## Response Format

All API endpoints return JSON responses with the following structure:

- **Success responses** include a `success: true` field
- **Error responses** include a `success: false` field and an `error` field with the error message
- HTTP status codes are used appropriately:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 404: Not Found
  - 500: Internal Server Error
