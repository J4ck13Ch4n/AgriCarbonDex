import { ethers } from "ethers";

export async function connectWallet() { 
    if (window.ethereum) {
        try { 
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            return { provider, signer };
        } catch (error) {
            console.error("MetaMask connectWallet error:", error);
            throw error; 
        }
    } else {
        alert("Vui lòng cài đặt MetaMask!");
        throw new Error("MetaMask is not installed. Please install it to use this DApp.");
    }
}

export async function connectMetamask() { 
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        } catch (err) {
            console.error("MetaMask connectMetamask error:", err);
            throw err; 
        }
    } else {
        throw new Error('MetaMask not installed');
    }
}