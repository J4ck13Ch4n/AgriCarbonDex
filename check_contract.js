const { ethers } = require('ethers');
require('dotenv').config({ path: './AgriDexBack/.env' });

const NFTDEX_ABI = require('./AgriDexBack/abi/NFTDEX.json');

async function checkContract() {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const nftdex = new ethers.Contract(process.env.NFTDEX_ADDRESS, NFTDEX_ABI, provider);
        
        console.log('NFTDEX Contract Address:', process.env.NFTDEX_ADDRESS);
        console.log('Environment CARBON_OFFSET_NFT_ADDRESS:', process.env.CARBON_OFFSET_NFT_ADDRESS);
        
        // Query the carbonOffsetNFTContract address from the contract
        const carbonOffsetNFTContract = await nftdex.carbonOffsetNFTContract();
        console.log('Contract carbonOffsetNFTContract:', carbonOffsetNFTContract);
        
        // Check if they match
        if (carbonOffsetNFTContract.toLowerCase() === process.env.CARBON_OFFSET_NFT_ADDRESS.toLowerCase()) {
            console.log('✅ Addresses match!');
        } else {
            console.log('❌ Addresses do NOT match!');
            console.log('This is why "Only CarbonOffsetNFT can be listed" error occurs');
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

checkContract();
