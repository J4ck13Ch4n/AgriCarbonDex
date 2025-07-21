import React, { useState, useEffect } from 'react';
import { connectMetamask } from '../utils/metamask';
import { ethers } from 'ethers';

const TradeBox = ({ type, externalAccount, onConnect }) => {
    const [account, setAccount] = useState(null);
    const [amount, setAmount] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Luôn kiểm tra trạng thái đăng nhập MetaMask khi load trang và lắng nghe thay đổi
    useEffect(() => {
        const checkMetamaskConnection = async () => {
            if (!window.ethereum) return;
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    const currentAccount = accounts[0];
                    setAccount(currentAccount);
                    if (onConnect) onConnect(currentAccount);
                }
            } catch (err) {
                console.error("Lỗi khi lấy tài khoản:", err);
            }
        };

        const handleAccountsChanged = (accounts) => {
            const newAccount = accounts.length > 0 ? accounts[0] : null;
            setAccount(newAccount);
            if (onConnect) onConnect(newAccount);
        };

        checkMetamaskConnection();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [onConnect]);

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

    // Xử lý gửi yêu cầu mua CCT (chỉ khi type === 'buy')
    const handleRequest = async () => {
        if (!effectiveAccount) {
            handleConnect();
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setMessage('Vui lòng nhập số lượng CCT hợp lệ!');
            return;
        }
        setLoading(true);
        setMessage('Đang gửi yêu cầu...');
        try {
            const res = await fetch('http://localhost:3001/api/request-mint-cct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: effectiveAccount, amount }),
            });
            if (res.ok) {
                setMessage('Đã mua thành công!');
                setAmount('');
            } else {
                const data = await res.json();
                setMessage('Lỗi: ' + (data.error || res.statusText));
            }
        } catch (err) {
            setMessage('Lỗi kết nối server!');
        }
        setLoading(false);
    };

    let buttonText = 'Connect wallet';
    let buttonDisabled = false;
    let buttonAction = handleConnect;
    if (effectiveAccount) {
        if (!amount) {
            buttonText = 'Enter an amount';
            buttonDisabled = true;
            buttonAction = undefined;
        } else {
            buttonText = type === 'buy' ? (loading ? 'Đang gửi...' : 'Gửi yêu cầu mua CCT') : 'Continue';
            buttonDisabled = loading;
            buttonAction = type === 'buy' ? handleRequest : undefined;
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
                onClick={buttonAction}
                disabled={connecting || buttonDisabled}
            >
                {connecting ? 'Connecting...' : buttonText}
            </button>
            {type === 'buy' && message && (
                <div style={{ marginTop: 8, color: message.startsWith('Lỗi') ? 'red' : '#00ffae', fontWeight: 500, textAlign: 'center' }}>{message}</div>
            )}
        </div>
    );
};

export default TradeBox;

