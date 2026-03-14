# ChainStamps Frontend

React + TypeScript frontend for interacting with the ChainStamps contracts.

## Prerequisites

- Node.js 18+
- A WalletConnect Project ID from https://cloud.walletconnect.com

## Setup

```bash
npm install
cp .env.example .env
```

Set your WalletConnect project id in `.env`:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_DEBUG=false
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```
