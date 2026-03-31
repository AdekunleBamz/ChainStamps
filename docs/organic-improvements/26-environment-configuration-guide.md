# Environment Configuration Guide

**Date:** 2026-03-31  
**Author:** Adekunle Bamz  
**Type:** Configuration Guide

## Overview

This document outlines environment configuration best practices for ChainStamps to ensure secure and consistent deployments across different environments.

## Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Application
VITE_APP_NAME=ChainStamps
VITE_APP_VERSION=1.0.0

# Network Configuration
VITE_NETWORK=testnet
VITE_CONTRACT_ADDRESS=ST...

# API Configuration
VITE_API_ENDPOINT=https://api.chainstamps.io
VITE_EXPLORER_URL=https://explorer.stacks.co

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Contract Configuration

Update `Clarinet.toml` for different environments:

```toml
[networks.testnet]
stacks_node = "http://localhost:20443"
bitcoin_node = "http://localhost:18443"

[networks.mainnet]
stacks_node = "https://api.mainnet.hiro.so"
bitcoin_node = "https://api.mainnet.hiro.so"
```

## Configuration Best Practices

### Security
- Never commit `.env` files
- Use `.env.example` for templates
- Validate environment variables
- Use secrets management for production

### Validation
- Validate required variables at startup
- Provide sensible defaults
- Fail fast on missing configuration
- Log configuration issues

### Environment-Specific Settings

#### Development
- Enable debug mode
- Use local contracts
- Disable analytics
- Verbose logging

#### Production
- Disable debug mode
- Use mainnet contracts
- Enable analytics
- Minimal logging

## Related Documents

- [Deployment Testnet Guide](./DEPLOYMENT_TESTNET.md)
- [Deployment Mainnet Guide](./DEPLOYMENT_MAINNET.md)
- [Security Policy](./SECURITY.md)