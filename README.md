# Flux Subscription Bot

This project is a Next.js application that manages and triggers subscriptions for the Flux protocol across multiple blockchain networks.

## Features

- Automated subscription management
- Multi-chain support (Sei, Mantle, Celo, Base)
- Periodic checks and triggers for active subscriptions
- Secure API endpoints for subscription management

## Getting Started

### Prerequisites

- Node.js (version specified in `package.json`)
- npm or yarn

### Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

```
CRON_SECRET=your_cron_secret
PRIVATE_KEY=your_private_key
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Main application code
  - `/api`: API routes
  - `/lib`: Utility functions and constants
- `/public`: Static assets
- `/styles`: Global styles

## Key Components

### Subscription Management

The core subscription logic is handled in:

```typescript:flux-subscription-bot/app/api/subscription/route.ts
startLine: 11
endLine: 79
```

This file contains the main logic for checking and triggering subscriptions across different chains.

### Chain and Address Configuration

Chain-specific configurations and contract addresses are defined in:

```typescript:flux-subscription-bot/app/lib/addresses.ts
startLine: 1
endLine: 18
```

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` file includes cron job configurations for periodic tasks.
