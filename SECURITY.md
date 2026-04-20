# Security Policy

> **Security Contact**: Adekunle Bamz ([@AdekunleBamz](https://github.com/AdekunleBamz))

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in ChainStamps, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities.
2. Email security concerns to **[security@chainstamps.io](mailto:security@chainstamps.io)** privately.
3. Include detailed information about the vulnerability:
   - **Description**: A clear and concise description of the security issue.
   - **Steps to Reproduce**: Detailed steps to reproduce the vulnerability (including code samples or screenshots if applicable).
   - **Potential Impact**: Who would be affected and how?
   - **Suggested Fix**: Any ideas on how to address the vulnerability.

### What to Expect

- Acknowledgment within 48 hours
- Regular updates on progress
- Credit for responsible disclosure (if desired)

### Scope

The following are in scope:
- Smart contract vulnerabilities
- Access control issues
- Fee manipulation
- State corruption
- Denial of service vulnerabilities

### Out of Scope

- Issues in dependencies (report to upstream)
- Issues requiring physical access
- Social engineering attacks

## Security Best Practices

When integrating with ChainStamps:

1. **Verify contract addresses** before interacting
2. **Use official SDKs** and libraries
3. **Validate all inputs** before submitting transactions
4. **Monitor transactions** for unexpected behavior

## Smart Contract Audits

ChainStamps contracts are designed with security in mind:
- Ownership verification on all modifying operations
- Fee validation before state changes
- Error handling with descriptive codes
- No external contract dependencies

## Bug Bounty

Currently, there is no formal bug bounty program. However, we appreciate and acknowledge security researchers who help improve ChainStamps.

## Contact

For security concerns, use GitHub's private reporting flow:
https://github.com/AdekunleBamz/ChainStamps/security/advisories/new

Include incident timestamps and affected network when filing a security report.
