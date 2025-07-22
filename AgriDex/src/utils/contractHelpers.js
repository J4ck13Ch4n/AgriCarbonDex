import { ethers } from "ethers";
import { CARBON_CREDIT_TOKEN_ADDRESS, CARBON_OFFSET_NFT_ADDRESS, NFTDEX_ADDRESS, CARBON_DEBT_NFT_ADDRESS } from "./constants";
import NFTDEX_ABI from '../abi/NFTDEX.json';
import CARBON_OFFSET_NFT_ABI from '../abi/CarbonOffsetNFT.json';
import CARBON_DEBT_NFT_ABI from '../abi/CarbonDebtNFT.json';
import CCT_ABI from '../abi/CarbonCreditToken.json';
import { connectWallet } from "../utils/metamask";

export function getContract(address, abi, signerOrProvider) {
    return new ethers.Contract(address, abi, signerOrProvider);
}

// Ví dụ sử dụng:
export async function getContracts() {
    const { provider, signer } = await connectWallet();
    const dex = new ethers.Contract(NFTDEX_ADDRESS, NFTDEX_ABI, signer);
    const offsetNFT = new ethers.Contract(CARBON_OFFSET_NFT_ADDRESS, CARBON_OFFSET_NFT_ABI, signer);
    const debtNFT = new ethers.Contract(CARBON_DEBT_NFT_ADDRESS, CARBON_DEBT_NFT_ABI, signer);
    const cct = new ethers.Contract(CARBON_CREDIT_TOKEN_ADDRESS, CCT_ABI, signer);

    return { provider, signer, dex, offsetNFT, debtNFT, cct };
}