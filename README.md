# AgriCarbonDEX - Sàn Giao Dịch Tín Chỉ Carbon NFT

## Giới Thiệu

**AgriCarbonDEX** là sàn giao dịch phi tập trung (DApp) cho **Carbon NFT** trên blockchain Ethereum Sepolia. Sử dụng **Carbon Credit Token (CCT)** để thanh toán các giao dịch NFT tín chỉ carbon.

### Tính Năng
- 🛒 **Giao dịch NFT**: Mua/bán Carbon Offset NFT
- 💰 **Quản lý CCT**: Mua/bán token thanh toán
- 📝 **Niêm yết**: Đưa NFT lên sàn giao dịch  
- 📊 **Dashboard**: Theo dõi thống kê giao dịch
- 🤖 **AI Chatbot**: Hỗ trợ người dùng 24/7

## Kiến Trúc Hệ Thống

```
AgriCarbonDEX/
├── AgriDex/          # Frontend (React + Vite)
├── AgriDexBack/      # Backend (Node.js + Express) 
├── Contract/         # Smart Contracts (Solidity)
└── RAG_Chatbot/     # AI Chatbot (Python)
```

## Smart Contracts

### CarbonCreditToken (ERC-20)
- Token thanh toán với symbol **CCT**
- Chức năng mint cho admin

### CarbonOffsetNFT (ERC-721) 
- NFT tín chỉ carbon với metadata CO₂
- Lưu trữ IPFS CID và DID

### NFTDEX (Marketplace)
- Sàn giao dịch NFT
- Xử lý listing và trading thông qua backend proxy

## Công Nghệ Sử Dụng

- **Frontend**: React, Vite, Ethers.js, TailwindCSS
- **Backend**: Node.js, Express.js  
- **Blockchain**: Solidity, Ethereum Sepolia, MetaMask
- **AI**: Python Flask, RAG Chatbot

## Hướng Dẫn Cài Đặt

### Yêu Cầu
- Node.js ≥ 16.0.0
- Python ≥ 3.8 (cho chatbot)
- MetaMask browser extension

### 1. Deploy Smart Contracts
Sử dụng Remix IDE deploy lên Ethereum Sepolia:
1. `CarbonCreditToken.sol`
2. `CarbonOffsetNFT.sol` 
3. `NFTDEX.sol`

### 2. Setup Backend
```bash
cd AgriDexBack
npm install

# Tạo file .env
PRIVATE_KEY=your_private_key
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NFTDEX_ADDRESS=0x...
CARBON_OFFSET_NFT_ADDRESS=0x...
CARBON_CREDIT_TOKEN_ADDRESS=0x...

npm start
```

### 3. Setup Frontend
```bash
cd AgriDex
npm install

# Cập nhật addresses trong src/utils/constants.js
npm run dev
```

### 4. Setup Chatbot (Tùy chọn)
```bash
cd AgriDex/RAG_Chatbot
pip install -r requirements.txt
python BackEnd.py
```

## Hướng Dẫn Sử Dụng

1. **Kết nối MetaMask**: Chuyển sang mạng Sepolia Testnet
2. **Mua CCT**: Truy cập `/buy` để request CCT tokens
3. **List NFT**: Vào `/list`, approve NFT và set giá
4. **Trade**: Vào `/trade` để mua/bán NFT
5. **Dashboard**: Xem thống kê tại `/dashboard`
6. **Chatbot**: Click widget góc phải để được hỗ trợ

## API Endpoints

- `POST /api/list-nft` - List NFT lên sàn
- `POST /api/buy-nft` - Mua NFT 
- `POST /api/request-mint-cct` - Mint CCT tokens

---

**AgriCarbonDEX - Sàn giao dịch carbon xanh và bền vững**
