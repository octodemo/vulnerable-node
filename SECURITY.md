---
author: Daniel Garcia (cr0hn) - @ggdaniel
description: Comprehensive security vulnerability documentation for Vulnerable Node
last_changed: 2025-11-05
---

# Security Vulnerabilities

This document provides detailed information about all security vulnerabilities intentionally present in the Vulnerable Node application.

## Table of Contents

- [Vulnerability Summary](#vulnerability-summary)
- [A1 - SQL Injection](#a1---sql-injection)
- [A2 - Broken Authentication](#a2---broken-authentication)
- [A3 - Cross-Site Scripting (XSS)](#a3---cross-site-scripting-xss)
- [A4 - Insecure Direct Object References](#a4---insecure-direct-object-references)
- [A5 - Security Misconfiguration](#a5---security-misconfiguration)
- [A6 - Sensitive Data Exposure](#a6---sensitive-data-exposure)
- [A8 - Cross-Site Request Forgery (CSRF)](#a8---cross-site-request-forgery-csrf)
- [A10 - Unvalidated Redirects](#a10---unvalidated-redirects)
- [Remediation Guide](#remediation-guide)

> [!CAUTION]
> This application is intentionally vulnerable. These are NOT bugs to be fixed - they are features for security testing.

## Vulnerability Summary

| ID | Category | Severity | Exploitability | Locations |
|----|----------|----------|----------------|-----------|
| V-001 | SQL Injection | **Critical** | Easy | auth.js, products.js (5 functions) |
| V-002 | Weak Credentials | **High** | Easy | dummy.js |
| V-003 | Insecure Session | **High** | Medium | app.js |
| V-004 | Plain Text Passwords | **Critical** | Easy | Database schema |
| V-005 | XSS | **Medium** | Easy | login.js |
| V-006 | Price Manipulation | **High** | Easy | products.js |
| V-007 | ReDoS | **High** | Medium | products.js |
| V-008 | Hardcoded Secrets | **High** | Easy | app.js, config.js |
| V-009 | Info Disclosure | **Medium** | Easy | login.js, app.js |
| V-010 | Log Injection | **Medium** | Easy | login.js |
| V-011 | CSRF | **High** | Medium | products.js |
| V-012 | Open Redirect | **Medium** | Easy | login.js, login_check.js |

## A1 - SQL Injection

### V-001: Multiple SQL Injection Vulnerabilities

**CVSS Score:** 9.8 (Critical)

**Description:** User input is directly concatenated into SQL queries without parameterization, sanitization, or validation.

**Affected Components:**

#### 1. Authentication Bypass

**Location:** `model/auth.js:7`

```javascript
// VULNERABLE CODE
function do_auth(username, password) {
    var q = "SELECT * FROM users WHERE name = '" + username + 
            "' AND password ='" + password + "';";
    return db.one(q);
}
```

**Exploitation:**

```bash
# Bypass authentication
POST /login/auth
username=admin' --
password=anything

# Generated query: SELECT * FROM users WHERE name = 'admin' --' AND password ='anything';
# The -- comments out the password check
```

**Impact:** Complete authentication bypass, unauthorized access as any user

---

#### 2. Product Detail Injection

**Location:** `model/products.js:14`

```javascript
// VULNERABLE CODE
function getProduct(product_id) {
    var q = "SELECT * FROM products WHERE id = '" + product_id + "';";
    return db.one(q);
}
```

**Exploitation:**

```bash
# Extract all products
GET /products/detail?id=1' OR '1'='1

# Extract user data
GET /products/detail?id=1' UNION SELECT name, password, null, null, null FROM users --
```

**Impact:** Data disclosure, unauthorized data access

---

#### 3. Product Search Injection

**Location:** `model/products.js:21`

```javascript
// VULNERABLE CODE
function search(query) {
    var q = "SELECT * FROM products WHERE name ILIKE '%" + query + 
            "%' OR description ILIKE '%" + query + "%';";
    return db.many(q);
}
```

**Exploitation:**

```bash
# Extract user credentials
GET /products/search?q='; SELECT name, password FROM users; --

# Drop tables (destructive)
GET /products/search?q='; DROP TABLE products CASCADE; --

# Time-based blind injection
GET /products/search?q='; SELECT pg_sleep(10); --
```

**Impact:** Full database compromise, data extraction, data manipulation, denial of service

---

#### 4. Purchase Data Injection

**Location:** `model/products.js:28-38`

```javascript
// VULNERABLE CODE
function purchase(cart) {
    var q = "INSERT INTO purchases(...) VALUES('" +
            cart.mail + "', '" +
            cart.product_name + "', '" +
            cart.username + "', '" +
            cart.product_id + "', '" +
            cart.address + "', '" +
            cart.ship_date + "', '" +
            cart.phone + "', '" +
            cart.price + "');";
    return db.one(q);
}
```

**Exploitation:**

```bash
# Modify other data
POST /products/buy
mail=test@test.com'); UPDATE users SET password='hacked' WHERE name='admin'; --
```

**Impact:** Data manipulation, privilege escalation

---

#### 5. Purchase History Injection

**Location:** `model/products.js:46`

```javascript
// VULNERABLE CODE
function get_purcharsed(username) {
    var q = "SELECT * FROM purchases WHERE user_name = '" + username + "';";
    return db.many(q);
}
```

**Exploitation:**

```bash
# View all purchases
GET /products/purchased
(with session.user_name modified to: ' OR '1'='1)
```

**Impact:** Privacy violation, PII disclosure

### Remediation

Use parameterized queries:

```javascript
// SECURE EXAMPLE
function do_auth(username, password) {
    var q = "SELECT * FROM users WHERE name = $1 AND password = $2";
    return db.one(q, [username, password]);
}
```

## A2 - Broken Authentication

### V-002: Weak Default Credentials

**CVSS Score:** 8.1 (High)

**Location:** `dummy.js:5-14`

```javascript
"users": [
  {
    "username": "admin",
    "password": "admin"  // VULNERABLE: Trivial password
  }
]
```

**Impact:** Unauthorized administrative access

**Remediation:** Enforce strong password policies, no default credentials

---

### V-003: Insecure Session Configuration

**CVSS Score:** 7.5 (High)

**Location:** `app.js:43-49`

```javascript
app.use(session({
  secret: 'ñasddfilhpaf78h78032h780g780fg780asg780dsbovncubuyvqy',  // Hardcoded
  cookie: {
    secure: false,      // Not HTTPS-only
    maxAge: 99999999999 // Extremely long lifetime
  }
}));
```

**Issues:**
- Hardcoded session secret
- Cookies not restricted to HTTPS
- Excessive session lifetime (3,171 years!)

**Impact:** Session hijacking, session fixation

**Remediation:**
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,  // From environment
  cookie: {
    secure: true,       // HTTPS only
    httpOnly: true,     // No JavaScript access
    maxAge: 3600000     // 1 hour
  }
}));
```

---

### V-004: Plain Text Password Storage

**CVSS Score:** 9.1 (Critical)

**Location:** Database schema, `model/init_db.js:15`

```sql
CREATE TABLE users(name VARCHAR(100) PRIMARY KEY, password VARCHAR(50));
```

**Impact:** Complete credential compromise if database is breached

**Remediation:** Use bcrypt or argon2 for password hashing:

```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 10);
```

## A3 - Cross-Site Scripting (XSS)

### V-005: Reflected XSS in Error Messages

**CVSS Score:** 6.1 (Medium)

**Location:** `routes/login.js:14`

```javascript
router.get('/login', function(req, res, next) {
    var url_params = url.parse(req.url, true).query;
    res.render('login', {
        returnurl: url_params.returnurl, 
        auth_error: url_params.error  // VULNERABLE: Unsanitized
    });
});
```

**Exploitation:**

```
http://localhost:3000/login?error=<script>alert(document.cookie)</script>
```

**Impact:** Cookie theft, session hijacking, phishing

**Remediation:** Escape output in templates, use Content Security Policy

## A4 - Insecure Direct Object References

### V-006: Client-Controlled Pricing

**CVSS Score:** 8.2 (High)

**Location:** `routes/products.js:116`

```javascript
cart = {
    // ...
    price: params.price.substr(0, params.price.length - 1)  // From client!
}
```

**Exploitation:**

```bash
# Buy expensive item for 1€
POST /products/buy
price=1€
product_id=100  # $999 item
```

**Impact:** Financial loss, business logic bypass

**Remediation:** Look up price from database:

```javascript
const product = await db.one('SELECT price FROM products WHERE id = $1', [product_id]);
cart.price = product.price;  // Server-side price
```

## A5 - Security Misconfiguration

### V-007: Regular Expression Denial of Service (ReDoS)

**CVSS Score:** 7.5 (High)

**Location:** `routes/products.js:120`

```javascript
var re = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/
```

**Issue:** Nested quantifiers cause catastrophic backtracking

**Exploitation:**

```bash
POST /products/buy
mail=aaaaaaaaaaaaaaaaaaaaaaaaaaaa@
# Causes exponential regex evaluation time
```

**Impact:** Denial of service, CPU exhaustion

**Remediation:** Use simpler regex or dedicated email validation library

---

### V-008: Hardcoded Secrets

**CVSS Score:** 7.4 (High)

**Location:** `config.js:4,12,20`, `app.js:44`

```javascript
"server": "postgres://postgres:postgres@127.0.0.1"  // Hardcoded credentials
```

**Impact:** Credential compromise, unauthorized database access

**Remediation:** Use environment variables:

```javascript
const dbUrl = process.env.DATABASE_URL;
```

## A6 - Sensitive Data Exposure

### V-009: Information Disclosure via Error Messages

**CVSS Score:** 5.3 (Medium)

**Location:** `routes/login.js:39`

```javascript
.catch(function (err) {
    res.redirect("/login?returnurl=" + returnurl + "&error=" + err.message);
});
```

**Issue:** Database error messages exposed to users

**Example:** `User not found` vs generic `Invalid credentials`

**Impact:** Username enumeration, system information disclosure

**Remediation:** Generic error messages, log details server-side only

---

### V-010: Log Injection

**CVSS Score:** 5.3 (Medium)

**Location:** `routes/login.js:26`

```javascript
logger.error("Tried to login attempt from user = " + user);
```

**Exploitation:**

```bash
POST /login/auth
username=admin\nINFO: Successful login from admin
password=test
```

**Impact:** Log forgery, false audit trails, log poisoning

**Remediation:** Sanitize log inputs, use structured logging

## A8 - Cross-Site Request Forgery (CSRF)

### V-011: CSRF on Purchase Endpoint

**CVSS Score:** 8.1 (High)

**Location:** `routes/products.js:89`

```javascript
router.all('/products/buy', function(req, res, next) {
    // No CSRF token validation
    // Accepts both GET and POST
```

**Exploitation:**

```html
<!-- Attacker's page -->
<img src="http://localhost:3000/products/buy?product_id=1&price=9999€&..." />
```

**Impact:** Unwanted purchases, financial loss

**Remediation:** Use CSRF tokens:

```javascript
const csrf = require('csurf');
app.use(csrf());
```

## A10 - Unvalidated Redirects

### V-012: Open Redirect

**CVSS Score:** 6.1 (Medium)

**Location:** `routes/login.js:35`, `routes/login_check.js:6`

```javascript
// No validation on returnurl
res.redirect(returnurl);
```

**Exploitation:**

```
http://localhost:3000/login?returnurl=http://evil.com/phishing
```

**Impact:** Phishing, malware distribution

**Remediation:** Validate redirect URLs:

```javascript
if (returnurl && returnurl.startsWith('/')) {
    res.redirect(returnurl);
} else {
    res.redirect('/');
}
```

## Remediation Guide

### Quick Fixes

| Vulnerability | Fix Complexity | Priority |
|---------------|----------------|----------|
| SQL Injection | Medium | **Critical** |
| Plain Text Passwords | Medium | **Critical** |
| Weak Credentials | Easy | **High** |
| Hardcoded Secrets | Easy | **High** |
| CSRF | Easy | **High** |
| Insecure Sessions | Easy | **High** |
| Price Manipulation | Easy | **High** |
| Open Redirect | Easy | **Medium** |
| XSS | Easy | **Medium** |
| ReDoS | Medium | **Medium** |
| Info Disclosure | Easy | **Low** |
| Log Injection | Easy | **Low** |

### Defense in Depth

```mermaid
graph TD
    A[Input Layer] --> B[Validation]
    B --> C[Sanitization]
    C --> D[Parameterization]
    D --> E[Business Logic]
    E --> F[Output Encoding]
    F --> G[Security Headers]
    G --> H[Safe Response]
    
    style B fill:#99ff99
    style C fill:#99ff99
    style D fill:#99ff99
    style F fill:#99ff99
```

### Secure Development Checklist

- [ ] Use parameterized queries for all database operations
- [ ] Hash passwords with bcrypt/argon2
- [ ] Validate and sanitize all user inputs
- [ ] Implement CSRF protection
- [ ] Use secure session configuration
- [ ] Validate redirect URLs
- [ ] Encode output to prevent XSS
- [ ] Store secrets in environment variables
- [ ] Implement rate limiting
- [ ] Use security headers (CSP, HSTS, etc.)
- [ ] Log security events properly
- [ ] Perform regular security audits

---

> [!IMPORTANT]
> This application is for security testing only. Never deploy it in production or expose it to the internet.

For attack demonstrations, see [attacks/README.md](./attacks/README.md).
