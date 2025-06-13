// src/utils/metamask.js
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
