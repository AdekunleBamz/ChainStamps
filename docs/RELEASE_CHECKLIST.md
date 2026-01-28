# Release Checklist

Use this checklist to prepare a release.

## Pre-Release
- [ ] Update CHANGELOG.md with new entries
- [ ] Verify contract versions and metadata headers
- [ ] Run test suite: `npm test`
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
