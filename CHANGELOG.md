# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README documentation
- Contributing guidelines
- Security policy
- Code of conduct
- GitHub Actions CI/CD pipeline
- EditorConfig for consistent formatting
- Prettier configuration
- Node.js version specification via .nvmrc

## [1.0.0] - 2026-01-28

### Added
- **hash-registry** contract for document hash verification
  - Store SHA-256 hashes with descriptions
  - Verify hash existence on-chain
  - Track hashes by user
  - Fee: 0.03 STX per hash

- **stamp-registry** contract for message stamping
  - Stamp messages permanently on-chain
  - Track stamps by user
  - Fee: 0.05 STX per stamp

- **tag-registry** contract for key-value storage
  - Store key-value pairs on-chain
  - Update existing tags
  - Lookup by owner and key
  - Fee: 0.04 STX per tag

- Comprehensive test suite for all contracts
- Clarinet project configuration
- Deployment plans for simnet and mainnet

### Security
- Owner-only admin functions
- Fee validation before state changes
- Input length validation

[Unreleased]: https://github.com/AdekunleBamz/ChainStamps/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/AdekunleBamz/ChainStamps/releases/tag/v1.0.0
