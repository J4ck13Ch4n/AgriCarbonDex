import React, { useState } from 'react';
import TradeBox from '../components/TradeBox';
import { connectMetamask } from '../utils/metamask';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Buy = () => {
    const [account, setAccount] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isBuy = location.pathname === '/buy';
    const isSell = location.pathname === '/sell';

    // Hàm connect dùng chung cho cả Navbar và TradeBox
    const handleConnect = async () => {
        setConnecting(true);
        try {
            const acc = await connectMetamask();
            setAccount(acc);
        } catch (e) {
            alert('Failed to connect MetaMask!');
        }
        setConnecting(false);
    };

    // Callback cho TradeBox khi connect thành công ở dưới
    const handleBoxConnect = (acc) => {
        setAccount(acc);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#111214]" style={{ position: 'relative' }}>
            <Navbar account={account} connecting={connecting} onConnect={handleConnect} />
            <div className="buysell-nav" style={{ marginBottom: 10, marginTop: 48 }}>
                <button
                    className={isBuy ? 'active' : ''}
                    onClick={() => navigate('/buy')}
                >
                    Buy
                </button>
                <button
                    className={isSell ? 'active' : ''}
                    onClick={() => navigate('/sell')}
                >
                    Sell
                </button>
            </div>
            <TradeBox type="buy" externalAccount={account} onConnect={handleConnect} />
        </div>
    );
};

export default Buy;
