# Contributing to Vulnerable Node

Thank you for your interest in contributing to Vulnerable Node! This project is designed as an intentionally vulnerable application for security research, testing, and educational purposes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Reporting Security Issues](#reporting-security-issues)
- [Development Guidelines](#development-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/vulnerable-node.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes using Docker: `docker-compose build && docker-compose up`
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your branch: `git push origin feature/your-feature-name`
8. Open a Pull Request

## How to Contribute

### Types of Contributions

- **New Vulnerabilities**: Add new examples of security vulnerabilities
- **Documentation**: Improve documentation, add vulnerability explanations
- **Bug Fixes**: Fix unintended bugs (not the intentional vulnerabilities)
- **Testing**: Add tests or improve test coverage
- **Infrastructure**: Improve Docker setup, CI/CD, or development tools

### Important Note

This is an **intentionally vulnerable** application. When contributing:

- **DO NOT** fix the intentional security vulnerabilities
- **DO** document vulnerabilities clearly
- **DO** add new vulnerability examples if they serve an educational purpose
- **DO** fix bugs that break the application's functionality
- **DO** improve documentation and educational content

## Reporting Security Issues

Since this is an intentionally vulnerable application:

- **Intentional vulnerabilities** are documented in the README and are not security issues
- **Unintended security issues** in the testing/infrastructure (not the vulnerable app itself) should be reported via GitHub Issues or by following the process in [SECURITY.md](SECURITY.md)

## Development Guidelines

### Code Style

- Follow the existing code style in the project
- Use clear, descriptive variable and function names
- Comment your code where necessary, especially when adding new vulnerabilities

### Vulnerability Documentation

When adding a new vulnerability:

1. Add it to the vulnerability list in README.md
2. Include OWASP category reference
3. Provide code location details
4. Add exploitation examples in the `/attacks` directory if applicable

### Testing

- Test your changes using `docker-compose`
- Ensure the application builds and runs successfully
- Verify that existing functionality is not broken (unless intentionally vulnerable)

## Pull Request Process

1. **Update Documentation**: Update the README.md with details of changes, including new vulnerabilities
2. **Test Your Changes**: Ensure your changes work as expected in Docker
3. **Describe Your PR**: Provide a clear description of:
   - What changes you made
   - Why you made them
   - Any new vulnerabilities added (with OWASP references)
   - How to test the changes
4. **Link Related Issues**: Reference any related issues in your PR description
5. **Be Patient**: Maintainers will review your PR and may request changes
6. **Address Feedback**: Respond to review comments and make requested changes

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Documentation has been updated
- [ ] Changes have been tested locally with Docker
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes thoroughly
- [ ] New vulnerabilities are documented in README.md

## Questions?

If you have questions about contributing, please:

- Check existing issues and pull requests
- Open a new issue with your question
- Be respectful and patient

Thank you for contributing to security education and research! 🔒
