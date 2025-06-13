import React, { useState } from 'react';
import TradeBox from '../components/TradeBox';
import { connectMetamask } from '../utils/metamask';
import { useLocation, useNavigate } from 'react-router-dom';

const Buy = () => {
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isBuy = location.pathname === '/buy';
  const isSell = location.pathname === '/sell';

  // Hàm dùng chung cho cả hai nút
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
      <button
        className="topright-connect-btn"
        onClick={account ? undefined : handleConnect}
        disabled={connecting}
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 100,
          background: account ? '#111' : '#00ffae',
          color: account ? '#00ffae' : '#111',
          border: 'none',
          borderRadius: '20px',
          padding: '12px 32px',
          fontSize: '18px',
          fontWeight: 600,
          boxShadow: '0 2px 8px #0003',
          transition: 'background 0.2s, color 0.2s',
          cursor: 'pointer',
        }}
      >
        {account
          ? account.slice(0, 6) + '...' + account.slice(-3)
          : connecting ? 'Connecting...' : 'Connect'}
      </button>
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
      <TradeBox type="buy" externalAccount={account} onConnect={handleBoxConnect} />
    </div>
  );
};

export default Buy;
