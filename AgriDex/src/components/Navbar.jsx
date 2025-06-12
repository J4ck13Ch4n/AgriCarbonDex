import React, { useState } from 'react';

const Navbar = () => {
    const [account, setAccount] = useState(null);
    const [connecting, setConnecting] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('MetaMask not detected!');
            return;
        }
        setConnecting(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
        } catch {
            // User rejected or error
        }
        setConnecting(false);
    };

    // Helper to shorten address: 0x1234...678
    const shortAddress = acc => acc ? `${acc.slice(0, 6)}...${acc.slice(-3)}` : '';

    return (
        <nav className="navbar-custom">
            <div className="flex items-center">
                {/*<div className="logo" />
                <span className="font-bold text-lg tracking-widest">LOGO</span>*/}
            </div>
            <div className="nav-title">AgriCarbonDex</div>
            <div>
                {account ? (
                    <button
                        style={{
                            background: '#00ffae',
                            color: '#111',
                            border: '1px solid #00ffae',
                            borderRadius: 6,
                            padding: '6px 18px',
                            fontFamily: 'Roboto Mono, monospace',
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: 1,
                            cursor: 'default',
                            minWidth: 120
                        }}
                        disabled
                    >
                        {shortAddress(account)}
                    </button>
                ) : (
                    <button
                        className="wallet-btn"
                        onClick={connectWallet}
                        disabled={connecting}
                        style={{
                            background: 'transparent',
                            color: '#00ffae',
                            border: '1px solid #00ffae',
                            borderRadius: 6,
                            padding: '6px 18px',
                            fontFamily: 'Roboto Mono, monospace',
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: 1,
                            opacity: connecting ? 0.7 : 1,
                            cursor: connecting ? 'not-allowed' : 'pointer',
                            minWidth: 120
                        }}
                    >
                        {connecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
