#!/bin/bash

# Fast PR creation script for ChainStamps
cd ~/ChainStamps

create_pr() {
    local branch=$1
    local title=$2
    local body=$3
    
    git checkout main
    git checkout -b "$branch"
    git add -A
    git commit -m "$title"
    git push origin "$branch"
    gh pr create --title "$title" --body "$body" --base main
}

# PR 6: Add GitHub Actions CI
git checkout main && git checkout -b ci/06-github-actions-workflow
mkdir -p .github/workflows
cat > .github/workflows/test.yml << 'YAML'
name: Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Clarinet
        uses: hirosystems/clarinet-action@v1
      - name: Run Tests
        run: clarinet test
YAML
git add -A && git commit -m "ci: add GitHub Actions workflow for automated testing"
git push origin ci/06-github-actions-workflow
gh pr create --title "ci: add GitHub Actions workflow for automated testing" --body "Adds CI pipeline for running tests on every push and PR" --base main

# PR 7: Add MIT License
git checkout main && git checkout -b docs/07-add-mit-license
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 ChainStamps

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
git add -A && git commit -m "docs: add MIT License"
git push origin docs/07-add-mit-license
gh pr create --title "docs: add MIT License" --body "Adds MIT License to the project" --base main

# PR 8: Add Contributing Guidelines
git checkout main && git checkout -b docs/08-contributing-guidelines
cat > CONTRIBUTING.md << 'EOF'
# Contributing to ChainStamps

Thank you for your interest in contributing to ChainStamps!

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Commit Convention

We use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `ci:` CI/CD changes

## Code Style

- Follow Clarity best practices
- Add comments for complex logic
- Keep functions focused and small

## Testing

All changes must include appropriate tests. Run tests with:
```bash
npm test
```
EOF
git add -A && git commit -m "docs: add contributing guidelines"
git push origin docs/08-contributing-guidelines
gh pr create --title "docs: add contributing guidelines" --body "Adds CONTRIBUTING.md with guidelines for contributors" --base main

# PR 9: Add Security Policy
git checkout main && git checkout -b docs/09-security-policy
mkdir -p .github
cat > .github/SECURITY.md << 'EOF'
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email security concerns to the maintainers
3. Include detailed steps to reproduce
4. Allow up to 48 hours for initial response

We take security seriously and appreciate responsible disclosure.
EOF
git add -A && git commit -m "docs: add security policy"
git push origin docs/09-security-policy
gh pr create --title "docs: add security policy" --body "Adds SECURITY.md for vulnerability reporting guidelines" --base main

# PR 10: Add Changelog
git checkout main && git checkout -b docs/10-add-changelog
cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to ChainStamps will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of ChainStamps
- Hash Registry contract for document verification
- Stamp Registry contract for message stamping
- Tag Registry contract for key-value storage
- Comprehensive test suite
- Full documentation

## [1.0.0] - 2026-01-28

### Added
- `hash-registry.clar` - Store and verify document hashes
- `stamp-registry.clar` - Permanent message stamping
- `tag-registry.clar` - Key-value pair storage
- Unit tests for all contracts
- Clarinet configuration
EOF
git add -A && git commit -m "docs: add changelog"
git push origin docs/10-add-changelog
gh pr create --title "docs: add changelog" --body "Adds CHANGELOG.md to track version history" --base main

# PR 11: Add Code of Conduct
git checkout main && git checkout -b docs/11-code-of-conduct
cat > CODE_OF_CONDUCT.md << 'EOF'
# Code of Conduct

## Our Pledge

We pledge to make participation in our community a harassment-free experience for everyone.

## Our Standards

Examples of positive behavior:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

Examples of unacceptable behavior:
- Trolling, insulting comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission

## Enforcement

Instances of abusive behavior may be reported to the project maintainers.
All complaints will be reviewed and investigated promptly and fairly.

## Attribution

This Code of Conduct is adapted from the Contributor Covenant, version 2.0.
EOF
git add -A && git commit -m "docs: add code of conduct"
git push origin docs/11-code-of-conduct
gh pr create --title "docs: add code of conduct" --body "Adds CODE_OF_CONDUCT.md for community guidelines" --base main

# PR 12: Add Issue Templates
git checkout main && git checkout -b ci/12-issue-templates
mkdir -p .github/ISSUE_TEMPLATE
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug Report
about: Report a bug in ChainStamps
title: '[BUG] '
labels: bug
---

## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Call '...'
3. See error

## Expected Behavior
What you expected to happen.

## Environment
- Clarinet version:
- Stacks network: [simnet/testnet/mainnet]
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature Request
about: Suggest a new feature
title: '[FEATURE] '
labels: enhancement
---

## Feature Description
A clear description of the feature.

## Use Case
Why is this feature needed?

## Proposed Solution
How should this work?
EOF
git add -A && git commit -m "ci: add issue templates for bugs and features"
git push origin ci/12-issue-templates
gh pr create --title "ci: add issue templates for bugs and features" --body "Adds GitHub issue templates for bug reports and feature requests" --base main

# PR 13: Add PR Template
git checkout main && git checkout -b ci/13-pr-template
cat > .github/pull_request_template.md << 'EOF'
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests pass locally
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] Changelog updated (if applicable)
EOF
git add -A && git commit -m "ci: add pull request template"
git push origin ci/13-pr-template
gh pr create --title "ci: add pull request template" --body "Adds GitHub PR template for consistent pull requests" --base main

# PR 14: Add EditorConfig
git checkout main && git checkout -b config/14-editorconfig
cat > .editorconfig << 'EOF'
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{clar,clarity}]
indent_size = 4

[*.{ts,js,json}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
EOF
git add -A && git commit -m "config: add EditorConfig for consistent formatting"
git push origin config/14-editorconfig
gh pr create --title "config: add EditorConfig for consistent formatting" --body "Adds .editorconfig for consistent code formatting across editors" --base main

# PR 15: Add Prettier Config
git checkout main && git checkout -b config/15-prettier
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF
cat > .prettierignore << 'EOF'
node_modules
.cache
*.clar
EOF
git add -A && git commit -m "config: add Prettier configuration"
git push origin config/15-prettier
gh pr create --title "config: add Prettier configuration" --body "Adds Prettier config for TypeScript/JavaScript formatting" --base main

echo "PRs 6-15 created!"
