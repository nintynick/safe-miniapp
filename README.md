# Safe MultiSig - Farcaster Miniapp

A secure multi-signature wallet built as a Farcaster miniapp with native wallet integration.

## Features

- **Multi-Signature Security**: Require multiple confirmations before executing transactions
- **Native Farcaster Wallet**: Seamless integration with Farcaster's built-in wallet
- **Transaction Management**: Submit, confirm, revoke, and execute transactions
- **Owner Management**: Add, remove, or replace wallet owners
- **Base Network Support**: Deployed on Base and Base Sepolia

## Quick Start

### Prerequisites

- Node.js 22.11.0 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd safe-miniapp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Development

```bash
# Run the development server
npm run dev
```

Open the Farcaster developer preview to test your miniapp:
1. Enable Developer Mode in Farcaster settings
2. Go to https://farcaster.xyz/~/developers/mini-apps/preview
3. Use a tunnel (ngrok/cloudflared) to expose your local server
4. Enter your tunnel URL to preview

### Smart Contract Deployment

```bash
# Compile contracts
npm run compile

# Deploy to Base Sepolia (testnet)
npm run deploy:sepolia

# Deploy to Base (mainnet)
npm run deploy
```

## Project Structure

```
safe-miniapp/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/webhook/     # Farcaster webhook handler
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   └── providers.tsx    # React providers
│   ├── components/          # React components
│   │   ├── ConnectWallet.tsx
│   │   ├── OwnerManagement.tsx
│   │   ├── SubmitTransaction.tsx
│   │   ├── TransactionItem.tsx
│   │   ├── TransactionList.tsx
│   │   ├── WalletDashboard.tsx
│   │   └── WalletSelector.tsx
│   ├── contexts/            # React contexts
│   │   └── MultiSigContext.tsx
│   ├── contracts/           # Solidity contracts
│   │   └── MultiSigWallet.sol
│   ├── hooks/               # Custom React hooks
│   │   └── useMultiSig.ts
│   ├── lib/                 # Utilities
│   │   ├── abi.ts           # Contract ABI
│   │   ├── farcaster.ts     # Farcaster SDK helpers
│   │   └── wagmi.ts         # Wagmi config
│   └── types/               # TypeScript types
│       └── multisig.ts
├── public/
│   └── .well-known/
│       └── farcaster.json   # Farcaster manifest
├── scripts/
│   └── deploy.ts            # Deployment script
├── hardhat.config.ts        # Hardhat config
├── package.json
└── README.md
```

## Farcaster Miniapp Setup

### 1. Configure Manifest

Edit `public/.well-known/farcaster.json` with your domain and account details:

```json
{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  },
  "frame": {
    "version": "1",
    "name": "Safe MultiSig",
    "iconUrl": "https://safe.prolific43.com/icon.png",
    "homeUrl": "https://safe.prolific43.com",
    ...
  }
}
```

### 2. Generate Account Association

Use the Farcaster Developer Tools to generate your account association signature.

### 3. Deploy

Deploy your app to a hosting service (Vercel, Netlify, etc.) and configure your domain.

## Usage

### Creating a MultiSig Wallet

1. Deploy the smart contract with your desired owners and confirmation threshold
2. Open the miniapp in Farcaster
3. Connect your wallet
4. Enter the deployed contract address

### Submitting Transactions

1. Navigate to the "New" tab
2. Choose "Send ETH" or "Contract Call"
3. Enter the destination and amount/data
4. Confirm in your wallet

### Confirming Transactions

1. Navigate to the "Transactions" tab
2. Find pending transactions
3. Click "Confirm" to add your signature
4. Transaction executes automatically when threshold is met

### Managing Owners

1. Navigate to the "Owners" tab
2. Submit owner changes (requires multi-sig approval)
3. Other owners must confirm the change

## Security

- Based on the battle-tested Gnosis MultiSig contract
- Upgraded to Solidity 0.8.24 with modern security patterns
- All owner changes require multi-sig approval

## License

LGPL-3.0 (inherited from original Gnosis MultiSig)

## Credits

- Original contract by [Gnosis](https://github.com/gnosis/MultiSigWallet)
- Built for [Farcaster](https://farcaster.xyz)
