---
author: Daniel Garcia (cr0hn) - @ggdaniel
description: Documentation for supporting services in the Vulnerable Node application
last_changed: 2025-11-05
---

# Services

This directory contains configuration and setup files for supporting services required by the Vulnerable Node application.

## Directory Structure

```
services/
└── postgresql/
    └── init.sql      # Database initialization script (optional)
```

## PostgreSQL Service

The PostgreSQL service provides the relational database backend for the application.

### Configuration

**Docker Compose Configuration:**

```yaml
postgres_db:
  image: postgres:latest
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: vulnerablenode
  ports:
    - "5432:5432"
  volumes:
    - ./services/postgresql:/docker-entrypoint-initdb.d
```

### Database Details

| Property | Value |
|----------|-------|
| **Host** | postgres_db (Docker) or 127.0.0.1 (Local) |
| **Port** | 5432 |
| **Database** | vulnerablenode |
| **Username** | postgres |
| **Password** | postgres |

> [!WARNING]
> These are intentionally weak credentials for a demonstration application. Never use default credentials in production.

### Database Schema

The database is initialized by `model/init_db.js`, which creates three tables:

1. **users** - User authentication credentials
2. **products** - Product catalog
3. **purchases** - Purchase history

See [model/README.md](../model/README.md) for detailed schema information.

### Connection Strings

**Local Development:**
```
postgres://postgres:postgres@127.0.0.1/vulnerablenode
```

**Docker Deployment:**
```
postgres://postgres:postgres@postgres_db/vulnerablenode
```

**Development Environment:**
```
postgres://postgres:postgres@10.211.55.70/vulnerablenode
```

### Initialization Scripts

Any `.sql` files placed in `services/postgresql/` will be automatically executed when the PostgreSQL container starts for the first time.

**Example init.sql:**
```sql
-- Optional: Additional database setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Optional: Additional indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_purchases_user ON purchases(user_name);
```

> [!NOTE]
> The application uses `init_db.js` for schema creation, so SQL initialization scripts are optional.

## Adding New Services

To add additional services:

### 1. Create Service Directory

```bash
mkdir services/new-service
```

### 2. Add Configuration Files

Place service-specific configuration in the directory:
```
services/
└── new-service/
    ├── config.yml
    └── init-script.sh
```

### 3. Update docker-compose.yml

```yaml
new_service:
  image: service-image:latest
  environment:
    SERVICE_CONFIG: value
  volumes:
    - ./services/new-service:/config
```

### 4. Document Service

Add documentation to this README explaining:
- Service purpose
- Configuration options
- Connection details
- Usage examples

## Service Management

### Starting Services

**All services:**
```bash
docker-compose up -d
```

**Specific service:**
```bash
docker-compose up -d postgres_db
```

### Stopping Services

**All services:**
```bash
docker-compose down
```

**Specific service:**
```bash
docker-compose stop postgres_db
```

### Viewing Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f postgres_db
```

### Service Health Checks

**Check PostgreSQL:**
```bash
docker-compose exec postgres_db pg_isready
```

**Connect to PostgreSQL:**
```bash
docker-compose exec postgres_db psql -U postgres -d vulnerablenode
```

## Troubleshooting

### PostgreSQL Connection Issues

**Problem:** Cannot connect to database

**Solutions:**
1. Verify container is running: `docker-compose ps`
2. Check logs: `docker-compose logs postgres_db`
3. Verify port mapping: `netstat -an | grep 5432`
4. Ensure STAGE environment variable is set correctly

### Database Not Initializing

**Problem:** Tables not created

**Solution:** 
The application creates tables automatically via `init_db.js`. If issues persist:

```bash
# Restart with fresh database
docker-compose down -v  # Remove volumes
docker-compose up -d
```

### Permission Issues

**Problem:** Permission denied errors

**Solution:**
```bash
# Fix permissions on services directory
chmod -R 755 services/
```

## Performance Tuning

> [!TIP]
> For testing purposes, PostgreSQL performance tuning is not critical. For production systems, consider:

**postgresql.conf adjustments:**
```ini
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
```

**Connection Pooling:**
```javascript
// Use pg-promise connection pooling
const pgp = require('pg-promise')({
    max: 30,        // Max connections
    idleTimeout: 30000
});
```

## Security Considerations

### Current Issues (Intentional)

- Default credentials (postgres/postgres)
- No SSL/TLS encryption
- Database exposed on host port
- No connection limits or rate limiting

### Production Recommendations

```yaml
# Secure PostgreSQL configuration
postgres_db:
  image: postgres:latest
  environment:
    POSTGRES_PASSWORD_FILE: /run/secrets/db_password
  secrets:
    - db_password
  # Don't expose port to host
  # Use internal network only
```

## Related Documentation

- [Architecture Overview](../ARCHITECTURE.md) - System architecture
- [Model Layer](../model/README.md) - Database operations
- [Docker Compose](../docker-compose.yml) - Service orchestration

---

> [!IMPORTANT]
> This is a demonstration environment with intentionally weak security. Never use these configurations in production.
