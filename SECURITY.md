# Security Policy

## Important Notice

**This repository contains intentionally vulnerable code** designed for security research, testing, and educational purposes. The vulnerabilities present in this application are **by design** and serve as examples of common security issues.

## Scope

### Intentional Vulnerabilities (Not Security Issues)

This application intentionally includes the following OWASP Top 10 vulnerabilities:

- **A1** - Injection (SQL Injection)
- **A2** - Broken Authentication and Session Management
- **A3** - Cross-Site Scripting (XSS)
- **A4** - Insecure Direct Object References
- **A5** - Security Misconfiguration
- **A6** - Sensitive Data Exposure
- **A8** - Cross-Site Request Forgery (CSRF)
- **A10** - Unvalidated Redirects and Forwards

These vulnerabilities are documented and **should not be reported as security issues**.

### Known Security Configurations

The following are known security issues that exist by design:

- Hardcoded database credentials (example: `postgres:postgres`)
- Hardcoded session secrets
- Outdated dependencies with known vulnerabilities
- Disabled security features (CSRF protection, secure cookies, etc.)
- Lack of input validation and sanitization
- Direct database queries without parameterization

**These are intentional and part of the project's educational purpose.**

## Reportable Security Issues

Please **DO** report the following types of security issues:

1. **Infrastructure Vulnerabilities**: Security issues in the Docker setup, CI/CD pipelines, or other infrastructure components that could affect users testing this application
2. **Unintended Data Exposure**: Any vulnerability that could expose real user data or credentials beyond the intended scope
3. **Supply Chain Issues**: Vulnerabilities in build tools, development dependencies, or other components not part of the vulnerable application itself
4. **Documentation Vulnerabilities**: Missing warnings or documentation that could lead users to deploy this in production environments

## Reporting a Security Issue

If you discover a **reportable security issue** (as defined above):

### Private Reporting (Preferred)

1. Go to the [Security tab](https://github.com/octodemo/vulnerable-node/security) of this repository
2. Click "Report a vulnerability"
3. Fill out the security advisory form with:
   - Clear description of the issue
   - Steps to reproduce
   - Potential impact
   - Suggested remediation (if applicable)

### Public Reporting

For less sensitive issues, you can:

1. Open a GitHub Issue
2. Clearly mark it as a security-related issue
3. Provide the same information as above

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Resolution**: Depends on severity and complexity

## Responsible Use

### Warning for Users

⚠️ **DO NOT deploy this application in production environments** ⚠️

This application is intentionally vulnerable and should only be used:

- In isolated development or testing environments
- For security training and education
- For testing security tools and scanners
- Behind secure network boundaries

### For Security Researchers

If you are testing security tools against this application:

- Use it in isolated environments only
- Do not target public instances without permission
- Share your findings to improve security education
- Respect the intentional nature of the vulnerabilities

## Security Best Practices for Testing

When using this application for security research:

1. **Isolation**: Run in Docker containers or isolated VMs
2. **Network Segmentation**: Use private networks, not public-facing deployments
3. **Data Protection**: Do not use real user data or credentials
4. **Clean Up**: Remove test instances when done
5. **Documentation**: Keep notes on what you test and discover

## Compliance and Legal

This project is released under a BSD license. By using this application, you acknowledge:

- The application is intentionally vulnerable
- It should not be used in production
- You are responsible for using it safely and legally
- The maintainers are not liable for misuse

## Security Resources

For learning more about the vulnerabilities in this application:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP NodeJS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Acknowledgments

We appreciate responsible security researchers who help improve this educational resource while respecting its intentional vulnerabilities.

## Contact

For security concerns or questions:

- Open a GitHub Issue
- Use GitHub Security Advisories for sensitive matters
- Check existing documentation and issues first

Thank you for helping keep security education accessible and safe! 🔒
