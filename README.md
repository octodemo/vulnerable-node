---
author: Daniel Garcia (cr0hn) - @ggdaniel
description: A deliberately vulnerable Node.js web application for security testing and training purposes
last_changed: 2025-11-05
---

# Vulnerable Node

![Logo](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/logo-small.png)

*A deliberately vulnerable web application written in Node.js for security testing and training*

| Property | Value |
|----------|-------|
| Codename | PsEA |
| Version | 1.0 |
| Code | https://github.com/cr0hn/vulnerable-node |
| Issues | https://github.com/cr0hn/vulnerable-node/issues/ |
| Author | Daniel Garcia (cr0hn) - @ggdaniel |

> [!CAUTION]
> This application contains intentional security vulnerabilities and should **NEVER** be deployed in a production environment or exposed to the public internet.

## Table of Contents

- [What is Vulnerable Node?](#what-is-vulnerable-node)
- [Why This Project?](#why-this-project)
- [Key Features](#key-features)
- [Installation](#installation)
  - [Using Docker Compose (Recommended)](#using-docker-compose-recommended)
  - [Manual Installation](#manual-installation)
- [Usage](#usage)
  - [Default Credentials](#default-credentials)
  - [Application Screenshots](#application-screenshots)
- [Vulnerabilities](#vulnerabilities)
  - [OWASP Top 10 Coverage](#owasp-top-10-coverage)
  - [Detailed Vulnerability List](#detailed-vulnerability-list)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Attack Examples](#attack-examples)
- [References](#references)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

## Support This Project

Support this project (to solve issues, new features, etc.) by using the GitHub "Sponsor" button.

## What is Vulnerable Node?

Vulnerable Node is a deliberately insecure e-commerce web application built with Node.js and Express. Unlike simulated vulnerability demonstrations, this project contains **real, exploitable vulnerabilities** in production-quality code.

The application simulates a small online shop where users can:
- Browse and search products
- View product details
- Purchase items
- View purchase history

## Why This Project?

Similar projects, like OWASP NodeGoat, are useful for learning but often use simulated vulnerabilities that don't reflect real-world code patterns. **Vulnerable Node was created to fill this gap.**

### Primary Purpose

**Measure the quality of security analysis tools** - This project provides a benchmark for testing:
- Static Application Security Testing (SAST) tools
- Software Composition Analysis (SCA) scanners
- Code review automation tools
- Security linters and IDE integrations

### Secondary Uses

Although not the main objective, this project is also valuable for:

- **Penetration Testing Training** - Practice exploiting real vulnerabilities in a safe environment
- **Secure Coding Education** - Learn how **NOT** to program in Node.js by studying anti-patterns
- **Security Awareness** - Demonstrate the impact of common coding mistakes

## Key Features

✅ **Real vulnerabilities** - Not simulated, actual exploitable security flaws
✅ **OWASP Top 10 coverage** - Includes most common web application vulnerabilities
✅ **Documented code** - Each vulnerability is clearly commented in the source
✅ **Attack examples** - Includes scripts demonstrating exploitation
✅ **Easy deployment** - Docker Compose for quick setup
✅ **PostgreSQL backend** - Real database with SQL injection vulnerabilities

## Installation

The most simple way to run the project is using docker-compose, doing this:

```bash

# git clone https://github.com/cr0hn/vulnerable-node.git vulnerable-node
# cd vulnerable-node/
# docker-compose build && docker-compose up
Building postgres_db
Step 1 : FROM library/postgres
---> 247a11721cbd
Step 2 : MAINTAINER "Daniel Garcia aka (cr0hn)" <cr0hn@cr0hn.com>
---> Using cache
---> d67c05e9e2d5
Step 3 : ADD init.sql /docker-entrypoint-initdb.d/
....
```

## Usage

Once the application is running, open your browser and navigate to:

```
http://127.0.0.1:3000
```

(Or the IP address where you deployed the application)

### Default Credentials

> [!WARNING]
> These credentials are intentionally weak for demonstration purposes.

| Username | Password | Role |
|----------|----------|------|
| admin | admin | Administrator |
| roberto | asdfpiuw981 | Regular User |

### Application Screenshots

**Login Screen:**

![Login screen](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/login.jpg)

**Product Catalog:**

![home screen](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/home.jpg)

**Shopping Interface:**

![shopping](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/shop.jpg)

**Purchase History:**

![purchased products](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/purchased.jpg)

## Vulnerabilities

This project implements vulnerabilities from the [OWASP Top 10](https://owasp.org/www-project-top-ten/) for security testing and training.

### OWASP Top 10 Coverage

| OWASP Category | Status | Examples |
|----------------|--------|----------|
| **A1 - Injection** | ✅ Implemented | SQL injection in authentication, search, product queries |
| **A2 - Broken Authentication** | ✅ Implemented | Weak passwords, insecure session management |
| **A3 - Cross-Site Scripting (XSS)** | ✅ Implemented | Unsanitized error messages in login |
| **A4 - Insecure Direct Object References** | ✅ Implemented | Price manipulation, direct product ID access |
| **A5 - Security Misconfiguration** | ✅ Implemented | ReDoS in email validation, hardcoded secrets |
| **A6 - Sensitive Data Exposure** | ✅ Implemented | Database errors exposed to users, verbose logging |
| **A7 - Missing Function Level Access Control** | ⚠️ Partial | Session-based access only |
| **A8 - Cross-Site Request Forgery (CSRF)** | ✅ Implemented | No CSRF tokens on purchase endpoint |
| **A9 - Using Components with Known Vulnerabilities** | ⚠️ Variable | Depends on npm dependencies at build time |
| **A10 - Unvalidated Redirects and Forwards** | ✅ Implemented | Open redirect in returnurl parameter |

### Detailed Vulnerability List

> [!IMPORTANT]
> Each vulnerability is documented with inline comments in the source code. Look for `VULNERABILITY:` or `VULNERABLE:` markers.

#### SQL Injection (A1)

**Location:** `model/auth.js`, `model/products.js`

- Authentication bypass: `' OR '1'='1' --`
- Product search manipulation
- Purchase data injection
- User purchase history access

**Example:**
```javascript
// Vulnerable code in model/auth.js
var q = "SELECT * FROM users WHERE name = '" + username + "' AND password ='" + password + "';";
```

#### Broken Authentication (A2)

**Location:** `app.js`, `dummy.js`

- Hardcoded session secret
- Weak default credentials (admin/admin)
- Insecure session cookies (not HTTPS-only)
- Extremely long session lifetime

#### Cross-Site Scripting - XSS (A3)

**Location:** `routes/login.js`

- Error parameter rendered without escaping
- Potential reflected XSS via error messages

#### Insecure Direct Object References (A4)

**Location:** `routes/products.js`

- Client-controlled product pricing
- Direct access to product IDs without authorization
- No verification that users own their purchase history

#### Security Misconfiguration (A5)

**Location:** `routes/products.js`, `config.js`

- ReDoS (Regular Expression DoS) in email validation
- Hardcoded database credentials
- Development error handlers expose stack traces

#### Sensitive Data Exposure (A6)

**Location:** `routes/login.js`, `app.js`

- Database error messages shown to users
- Detailed stack traces in development mode
- Unsanitized user input logged (log injection)

#### CSRF - Cross-Site Request Forgery (A8)

**Location:** `routes/products.js`

- Purchase endpoint accepts GET requests
- No CSRF token validation
- State-changing operations without protection

#### Unvalidated Redirects (A10)

**Location:** `routes/login.js`, `routes/login_check.js`

- `returnurl` parameter not validated
- Potential open redirect to external malicious sites

For more detailed information about each vulnerability with code examples and exploitation techniques, see [SECURITY.md](./SECURITY.md).

## Project Structure

```
vulnerable-node/
├── app.js                 # Main application entry point
├── config.js              # Environment configuration
├── dummy.js               # Test data (users and products)
├── package.json           # Node.js dependencies
├── docker-compose.yml     # Docker deployment config
├── Dockerfile             # Application container
│
├── bin/
│   └── www               # Application startup script
│
├── model/                # Data access layer
│   ├── auth.js           # Authentication (SQL injection vulnerability)
│   ├── products.js       # Product operations (SQL injection vulnerabilities)
│   └── init_db.js        # Database initialization
│
├── routes/               # HTTP route handlers
│   ├── login.js          # Authentication routes
│   ├── login_check.js    # Session validation middleware
│   └── products.js       # Product routes
│
├── views/                # EJS templates
│   ├── login.ejs
│   ├── products.ejs
│   ├── product_detail.ejs
│   ├── search.ejs
│   └── bought_products.ejs
│
├── public/               # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   ├── images/           # Product images
│   └── fonts/            # Web fonts
│
├── attacks/              # Example attack scripts
│   ├── sqli/             # SQL injection examples
│   ├── csrf/             # CSRF attack examples
│   └── evil_regex/       # ReDoS demonstrations
│
└── services/             # Supporting services
    └── postgresql/       # Database configuration
```

## Documentation

- **[SECURITY.md](./SECURITY.md)** - Detailed vulnerability documentation with exploitation examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Application architecture and design overview
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development and contribution guidelines
- **[routes/README.md](./routes/README.md)** - Route handler documentation
- **[model/README.md](./model/README.md)** - Data access layer documentation
- **[attacks/README.md](./attacks/README.md)** - Attack script documentation

## Attack Examples

The `attacks/` directory contains proof-of-concept scripts demonstrating various exploits:

- **SQL Injection** - Bypass authentication, extract data, modify database
- **CSRF** - Forge purchase requests from victim browsers
- **Log Injection** - Inject malicious entries into application logs
- **ReDoS** - Trigger denial of service via regex

> [!NOTE]
> These scripts are for educational purposes only. Use them only in controlled testing environments.

## References

This project was inspired by and draws upon the following resources:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web application security risks
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/) - Best practices
- [safe-regex](https://github.com/substack/safe-regex) - ReDoS detection
- [OWASP NodeGoat](https://github.com/OWASP/NodeGoat) - Similar vulnerable application project

## Contributing

Contributions are welcome! Whether you want to:

- Add new vulnerability examples
- Improve documentation
- Fix bugs (that aren't intentional vulnerabilities)
- Add new attack demonstrations

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

This project is released under the **BSD License**.

See [LICENSE](./LICENSE) for full details.

---

**Remember:** This application is for security testing and education only. Never deploy it in production or expose it to the internet!
