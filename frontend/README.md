# ChainStamps Frontend

> **Maintainer**: Adekunle Bamz ([@AdekunleBamz](https://github.com/AdekunleBamz))

The ChainStamps frontend is a modern React application built with TypeScript and Vite, providing a user-friendly interface for interacting with the ChainStamps smart contracts on the Stacks blockchain.

## Features

- **Document Verification**: Store and verify SHA-256 hashes on-chain
- **Message Stamping**: Permanently record messages with timestamps
- **Key-Value Storage**: Store and update metadata on the blockchain
- **Wallet Integration**: Support for Hiro and Xverse wallets
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Built-in theme switching

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling utilities

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm ci

# Start development server
npm run dev
```

Keep `.env.example` aligned with production-required variables whenever wallet/network config changes.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Project Structure

```
frontend/src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── *.tsx           # Feature components
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── utils/              # Utility functions
├── config/             # Configuration files
└── sdk/                # ChainStamps SDK
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_APP_NAME=ChainStamps
VITE_CONTRACT_ADDRESS=SP...
VITE_NETWORK=testnet
```

## Contributing

Please read the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

MIT - see [LICENSE](../LICENSE)