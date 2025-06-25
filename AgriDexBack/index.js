require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const NFTDEX_ABI = require('./abi/NFTDEX.json'); // ABI của NFTDEX
const CCT_ABI = require('./abi/CarbonCreditToken.json'); // ABI của CarbonCreditToken

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const nftdex = new ethers.Contract(process.env.NFTDEX_ADDRESS, NFTDEX_ABI, wallet);
const cct = new ethers.Contract(process.env.CARBON_CREDIT_TOKEN_ADDRESS, CCT_ABI, wallet);

app.post('/api/list-nft', async (req, res) => {
    try {
        const { actualSeller, tokenId, price } = req.body;
        const nftContract = process.env.CARBON_OFFSET_NFT_ADDRESS;
        const erc20Token = process.env.CARBON_CREDIT_TOKEN_ADDRESS;

        // Gọi hàm listNFTForUser trên contract
        const tx = await nftdex.listNFTForUser(
            actualSeller,
            nftContract,
            tokenId,
            erc20Token,
            price
        );
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/buy-nft', async (req, res) => {
    try {
        const { buyer, listingId } = req.body;
        if (!buyer || !listingId) return res.status(400).json({ success: false, error: 'Missing params' });

        // Gọi hàm buyNFTForUser trên contract với quyền owner
        const tx = await nftdex.buyNFTForUser(buyer, listingId);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        res.status(500).json({ success: false, error: err.reason || err.message });
    }
});

const CARBON_CREDIT_TOKEN_ABI = require('./abi/CarbonCreditToken.json'); // ABI của CarbonCreditToken

const carbonCreditToken = new ethers.Contract(
    process.env.CARBON_CREDIT_TOKEN_ADDRESS,
    CARBON_CREDIT_TOKEN_ABI,
    wallet
);

app.post('/api/request-mint-cct', async (req, res) => {
    try {
        const { address, amount } = req.body;
        if (!address || !amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, error: 'Invalid address or amount' });
        }
        // Gọi hàm mintERC20 trên contract CCT (chỉ owner mới được gọi)
        const tx = await carbonCreditToken.mintERC20(address, ethers.parseUnits(amount.toString(), 18));
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        console.error('MINT_CCT_ERROR:', err);
        res.status(500).json({ success: false, error: err.reason || err.message });
    }
});

app.listen(3001, () => {
    console.log('Backend server running on port 3001');
});