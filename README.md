---
author: Daniel Garcia (cr0hn)
description: An intentionally vulnerable Node.js web application for security training and testing
last_changed: 2025-11-27
---

# Vulnerable Node

![Logo](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/logo-small.png)

*A deliberately vulnerable Node.js web application for security research and education*

## Table of Contents

- [Overview](#overview)
- [Security Disclaimer](#security-disclaimer)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Vulnerabilities](#vulnerabilities)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [References](#references)
- [License](#license)

## Overview

| Property | Value |
|----------|-------|
| Codename | PsEA |
| Version | 1.0 |
| Repository | https://github.com/cr0hn/vulnerable-node |
| Issues | https://github.com/cr0hn/vulnerable-node/issues/ |
| Author | Daniel Garcia (cr0hn) - @ggdaniel |

Vulnerable Node is an intentionally insecure web application designed with real, exploitable vulnerabilities. Unlike simulated vulnerable applications, this project contains actual security flaws in the source code.

> [!CAUTION]
> This application is intentionally vulnerable and should NEVER be deployed in a production environment or exposed to the internet. Use only in isolated testing environments.

### Purpose

This project was created to:

- **Test security analyzers** - Measure the quality of static and dynamic security analysis tools
- **Train security researchers** - Practice identifying and exploiting real vulnerabilities
- **Educate developers** - Learn how NOT to program in Node.js
- **Support penetration testing** - Provide a safe, legal target for testing security tools

### Why This Project?

Similar projects like OWASP NodeGoat use simulated vulnerabilities that don't represent real-world insecure code. Vulnerable Node provides actual vulnerable code patterns that security tools should detect.

## Security Disclaimer

> [!WARNING]
> **FOR EDUCATIONAL PURPOSES ONLY**
>
> - Do not deploy this application on any public network
> - Do not use this application with real user data
> - Always run in an isolated environment (Docker recommended)
> - The authors are not responsible for misuse of this software
> - Using techniques from this project against unauthorized systems is illegal

## Features

The application simulates a small e-commerce shop with:

- **User Authentication** - Login and logout functionality
- **Product Catalog** - Browse available products
- **Product Search** - Search products by name or description
- **Product Details** - View individual product information
- **Purchase System** - Buy products (simulated)
- **Purchase History** - View purchased products

## Quick Start

```bash
# Clone the repository
git clone https://github.com/cr0hn/vulnerable-node.git
cd vulnerable-node

# Build and start with Docker Compose
docker-compose build && docker-compose up

# Access the application
# Open http://127.0.0.1:3000 in your browser
```

**Default Credentials:**

| Username | Password |
|----------|----------|
| admin | admin |
| roberto | asdfpiuw981 |

## Installation

### Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 19.x and PostgreSQL

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/cr0hn/vulnerable-node.git
cd vulnerable-node
```

2. Build and run the containers:

```bash
docker-compose build
docker-compose up
```

3. Access the application at `http://127.0.0.1:3000`

### Manual Installation

1. Install PostgreSQL and create a database named `vulnerablenode`

2. Clone and install dependencies:

```bash
git clone https://github.com/cr0hn/vulnerable-node.git
cd vulnerable-node
npm install
```

3. Set the environment variable:

```bash
# For local PostgreSQL
export STAGE=LOCAL

# For development server
export STAGE=DEVEL
```

4. Start the application:

```bash
npm start
```

## Configuration

The application uses environment variables for configuration:

| Variable | Values | Description |
|----------|--------|-------------|
| `STAGE` | `DOCKER`, `LOCAL`, `DEVEL` | Database connection mode |

**Database Connections:**

| Mode | Connection String |
|------|-------------------|
| `DOCKER` | `postgres://postgres:postgres@postgres_db/vulnerablenode` |
| `LOCAL` | `postgres://postgres:postgres@127.0.0.1/vulnerablenode` |
| `DEVEL` | `postgres://postgres:postgres@10.211.55.70/vulnerablenode` |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/login` | Display login page |
| `POST` | `/login/auth` | Authenticate user |
| `GET` | `/logout` | Logout and destroy session |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List all products |
| `GET` | `/products/search?q={query}` | Search products |
| `GET` | `/products/detail?id={id}` | Get product details |
| `GET`, `POST` | `/products/buy` | Purchase a product |
| `GET` | `/products/purchased` | View purchase history |

> [!NOTE]
> All product endpoints require authentication. Unauthenticated requests are redirected to `/login`.

## Vulnerabilities

This project contains vulnerabilities from the OWASP Top 10 (2013 categories, which align with the [OWASP Top 10](https://owasp.org/www-project-top-ten/)):

| ID | Vulnerability | Affected Areas |
|----|---------------|----------------|
| A1 | Injection (SQL) | `model/auth.js`, `model/products.js` |
| A2 | Broken Authentication | Session management, password storage |
| A3 | Cross-Site Scripting (XSS) | `views/search.ejs`, `views/login.ejs` |
| A4 | Insecure Direct Object References | `/products/detail` endpoint |
| A5 | Security Misconfiguration | Error handling, default credentials |
| A6 | Sensitive Data Exposure | Plain text passwords, hardcoded secrets |
| A8 | Cross-Site Request Forgery | `/products/buy` endpoint |
| A10 | Unvalidated Redirects | Login redirect parameter |

**Additional Vulnerabilities:**

- Regular Expression Denial of Service (ReDoS)
- Log Injection

> [!TIP]
> See [docs/VULNERABILITIES.md](./docs/VULNERABILITIES.md) for detailed vulnerability documentation including exact code locations and example exploits.

### Attack Examples

The `attacks/` directory contains demonstration scripts:

```
attacks/
├── csrf/           # CSRF attack examples
├── evil_regex/     # ReDoS attack examples
├── sqli/           # SQL injection with sqlmap
└── log_injection.sh
```

See [docs/ATTACKS.md](./docs/ATTACKS.md) for usage instructions.

## Project Structure

```
vulnerable-node/
├── app.js              # Main Express application
├── config.js           # Database configuration
├── dummy.js            # Seed data
├── package.json        # Dependencies
├── Dockerfile          # Node.js container
├── docker-compose.yml  # Multi-container setup
│
├── bin/
│   └── www             # Server startup
│
├── model/
│   ├── auth.js         # Authentication (SQL injection)
│   ├── init_db.js      # Database initialization
│   └── products.js     # Product queries (SQL injection)
│
├── routes/
│   ├── login.js        # Auth routes
│   ├── login_check.js  # Auth middleware
│   └── products.js     # Product routes
│
├── views/              # EJS templates
├── public/             # Static assets
├── attacks/            # Exploit examples
├── services/           # PostgreSQL setup
└── docs/               # Documentation
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## Screenshots

**Login Screen:**

![Login screen](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/login.jpg)

**Product Catalog:**

![home screen](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/home.jpg)

**Shopping:**

![shopping](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/shop.jpg)

**Purchase History:**

![purchased products](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/purchased.jpg)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Adding new vulnerabilities
- Creating attack examples
- Improving documentation
- Code style requirements

> [!IMPORTANT]
> This is an intentionally vulnerable application. Please do not submit PRs that fix the security vulnerabilities unless specifically requested.

## Support This Project

Support this project (to solve issues, new features...) by using the GitHub "Sponsor" button.

## References

Resources used in creating this project:

- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [safe-regex](https://github.com/substack/safe-regex)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## License

This project is released under the BSD License. See [LICENSE](./LICENSE) for details.
