import React, { useState, useEffect } from 'react'; // Import useEffect for consistency
import TradeBox from '../components/TradeBox';
// ĐẢM BẢO FILE metamask.js CÓ CẢ HAI HÀM connectWallet và connectMetamask
import { connectMetamask } from '../utils/metamask';
import { useLocation, useNavigate } from 'react-router-dom';
// THAY ĐỔI: XÓA IMPORT NAVBAR, VÌ NÓ ĐƯỢC QUẢN LÝ BỞI LAYOUT
// import Navbar from '../components/Navbar'; 

const Buy = () => {
    // account và connecting state ở đây sẽ dùng để điều khiển các nút Connect Wallet trong Buy/Sell
    // và truyền xuống TradeBox
    const [account, setAccount] = useState(null);
    const [connecting, setConnecting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const isBuy = location.pathname === '/buy';
    const isSell = location.pathname === '/sell'; // This is for the Sell button in Buy page

    // Hàm connect dùng chung cho cả Navbar và TradeBox (theo logic cũ của bạn)
    const handleConnect = async () => {
        // Prevent calling connect if already in progress
        if (connecting) {
            console.log("MetaMask connection is already in progress. Please wait.");
            return;
        }

        setConnecting(true); // Set connecting state to true
        try {
            const acc = await connectMetamask(); // Call connectMetamask as per your original logic
            setAccount(acc);
        } catch (e) {
            alert('Failed to connect MetaMask!');
        }
        setConnecting(false);
    };

    // Callback for TradeBox when connection is successful
    const handleBoxConnect = (acc) => {
        setAccount(acc); // Update account state based on TradeBox's connection
    };

    // useEffect to check MetaMask connection status on load
    useEffect(() => {
        const checkMetamaskInitial = async () => {
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
        checkMetamaskInitial();

        // Listen for account changes
        const handleAccountsChanged = (accounts) => {
            setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
        };
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);


    return (
        <div className="flex flex-col items-center min-h-[calc(100vh-theme(spacing.20))] bg-gray-900 text-white pt-8">
            <TradeBox type="buy" externalAccount={account} onConnect={handleBoxConnect} />

        </div>
    );
};

export default Buy;
