import { ethers } from "ethers";

<<<<<<< HEAD
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
=======
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
>>>>>>> 35b40b15d7087da67e4b04d1a99d95a2efdcbd96
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        } catch (err) {
<<<<<<< HEAD
            console.error("MetaMask connectMetamask error:", err);
            throw err; 
=======
            throw err;
>>>>>>> 35b40b15d7087da67e4b04d1a99d95a2efdcbd96
        }
    } else {
        throw new Error('MetaMask not installed');
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 35b40b15d7087da67e4b04d1a99d95a2efdcbd96
