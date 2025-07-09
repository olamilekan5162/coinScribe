# CoinScribe

**Where Every Post Becomes a Coin**  
Decentralized publishing meets creator ownership.  
Built with Zora CoinV4 • Powered by Supabase, IPFS, and Wagmi.

🚀 Live Demo: [coinScribe](https://coin-scribe.netlify.app)

---

## 📖 Overview

**CoinScribe** is a decentralized blogging and publishing platform where every post is minted as a tradable **creator coin** using the Zora CoinV4 SDK. Readers become supporters and stakeholders by purchasing post coins, while writers earn through direct sales and resales — with no middlemen.

What Medium did for blogging, CoinScribe does for Web3:  
📝 Write content → 🪙 Mint a coin → 💰 Trade and support creators.

---

## 🎯 Why CoinScribe?

Traditional publishing platforms extract value from creators while maintaining centralized control. CoinScribe revolutionizes this by:

- **True Ownership**: Content stored permanently on IPFS blockchain
- **Creator Economics**: Each post generates social tokens that appreciate with engagement
- **Censorship Resistance**: Decentralized storage prevents takedowns
- **Community Investment**: Readers can invest in creators through token purchases
- **Transparent Metrics**: All engagement data publicly verifiable on-chain

---

## 📹 Demo Video

[CoinScribe video demo](https://youtu.be/uR3vW9rr-bQ?si=lyBHRSHD_yyYhCzq)

---

## 🔧 Tech Stack

| Layer               | Tools / Frameworks                     |
| ------------------- | -------------------------------------- |
| **Frontend**        | TypeScript, React, CSS Modules         |
| **Wallet/Web3**     | Wagmi, Web3Modal, Viem                 |
| **Smart Contracts** | Zora CoinV4 SDK + custom trading logic |
| **Database**        | Supabase                               |
| **Storage**         | IPFS via Pinata                        |
| **Deployment**      | Netlify                                |

---

## ✨ Features

- 📝 **Post = Coin**: Publishing creates a Zora CoinV4 token
- 📈 **Post Stats**: Market cap, price history, holders
- 💬 **Community Comments**: Discuss under each post
- 💰 **Support & Trade**: Buy post coins in ETH via custom UI
- 📬 **User Profiles**: Track earnings, holdings, trades
- 🧾 **IPFS Storage**: Content saved on-chain via Pinata

---

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/olamilekan5162/coinscribe.git
cd coinscribe

# Install dependencies
npm install
```

### Environment Variables

Create a .env file in the root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_PINATA_GATEWAY_URL=your_pinata_gateway_url
VITE_PINATA_API_KEY=your_pinata_api_key
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

---

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level views (Home, Create, Profile)
├── hooks/         # Custom React hooks
├── contexts/      # Auth contexts
├── lib/           # Utilities (Supabase, Web3, IPFS)
└── styles/        # Global styles and variables
```

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 🌐 Web3 Integration

- Zora CoinV4 SDK: Mints a coin for every post on-chain
- Custom Trade UI: Built-in UI for buying/selling post coins
- Wagmi + Web3Modal + Viem: Seamless wallet connectivity
- Uniswap V4: Trades routed via token pools

### 📦 IPFS & Supabase

- IPFS: Blog content is pinned via Pinata and retrieved on view
- Supabase: Stores user profiles, post metadata, and comment threads

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

---

**Built for the decentralized web** 🌐
