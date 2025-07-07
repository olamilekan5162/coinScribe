# CoinScribe - Decentralized Publishing Platform

**Where Stories Create Value** - A Web3 publishing platform that transforms content creation into a tokenized economy where writers earn from their work and readers become stakeholders in the stories they love.

## 🎯 Why CoinScribe?

Traditional publishing platforms extract value from creators while maintaining centralized control. CoinScribe revolutionizes this by:

- **True Ownership**: Content stored permanently on IPFS blockchain
- **Creator Economics**: Each post generates social tokens that appreciate with engagement
- **Censorship Resistance**: Decentralized storage prevents takedowns
- **Community Investment**: Readers can invest in creators through token purchases
- **Transparent Metrics**: All engagement data publicly verifiable on-chain

## 🚀 How It Works

1. **Connect Wallet**: Link your Web3 wallet (MetaMask, WalletConnect)
2. **Create Content**: Write posts using our rich text editor
3. **Publish to Blockchain**: Content stored on IPFS with metadata on-chain
4. **Generate Tokens**: Each post creates unique social tokens
5. **Build Community**: Readers follow, engage, and invest in your tokens
6. **Earn Revenue**: Token appreciation and direct reader support

## 📹 Demo Video

_[Video demo placeholder - Add your demo video link here]_

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/coinscribe.git
cd coinscribe

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_PINATA_API_KEY=your_pinata_api_key (optional)
VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key (optional)
```

### Run Application

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:5173` to access the application.

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Web3Modal, Viem
- **Backend**: Supabase (PostgreSQL)
- **Storage**: IPFS via Pinata
- **Build**: Vite

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
├── lib/           # Utilities (Supabase, Web3, IPFS)
└── styles/        # Global styles and variables
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run code linting

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

---

**Built for the decentralized web** 🌐
