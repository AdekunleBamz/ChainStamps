# Release Checklist

> **Author**: Adekunle Bamz ([@AdekunleBamz](https://github.com/AdekunleBamz))

[Back to Documentation Index](./INDEX.md)

Use this checklist to prepare a release.

## Pre-Release
- [ ] Update CHANGELOG.md with new entries
- [ ] Verify contract versions and metadata headers
- [ ] Run test suite: `npm run test`
- [ ] Run focused fee utility checks: `npm run test:fee`
- [ ] Run SDK fee fetch tests: `npx vitest run tests/chainstamp-sdk-fees.test.ts`
- [ ] Verify deployment docs for testnet/mainnet
- [ ] Review new features for backward compatibility

## Deployment
- [ ] Deploy contracts to testnet
- [ ] Validate read-only functions and fees
- [ ] Deploy to mainnet (if approved)
- [ ] Record contract addresses

## Post-Release
- [ ] Update README.md with new contract addresses
- [ ] Tag release in GitHub
- [ ] Announce release notes
- [ ] Monitor transaction success rates
- [ ] Confirm release commits show as `Verified` on GitHub
