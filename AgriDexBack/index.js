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
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const nftdex = new ethers.Contract(process.env.NFTDEX_ADDRESS, NFTDEX_ABI, signer);
const cct = new ethers.Contract(process.env.CARBON_CREDIT_TOKEN_ADDRESS, CCT_ABI, signer);

app.post('/api/list-nft', async (req, res) => {
    try {
        const { actualSeller, tokenId, price, nftContract } = req.body;
        
        if (!actualSeller || !tokenId || !price || !nftContract) {
            return res.status(400).json({ success: false, error: 'Missing required parameters.' });
        }
        const erc20Token = process.env.CARBON_CREDIT_TOKEN_ADDRESS;

        // Get CO2 amount from NFT contract before listing
        let co2Amount = 0; // Default to 0
        try {
            const nftContractInstance = new ethers.Contract(nftContract, [
                "function getCarbonMetadata(uint256 tokenId) view returns (string, string, string)",
                "function carbonData(uint256 tokenId) view returns (string, string, string)"
            ], provider);

            // Try getCarbonMetadata first
            try {
                const carbonMeta = await nftContractInstance.getCarbonMetadata(tokenId);
                if (carbonMeta && carbonMeta.length >= 3 && carbonMeta[2]) {
                    co2Amount = carbonMeta[2]; // Keep as string, don't convert to toString()
                } else {
                    // Try carbonData as fallback
                    try {
                        const carbonData = await nftContractInstance.carbonData(tokenId);
                        if (carbonData && carbonData.length >= 3 && carbonData[2]) {
                            co2Amount = carbonData[2]; // Keep as string
                        }
                    } catch (dataError) {
                        // Silent fallback
                    }
                }
            } catch (metaError) {
                // Silent fallback
            }
        } catch (contractError) {
            // Silent fallback
        }

        // Convert CO2 amount string to uint256 for contract
        let co2AmountBigInt;
        try {
            if (typeof co2Amount === 'string' && co2Amount !== '0') {
                // If it's a decimal string, convert to Wei-like format (multiply by 10^18)
                const co2Float = parseFloat(co2Amount);
                if (!isNaN(co2Float)) {
                    co2AmountBigInt = ethers.parseUnits(co2Amount, 18);
                } else {
                    co2AmountBigInt = 0n;
                }
            } else {
                co2AmountBigInt = 0n;
            }
        } catch (conversionError) {
            co2AmountBigInt = 0n;
        }

        // Gọi hàm listNFTForUser trên contract với CO2 amount
        const tx = await nftdex.listNFTForUser(
            actualSeller,
            nftContract,
            tokenId,
            erc20Token,
            price,
            co2AmountBigInt // Use converted BigInt value
        );
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        console.error("Error listing NFT:", err);
        res.status(500).json({ success: false, error: err.reason || err.message });
    }
});

app.post('/api/buy-nft', async (req, res) => {
    try {
        const { buyer, listingId } = req.body;
        
        if (!buyer || !listingId) {
            return res.status(400).json({ success: false, error: 'Missing params' });
        }

        // Gọi hàm buyNFTForUser trên contract với quyền owner
        const tx = await nftdex.buyNFTForUser(buyer, listingId);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        console.error("Error buying NFT:", err);
        res.status(500).json({ success: false, error: err.reason || err.message, stack: err.stack });
    }
});

const CARBON_CREDIT_TOKEN_ABI = require('./abi/CarbonCreditToken.json'); // ABI của CarbonCreditToken

const carbonCreditToken = new ethers.Contract(
    process.env.CARBON_CREDIT_TOKEN_ADDRESS,
    CARBON_CREDIT_TOKEN_ABI,
    signer
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