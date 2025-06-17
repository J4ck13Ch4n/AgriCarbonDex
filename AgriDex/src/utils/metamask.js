import { ethers } from "ethers";

export async function connectWallet() {
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return { provider, signer };
    } else {
        alert("Vui lòng cài đặt MetaMask!");
        return null;
    }
}

export async function connectMetamask() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        } catch (err) {
            throw err;
        }
    } else {
        throw new Error('MetaMask not installed');
    }
}
