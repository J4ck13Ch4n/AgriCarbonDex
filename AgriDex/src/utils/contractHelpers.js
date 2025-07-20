import { ethers } from "ethers";
import { CARBON_CREDIT_TOKEN_ADDRESS, CARBON_OFFSET_NFT_ADDRESS, NFTDEX_ADDRESS } from "./constants";
import CarbonCreditTokenABI from "../abi/CarbonCreditToken.json";
import CarbonOffsetNFTABI from "../abi/CarbonOffsetNFT.json";
import NFTDEXABI from "../abi/NFTDEX.json";
import { connectWallet } from "../utils/metamask";

export function getContract(address, abi, signerOrProvider) {
    return new ethers.Contract(address, abi, signerOrProvider);
}

// Ví dụ sử dụng:
export async function getContracts() {
    const { provider, signer } = await connectWallet();
    const cct = getContract(CARBON_CREDIT_TOKEN_ADDRESS, CarbonCreditTokenABI, signer);
    const offsetNFT = getContract(CARBON_OFFSET_NFT_ADDRESS, CarbonOffsetNFTABI, signer);
    const dex = getContract(NFTDEX_ADDRESS, NFTDEXABI, signer);
    return { cct, offsetNFT, dex, provider, signer };
}