// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { connectWallet } from '../utils/metamask';

const Layout = () => {
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (connecting) {
      return;
    }

    setConnecting(true);
    try {
      const { signer } = await connectWallet();
      const connectedAccount = await signer.getAddress();

      setAccount(connectedAccount);

    } catch (e) {
      console.error("Failed to connect MetaMask:", e);
      if (e.code === 4001) {
        alert('MetaMask connection rejected by the user.');
      } else if (e.code === -32002) {
        alert('MetaMask is busy. Please open MetaMask and respond to the pending request, or try again in a moment.');
      } else {
        alert('Failed to connect MetaMask! Please ensure it is installed and try again.');
      }
    } finally {
      setConnecting(false);
    }
  };

  // THAY ĐỔI: Thêm hàm handleDisconnect
  const handleDisconnect = () => {
    setAccount(null); // Xóa tài khoản khỏi state
    // Tùy chọn: Xóa provider/signer nếu bạn đang lưu chúng trong state ở đây
    // setProvider(null);
    // setSigner(null);
    alert('Wallet disconnected. Please disconnect from MetaMask UI if auto-connect persists.');
  };

  useEffect(() => {
    const checkInitialConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (err) {
          console.error("Error checking initial MetaMask connection:", err);
        }
      }
    };
    checkInitialConnection();

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts.length > 0 ? accounts[0] : null);
    };

    const handleChainChanged = () => {
      // window.location.reload(); 
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar account={account} connecting={connecting} onConnect={handleConnect} onDisconnect={handleDisconnect} />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;