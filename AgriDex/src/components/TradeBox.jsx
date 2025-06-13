import React, { useState } from 'react';
import { connectMetamask } from '../utils/metamask';

const TradeBox = ({ type, externalAccount, onConnect }) => {
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [connecting, setConnecting] = useState(false);

  // Ưu tiên externalAccount nếu có
  const effectiveAccount = externalAccount || account;

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const acc = await connectMetamask();
      setAccount(acc);
      if (onConnect) onConnect(acc);
    } catch (e) {
      alert('Failed to connect MetaMask!');
    }
    setConnecting(false);
  };

  let buttonText = 'Connect wallet';
  let buttonDisabled = false;
  if (effectiveAccount) {
    if (!amount) {
      buttonText = 'Enter an amount';
      buttonDisabled = true;
    } else {
      buttonText = 'Continue';
      buttonDisabled = false;
    }
  }

  return (
    <div className="tradebox-container">
      <div className="tradebox-card">
        <div className="tradebox-header">
          {type === 'buy' ? "You're buying" : "You're selling"}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 64, color: '#aaa', fontWeight: 600, position: 'relative', display: 'inline-block' }}>
            $
            <input
              className="tradebox-amount-input"
              type="number"
              min="0"
              max="500"
              placeholder="0"
              value={amount}
              onChange={e => {
                let v = e.target.value;
                if (v > 500) v = 500;
                setAmount(v);
              }}
              style={{
                width: amount ? Math.max(2, String(amount).length) + 'ch' : '2ch',
                fontSize: 64,
                color: '#aaa',
                fontWeight: 600,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                textAlign: 'left',
                marginLeft: 8,
                padding: 0,
                boxShadow: 'none',
                MozAppearance: 'textfield',
                appearance: 'textfield',
              }}
              onWheel={e => e.target.blur()}
              onKeyDown={e => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
              }}
              disabled={!effectiveAccount}
            />
          </span>
        </div>
        {type === 'buy' ? (
          <div className="tradebox-buttons">
            <button onClick={() => setAmount('100')}>$100</button>
            <button onClick={() => setAmount('300')}>$300</button>
            <button onClick={() => setAmount('1000')}>$1000</button>
          </div>
        ) : null}
      </div>
      <div className="tradebox-token">
        <span className="tradebox-token-icon">🪙</span> AGC
      </div>
      <button
        className={
          'tradebox-connect' +
          (effectiveAccount && !amount ? ' tradebox-connect-enter' : '')
        }
        onClick={effectiveAccount ? undefined : handleConnect}
        disabled={connecting || buttonDisabled}
      >
        {connecting ? 'Connecting...' : buttonText}
      </button>
    </div>
  );
};

export default TradeBox;
