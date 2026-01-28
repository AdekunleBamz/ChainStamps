# Contributing to ChainStamps

Thank you for your interest in contributing to ChainStamps! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ChainStamps.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feat/your-feature`

## 📋 Development Setup

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) v2.0+
- [Node.js](https://nodejs.org/) v18+
- Git

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:report

# Watch mode
npm run test:watch
```

### Checking Clarity Syntax

```bash
clarinet check
```

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

Examples:
```
feat(hash-registry): add batch storage function
fix(stamp-registry): correct fee calculation
docs: update API reference
test(tag-registry): add edge case tests
```

## 🔄 Pull Request Process

1. Ensure all tests pass: `npm test`
2. Ensure Clarity syntax is valid: `clarinet check`
3. Update documentation if needed
4. Create a PR with a clear description
5. Wait for review and address feedback

### PR Title Format

Use the same format as commits:
```
feat(component): short description
```

## 🏗️ Code Style

### Clarity Contracts

- Use descriptive constant names with uppercase and hyphens: `ERR-NOT-AUTHORIZED`
- Document all public functions with comments
- Use `u` prefix for unsigned integers
- Group related functions together

### TypeScript Tests

- Use descriptive test names
- Test both success and error cases
- Use the Clarinet SDK patterns

## 🐛 Reporting Issues

When reporting issues, please include:

1. Description of the problem
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment details (OS, Clarinet version, Node version)

## 💡 Feature Requests

We welcome feature suggestions! Please:

1. Check existing issues first
2. Provide clear use cases
3. Explain the expected behavior

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make ChainStamps better for everyone!
