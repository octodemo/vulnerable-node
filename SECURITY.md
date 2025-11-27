# Docker Security Documentation

This document describes the security measures implemented in this project's Docker configuration.

## Table of Contents

- [Quick Start](#quick-start)
- [Security Features](#security-features)
- [Secrets Management](#secrets-management)
- [Container Security](#container-security)
- [Network Security](#network-security)
- [Resource Limits](#resource-limits)
- [Health Checks](#health-checks)
- [Best Practices](#best-practices)

## Quick Start

### Setting Up Docker Secrets

Before running the application, you must create the secret files:

```bash
# Create the secrets directory (if not exists)
mkdir -p secrets

# Create the database user secret
echo "postgres" > secrets/db_user.txt

# Create the database password secret (use a strong password in production!)
echo "your_secure_password_here" > secrets/db_password.txt

# Ensure proper file permissions
chmod 600 secrets/*.txt
```

### Running the Application

```bash
# Build and start the containers
docker-compose build && docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Security Features

### Overview

This project implements the following Docker security best practices:

| Feature | Description |
|---------|-------------|
| Non-root users | Containers run as non-privileged users |
| Docker secrets | Credentials stored in secret files, not environment variables |
| Capability dropping | Containers have minimal Linux capabilities |
| Resource limits | CPU and memory constraints prevent resource exhaustion |
| Health checks | Automatic container health monitoring |
| No external DB port | Database port not exposed to host network |
| No new privileges | Prevents privilege escalation |

## Secrets Management

### How Secrets Work

Docker secrets provide a secure way to manage sensitive data:

1. **Secret files** are stored in the `secrets/` directory
2. **Docker Compose** mounts these files at `/run/secrets/` inside containers
3. **Applications** read credentials from these mounted files
4. **Git ignores** actual secret files (only `.example` files are committed)

### Secret Files

| File | Purpose | Location in Container |
|------|---------|----------------------|
| `db_user.txt` | Database username | `/run/secrets/db_user` |
| `db_password.txt` | Database password | `/run/secrets/db_password` |

### Creating Strong Passwords

```bash
# Generate a secure random password
openssl rand -base64 32 > secrets/db_password.txt
```

## Container Security

### Non-Root Users

Both containers run as non-root users:

- **Node.js container**: Runs as `nodeapp` user (UID/GID created during build)
- **PostgreSQL container**: Runs as `postgres` user (built into base image)

### Capability Dropping

Containers have minimal Linux capabilities:

**Node.js container:**
- Drops ALL capabilities
- Adds only `NET_BIND_SERVICE` (for binding to port 3000)

**PostgreSQL container:**
- Drops ALL capabilities
- Adds only necessary capabilities:
  - `CHOWN` - Change file ownership
  - `SETGID` - Set group ID
  - `SETUID` - Set user ID
  - `DAC_OVERRIDE` - Bypass file permission checks
  - `FOWNER` - Bypass permission checks on file owner

### No New Privileges

Both containers have `no-new-privileges:true` set, preventing:
- Privilege escalation through setuid binaries
- Gaining additional privileges after container start

## Network Security

### Internal Network Communication

- The **database port (5432)** is NOT exposed to the host network
- Containers communicate via Docker's internal network
- Only the **application port (3000)** is exposed for external access

### Network Isolation

```yaml
# Database only exposes port internally
expose:
  - "5432"

# Application exposes port to host
ports:
  - "3000:3000"
```

## Resource Limits

### CPU Limits

| Service | CPU Limit | CPU Reservation |
|---------|-----------|-----------------|
| vulnerable_node | 0.50 cores | 0.25 cores |
| postgres_db | 0.50 cores | 0.25 cores |

### Memory Limits

| Service | Memory Limit | Memory Reservation |
|---------|--------------|-------------------|
| vulnerable_node | 512 MB | 256 MB |
| postgres_db | 512 MB | 256 MB |

### Why Resource Limits Matter

- **Prevent DoS attacks** from consuming all host resources
- **Ensure fair sharing** between containers
- **Improve stability** by preventing runaway processes

## Health Checks

### Node.js Application

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

### PostgreSQL Database

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres -d vulnerablenode"]
  interval: 30s
  timeout: 10s
  retries: 5
  start_period: 30s
```

### Health Check Benefits

- **Automatic restart** of unhealthy containers
- **Dependency management** - App waits for healthy DB
- **Monitoring integration** - Health status visible in Docker/orchestrators

## Best Practices

### Production Deployment Checklist

- [ ] Use strong, randomly generated passwords
- [ ] Set restrictive file permissions on secret files (`chmod 600`)
- [ ] Regularly update base images for security patches
- [ ] Enable Docker logging and monitoring
- [ ] Use a reverse proxy (nginx/traefik) with TLS in front of the application
- [ ] Implement network policies if using Kubernetes
- [ ] Regular security audits of container images
- [ ] Use Docker Content Trust for image signing

### Updating Base Images

Check for updates regularly:

```bash
# Pull latest base images
docker pull node:22-bookworm-slim
docker pull postgres:16-bookworm

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

### Monitoring Container Health

```bash
# Check container health status
docker-compose ps

# View health check logs
docker inspect --format='{{json .State.Health}}' vulnerable-node_vulnerable_node_1

# Watch container resource usage
docker stats
```

### Security Scanning

Scan images for vulnerabilities:

```bash
# Using Docker Scout (built into Docker Desktop)
docker scout cves vulnerable-node_vulnerable_node

# Using Trivy
trivy image vulnerable-node_vulnerable_node
```

## Version Information

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 22 (bookworm-slim) | LTS version |
| PostgreSQL | 16 (bookworm) | Latest stable |
| Docker Compose | 3.9 | With secrets support |

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by:

1. **Do not** create a public GitHub issue
2. Contact the maintainers directly
3. Allow time for a fix before public disclosure

---

*Last updated: November 2024*
