---
author: Daniel Garcia (cr0hn) - @ggdaniel
description: Architecture overview and design documentation for Vulnerable Node
last_changed: 2025-11-05
---

# Architecture Overview

This document provides a comprehensive overview of the Vulnerable Node application architecture, design patterns, and component interactions.

## Table of Contents

- [Application Stack](#application-stack)
- [Architecture Diagram](#architecture-diagram)
- [Layer Architecture](#layer-architecture)
- [Component Interactions](#component-interactions)
- [Data Flow](#data-flow)
- [Session Management](#session-management)
- [Database Design](#database-design)
- [Deployment Architecture](#deployment-architecture)

## Application Stack

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 12.x+ | JavaScript runtime environment |
| **Framework** | Express.js | 4.13.1 | Web application framework |
| **Template Engine** | EJS | 2.4.2 | Server-side rendering |
| **Database** | PostgreSQL | 9.x+ | Relational database |
| **ORM/Query** | pg-promise | 4.4.6 | PostgreSQL client library |
| **Session** | express-session | 1.13.0 | Session middleware |
| **Logging** | log4js | 0.6.36 | Application logging |
| **HTTP Logging** | morgan | 1.6.1 | HTTP request logging |

### Dependencies

```json
{
  "dependencies": {
    "body-parser": "~1.13.2",
    "cookie-parser": "~1.3.5",
    "debug": "~2.2.0",
    "ejs": "^2.4.2",
    "ejs-locals": "^1.0.2",
    "express": "~4.13.1",
    "express-session": "^1.13.0",
    "log4js": "^0.6.36",
    "morgan": "~1.6.1",
    "pg-promise": "^4.4.6",
    "serve-favicon": "~2.3.0"
  }
}
```

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Attack Scripts]
    end
    
    subgraph "Application Layer"
        C[Express.js Server]
        D[Middleware Pipeline]
        E[Route Handlers]
    end
    
    subgraph "Business Layer"
        F[Authentication Logic]
        G[Product Logic]
        H[Purchase Logic]
    end
    
    subgraph "Data Access Layer"
        I[Model: auth.js]
        J[Model: products.js]
        K[Model: init_db.js]
    end
    
    subgraph "Data Layer"
        L[(PostgreSQL Database)]
    end
    
    subgraph "Presentation Layer"
        M[EJS Templates]
        N[Static Assets]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G
    E --> H
    F --> I
    G --> J
    H --> J
    I --> L
    J --> L
    K --> L
    E --> M
    C --> N
    
    style A fill:#e1f5ff
    style B fill:#ffe1e1
    style C fill:#fff4e1
    style L fill:#e1ffe1
    style M fill:#f0e1ff
```

## Layer Architecture

### 1. Presentation Layer

**Responsibility:** User interface and client-side logic

**Components:**
- **EJS Templates** (`views/`) - Server-side rendered HTML
- **Static Assets** (`public/`) - CSS, JavaScript, images

**Key Files:**
```
views/
├── login.ejs           # Login form
├── products.ejs        # Product catalog
├── product_detail.ejs  # Single product view
├── search.ejs          # Search results
├── bought_products.ejs # Purchase history
└── error.ejs           # Error page
```

---

### 2. Application Layer

**Responsibility:** HTTP request handling and routing

**Components:**
- **Express Server** (`app.js`) - Main application setup
- **Route Handlers** (`routes/`) - URL endpoint definitions
- **Middleware Pipeline** - Request processing chain

**Middleware Stack:**

```mermaid
flowchart TD
    A[Incoming Request] --> B[Morgan HTTP Logger]
    B --> C[Body Parser]
    C --> D[Cookie Parser]
    D --> E[Session Middleware]
    E --> F[Static File Server]
    F --> G[Route Handlers]
    G --> H[Response]
    
    style B fill:#e3f2fd
    style C fill:#e3f2fd
    style D fill:#e3f2fd
    style E fill:#e3f2fd
    style F fill:#e3f2fd
```

---

### 3. Business Logic Layer

**Responsibility:** Application-specific logic and workflows

**Components:**
- **Authentication Flow** - Login/logout handling
- **Product Catalog** - Browse and search products
- **Purchase Processing** - Order handling
- **Session Validation** - Access control

---

### 4. Data Access Layer

**Responsibility:** Database operations and queries

**Components:**
- **auth.js** - User authentication queries
- **products.js** - Product CRUD operations
- **init_db.js** - Database initialization

**Pattern:** Direct SQL queries (no ORM abstraction)

---

### 5. Data Layer

**Responsibility:** Data persistence

**Components:**
- **PostgreSQL Database** - Relational storage
- **Three Tables:** users, products, purchases

## Component Interactions

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Express
    participant Routes
    participant Model
    participant Database
    participant Session
    
    User->>Browser: Enter credentials
    Browser->>Express: POST /login/auth
    Express->>Routes: login.js handler
    Routes->>Model: auth.do_auth(user, pass)
    Model->>Database: SQL Query (VULNERABLE)
    Database-->>Model: User record
    Model-->>Routes: Authentication result
    Routes->>Session: Set logged = true
    Routes->>Browser: Redirect to home
    Browser->>User: Show products
```

### Product Purchase Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Routes
    participant Middleware
    participant Model
    participant Database
    
    User->>Browser: Click "Buy"
    Browser->>Routes: POST /products/buy
    Routes->>Middleware: check_logged()
    Middleware-->>Routes: Authenticated
    Routes->>Routes: Validate form data
    Routes->>Routes: Extract price (VULNERABLE)
    Routes->>Model: purchase(cart)
    Model->>Database: INSERT query (VULNERABLE)
    Database-->>Model: Purchase record
    Model-->>Routes: Success
    Routes->>Browser: JSON response
    Browser->>User: Show confirmation
```

### Search Flow

```mermaid
flowchart LR
    A[User enters search term] --> B[GET /products/search?q=term]
    B --> C[check_logged middleware]
    C --> D{Authenticated?}
    D -->|No| E[Redirect to login]
    D -->|Yes| F[Extract query param]
    F --> G[Call products.search]
    G --> H[Build SQL with ILIKE]
    H --> I[Execute query VULNERABLE]
    I --> J[Return results]
    J --> K[Render search.ejs]
    K --> L[Display to user]
```

## Data Flow

### Request Processing Pipeline

```mermaid
flowchart TD
    A[HTTP Request] --> B{Static File?}
    B -->|Yes| C[Serve from /public]
    B -->|No| D[Parse Body]
    D --> E[Parse Cookies]
    E --> F[Load Session]
    F --> G{Route Match?}
    G -->|No| H[404 Handler]
    G -->|Yes| I[Execute Handler]
    I --> J{Auth Required?}
    J -->|Yes| K{Logged In?}
    K -->|No| L[Redirect to Login]
    K -->|Yes| M[Business Logic]
    J -->|No| M
    M --> N[Database Operations]
    N --> O[Render Template]
    O --> P[HTTP Response]
    
    style C fill:#e8f5e9
    style H fill:#ffebee
    style L fill:#fff3e0
    style N fill:#e1f5fe
    style O fill:#f3e5f5
```

## Session Management

### Session Architecture

```mermaid
graph LR
    A[Client Request] --> B[Session Middleware]
    B --> C{Session Cookie Exists?}
    C -->|Yes| D[Load Session Data]
    C -->|No| E[Create New Session]
    D --> F[req.session Object]
    E --> F
    F --> G[Route Handler]
    G --> H[Modify Session]
    H --> I[Save Session]
    I --> J[Set Cookie in Response]
    J --> K[Send Response]
```

### Session Data Structure

```javascript
req.session = {
    logged: true,           // Authentication state
    user_name: "admin",     // Current username
    cookie: {
        secure: false,      // VULNERABLE: Not HTTPS-only
        maxAge: 99999999999 // VULNERABLE: Excessive lifetime
    }
}
```

## Database Design

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PURCHASES : makes
    PRODUCTS ||--o{ PURCHASES : contains
    
    USERS {
        varchar name PK "Primary Key"
        varchar password "Plain text VULNERABLE"
    }
    
    PRODUCTS {
        integer id PK "Primary Key"
        varchar name
        text description
        integer price
        varchar image
    }
    
    PURCHASES {
        serial id PK "Primary Key"
        integer product_id FK
        varchar product_name "Denormalized"
        varchar user_name FK
        varchar mail
        varchar address
        varchar phone
        varchar ship_date
        integer price "Client-controlled VULNERABLE"
    }
```

### Database Access Patterns

**Connection Strategy:**

```javascript
// auth.js - New connection per request
function do_auth(username, password) {
    var db = pgp(config.db.connectionString);  // New connection
    // ... use db
}

// products.js - Persistent connection
var db = pgp(config.db.connectionString);  // Module-level connection
// ... reuse db across functions
```

## Deployment Architecture

### Docker Compose Deployment

```mermaid
graph TB
    subgraph "Docker Network"
        A[Node.js Container<br/>vulnerable-node:3000]
        B[PostgreSQL Container<br/>postgres_db:5432]
    end
    
    C[Host Machine<br/>Port 3000] --> A
    A -.->|Connection String| B
    
    subgraph "Volumes"
        D[./services/postgresql:/docker-entrypoint-initdb.d]
        E[./app:/app]
    end
    
    D -.-> B
    E -.-> A
    
    style A fill:#bbdefb
    style B fill:#c8e6c9
    style C fill:#fff9c4
```

### Container Configuration

**Application Container:**
```dockerfile
FROM node:12
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Database Container:**
```yaml
postgres_db:
  image: postgres
  environment:
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: vulnerablenode
  ports:
    - "5432:5432"
```

### Environment Configurations

```mermaid
graph LR
    A[STAGE Environment Variable] --> B{Value?}
    B -->|LOCAL| C[127.0.0.1]
    B -->|DEVEL| D[10.211.55.70]
    B -->|DOCKER| E[postgres_db]
    B -->|default| D
    
    C --> F[Database Connection]
    D --> F
    E --> F
```

## Performance Considerations

### Bottlenecks

1. **Database Queries** - No connection pooling optimization
2. **Session Storage** - In-memory (not distributed)
3. **No Caching** - Every request hits database
4. **ReDoS Vulnerability** - Can cause CPU exhaustion

### Scalability Limitations

- **Single Process** - No clustering or load balancing
- **Session Affinity** - Sessions not shared across instances
- **No Read Replicas** - All queries hit primary database
- **Synchronous Processing** - Blocking I/O operations

> [!NOTE]
> Performance optimization is not a priority for this intentionally vulnerable demonstration application.

## Security Architecture

### Attack Surface

```mermaid
mindmap
    root((Attack<br/>Surface))
        Authentication
            SQL Injection
            Weak Credentials
            Session Hijacking
        Data Access
            SQL Injection
            IDOR
            Price Manipulation
        User Input
            XSS
            Log Injection
            ReDoS
        CSRF
            No Token Validation
            GET State Changes
        Redirects
            Open Redirect
            Unvalidated URLs
```

### Security Controls

| Control Type | Implementation | Effectiveness |
|--------------|----------------|---------------|
| Input Validation | ❌ None | N/A |
| Output Encoding | ⚠️ Partial (EJS auto-escape) | Limited |
| Authentication | ❌ Vulnerable | None |
| Authorization | ⚠️ Session-based only | Weak |
| CSRF Protection | ❌ None | N/A |
| SQL Injection Protection | ❌ None | N/A |
| XSS Protection | ⚠️ Template engine only | Limited |

## Related Documentation

- [SECURITY.md](./SECURITY.md) - Detailed vulnerability documentation
- [README.md](./README.md) - Project overview and setup
- [routes/README.md](./routes/README.md) - Route handler details
- [model/README.md](./model/README.md) - Data access layer details

---

> [!IMPORTANT]
> This architecture is intentionally insecure for educational purposes. Do not use as a reference for production systems.
