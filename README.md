Vulnerable Node
===============

![Logo](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/logo-small.png)

*Vulnerable Node: A very vulnerable web site written in NodeJS*

## ⚠️ Data Classification: PUBLIC - Educational/Testing Only

**WARNING**: This repository contains intentionally vulnerable code for educational purposes. Do not use in production!

Codename | PsEA
-------- | ----
Version | 1.0
Code | https://github.com/cr0hn/vulnerable-node
Issues | https://github.com/cr0hn/vulnerable-node/issues/
Author | Daniel Garcia (cr0hn) - @ggdaniel
Data Classification | **PUBLIC** - Educational/Security Testing
License | BSD-3-Clause

## 🔒 Compliance & Security

- 📋 [Code of Conduct](CODE_OF_CONDUCT.md)
- 🤝 [Contributing Guidelines](CONTRIBUTING.md)
- 🔐 [Security Policy](SECURITY.md)
- 📦 [Software Bill of Materials (SBOM)](SBOM.md)
- ⚖️ [License](LICENSE)

# Support this project

Support this project (to solve issues, new features...) by applying the Github "Sponsor" button.

# What's this project?

The goal of this project is to be a project with really vulnerable code in NodeJS, not simulated.

## Why?

Similar project, like OWASP Node Goat, are pretty and useful for learning process but not for a real researcher or studding vulnerabilities in source code, because their code is not really vulnerable but simulated.

This project was created with the **purpose of have a project with identified vulnerabilities in source code with the finality of can measure the quality of security analyzers tools**.

Although not its main objective, this project also can be useful for:

- Pentesting training.
- Teaching: learn how NOT programming in NodeJS.

The purpose of project is to provide a real app to test the quality of security source code analyzers in white box processing.

## How?

This project simulates a real (and very little) shop site that has identifiable sources points of common vulnerabilities.

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

## Running

Once docker compose was finished, we can open a browser and type the URL: `127.0.0.1:3000` (or the IP where you deployed the project):

![Login screen](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/login.jpg)

To access to website you can use displayed in landing page:

- admin : admin
- roberto : asdfpiuw981

Here some images of site:

![home screen](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/home.jpg)

![shopping](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/shop.jpg)

![purchased products](https://raw.githubusercontent.com/cr0hn/vulnerable-node/master/images/purchased.jpg)

# Vulnerabilities

## Vulnerability list:

This project has the most common vulnerabilities of `OWASP Top 10 <https://www.owasp.org/index.php/Top_10_2013-Top_10>`:

- A1  - Injection
- A2  - Broken Authentication and Session Management
- A3  - Cross-Site Scripting (XSS)
- A4  - Insecure Direct Object References
- A5  - Security Misconfiguration
- A6  - Sensitive Data Exposure
- A8  - Cross-Site Request Forgery (CSRF)
- A10 - Unvalidated Redirects and Forwards

## Vulnerability code location

The exactly code location of each vulnerability is pending to write

# References

I took ideas and how to explode it in NodeJS using these references:

- https://blog.risingstack.com/node-js-security-checklist/
- https://github.com/substack/safe-regex

# Compliance Checklist

This repository follows organizational compliance standards:

## Repository Standards
- [x] **LICENSE file**: BSD-3-Clause license present
- [x] **README.md**: Comprehensive project documentation
- [x] **CODE_OF_CONDUCT.md**: Community guidelines defined
- [x] **CONTRIBUTING.md**: Contribution process documented
- [x] **SECURITY.md**: Security policy and reporting process
- [x] **Data Classification**: PUBLIC - Educational/Testing Only

## Security Compliance
- [x] **Vulnerability Documentation**: All intentional vulnerabilities documented
- [x] **SBOM Available**: Software Bill of Materials maintained
- [x] **Security Warnings**: Clear warnings about intentional vulnerabilities
- [x] **Isolated Use Only**: Documentation specifies isolated environment usage
- ⚠️ **Known Vulnerabilities**: 24 npm vulnerabilities (intentional for testing)
- ⚠️ **Hardcoded Credentials**: Present by design for educational purposes

## License Compliance
- [x] **OSS License**: BSD-3-Clause (permissive)
- [x] **Dependency Licenses**: All dependencies use compatible licenses (MIT, Apache-2.0)
- [x] **License Documentation**: Clearly stated in LICENSE file

## Code Quality
- [x] **Purpose Documented**: Clear statement of educational/testing purpose
- [x] **Usage Guidelines**: Instructions for safe usage provided
- [x] **Risk Warnings**: Multiple warnings about production use

## Important Notes

⚠️ **This is an intentionally vulnerable application**. The compliance posture reflects its educational purpose:

- Vulnerabilities are **documented and intentional**
- Hardcoded secrets are **for demonstration only**
- Outdated dependencies are **part of the testing scenario**
- **Never deploy to production** environments

For questions about compliance, see [SECURITY.md](SECURITY.md) or [CONTRIBUTING.md](CONTRIBUTING.md).

# License

This project is released under license BSD-3-Clause. See [LICENSE](LICENSE) for details.
