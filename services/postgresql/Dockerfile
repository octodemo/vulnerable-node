FROM postgres:16-bookworm

LABEL maintainer="Daniel Garcia aka (cr0hn)" <cr0hn@cr0hn.com>

# Copy initialization script
COPY init.sql /docker-entrypoint-initdb.d/

# Health check configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD pg_isready -U postgres -d vulnerablenode || exit 1
