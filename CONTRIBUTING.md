# Contributing to ChainStamps

> **Maintainer**: Adekunle Bamz ([@AdekunleBamz](https://github.com/AdekunleBamz))

Thank you for your interest in contributing to ChainStamps! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/adekunlebamz/ChainStamps.git`
3. Install dependencies: `npm ci`
4. Create a feature branch: `git checkout -b feat/your-feature`

## 📋 Development Setup

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) v2.0+
- [Node.js](https://nodejs.org/) v20+
- Git

### Running Tests

#### Smart Contracts (Clarity)
```bash
# Run Clarity unit tests
clarinet test

# Run tests with coverage report
npm run test:report

# Run focused SDK fee fetch tests
npx vitest run tests/chainstamp-sdk-fees.test.ts
```

#### Frontend (React)
```bash
# Run Vitest suite
npm --prefix frontend test

# Run Vitest in watch mode
npm --prefix frontend run test:watch
```

### Checking Clarity Syntax

```bash
# Validate contract logic and syntax
clarinet check
```

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/). **All commits must be GPG-signed** to ensure authenticity.

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

Tip: Sign commits before pushing to keep history verifiable (`git commit -S`).
```

## 🔄 Pull Request Process

1. Ensure all tests pass: `npm test`
2. Ensure Clarity syntax is valid: `clarinet check`
3. Run frontend lint when UI code changes: `npm --prefix frontend run lint`
4. Update documentation if needed
5. Create a PR with a clear description
6. Wait for review and address feedback

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
6. Transaction IDs or explorer links when issue is chain-related

## 💡 Feature Requests

We welcome feature suggestions! Please:

1. Check existing issues first
2. Provide clear use cases
3. Explain the expected behavior

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make ChainStamps better for everyone!
