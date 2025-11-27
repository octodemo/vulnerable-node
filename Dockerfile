FROM node:22-bookworm-slim

LABEL maintainer="Daniel García (cr0hn) cr0hn@cr0hn.com"

ENV STAGE "DOCKER"

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r nodeapp && useradd -r -g nodeapp -d /app -s /sbin/nologin nodeapp

# Build app folders
RUN mkdir -p /app && chown -R nodeapp:nodeapp /app
WORKDIR /app

# Install depends as root first (for npm global packages)
COPY --chown=nodeapp:nodeapp package.json /app/
RUN npm install && npm cache clean --force

# Bundle code
COPY --chown=nodeapp:nodeapp . /app

# Switch to non-root user
USER nodeapp

EXPOSE 3000

# Health check configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD [ "npm", "start" ]
