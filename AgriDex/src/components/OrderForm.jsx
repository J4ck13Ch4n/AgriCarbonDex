import React, { useState } from 'react';

const OrderForm = ({ data = [] }) => {
    // TODO: fetch from api.js
    const [tab, setTab] = useState('buy');
    const [amountUnit, setAmountUnit] = useState('USD');
    const [leverage, setLeverage] = useState('');
    const [amount, setAmount] = useState('');
    const [postOnly, setPostOnly] = useState(false);
    const [reduceOnly, setReduceOnly] = useState(false);
    const [maxLeverage, setMaxLeverage] = useState(5.0);
    // currentLeverage luôn lấy từ leverage, và bị giới hạn bởi maxLeverage
    const currentLeverage = leverage === '' ? 0.0 : Math.min(parseFloat(leverage) || 0, maxLeverage);
    const accentColor = tab === 'buy' ? '#00ffae' : '#ff3c3c';
    return (
        <div className="card-dark" style={{ maxWidth: 400, padding: 0, borderRadius: 12, border: '1px solid #23242a', fontFamily: 'Roboto Mono, monospace', background: '#181A20', fontSize: 13 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #23242a', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <button
                    className={tab === 'buy' ? 'active' : ''}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '16px 0',
                        fontWeight: 600,
                        fontSize: 16,
                        color: tab === 'buy' ? '#00ffae' : '#fff',
                        background: '#181A20',
                        border: 'none',
                        borderTopLeftRadius: 12,
                        borderBottom: tab === 'buy' ? '2px solid #00ffae' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'color 0.2s, border 0.2s',
                        letterSpacing: 1.5
                    }}
                    onClick={() => setTab('buy')}
                >
                    Buy
                </button>
                <button
                    className={tab === 'sell' ? 'active' : ''}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '16px 0',
                        fontWeight: 600,
                        fontSize: 16,
                        color: tab === 'sell' ? '#ff3c3c' : '#fff',
                        background: '#181A20',
                        border: 'none',
                        borderTopRightRadius: 12,
                        borderBottom: tab === 'sell' ? '2px solid #ff3c3c' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'color 0.2s, border 0.2s',
                        letterSpacing: 1.5
                    }}
                    onClick={() => setTab('sell')}
                >
                    Sell
                </button>
            </div>
            <div style={{ padding: '24px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>ORDER TYPE</span>
                    <select style={{ background: '#23242a', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '6px 16px', fontSize: 13, fontFamily: 'Roboto Mono, monospace', minWidth: 120 }}>
                        <option>Market</option>
                        <option>Limit</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>EST. MARKET PRICE</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'Roboto Mono, monospace', fontSize: 16 }}>{data?.estMarketPrice ? data.estMarketPrice : '--'}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <span style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>AMOUNT</span>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <input
                            style={{ flex: 1, background: '#23242a', border: '1px solid #333', color: '#fff', borderRadius: 6, padding: '8px 12px', fontSize: 13, fontFamily: 'Roboto Mono, monospace' }}
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                        />
                        <button
                            style={{
                                background: amountUnit === 'USD' ? accentColor : '#23242a',
                                color: amountUnit === 'USD' ? '#111' : '#fff',
                                border: '1px solid #333',
                                borderRadius: 6,
                                padding: '8px 16px',
                                fontSize: 13,
                                fontWeight: 600,
                                fontFamily: 'Roboto Mono, monospace',
                                boxShadow: amountUnit === 'USD' ? `0 0 0 2px ${accentColor}55` : 'none',
                                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s'
                            }}
                            onClick={() => setAmountUnit('USD')}
                        >USD</button>
                        <button
                            style={{
                                background: amountUnit === 'BTC' ? accentColor : '#23242a',
                                color: amountUnit === 'BTC' ? '#111' : '#fff',
                                border: '1px solid #333',
                                borderRadius: 6,
                                padding: '8px 16px',
                                fontSize: 13,
                                fontWeight: 600,
                                fontFamily: 'Roboto Mono, monospace',
                                boxShadow: amountUnit === 'BTC' ? `0 0 0 2px ${accentColor}55` : 'none',
                                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s'
                            }}
                            onClick={() => setAmountUnit('BTC')}
                        >BTC</button>
                    </div>
                </div>
                <div style={{ textAlign: 'center', color: '#888', fontSize: 12, margin: '4px 0 8px 0', letterSpacing: 1 }}>OR</div>
                <div style={{ marginBottom: 8 }}>
                    <span style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>LEVERAGE</span>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9.]*"
                            value={leverage}
                            onChange={e => {
                                const val = e.target.value.replace(/[^\d.]/g, '');
                                setLeverage(val);
                            }}
                            style={{
                                background: '#23242a',
                                color: '#fff',
                                border: '1px solid #333',
                                borderRadius: 6,
                                padding: '10px 0',
                                width: 70,
                                fontWeight: 600,
                                fontSize: 13,
                                fontFamily: 'Roboto Mono, monospace',
                                textAlign: 'center',
                                marginRight: 8
                            }}
                            placeholder="0.0x"
                        />
                        {[2.0, 5.0, 10.0].map(lv => (
                            <button
                                key={lv}
                                style={{
                                    background: parseFloat(leverage) === lv ? accentColor : '#23242a',
                                    color: parseFloat(leverage) === lv ? '#111' : '#fff',
                                    border: '1px solid #333',
                                    borderRadius: 6,
                                    padding: '10px 0',
                                    width: 50,
                                    fontWeight: 600,
                                    fontSize: 13,
                                    fontFamily: 'Roboto Mono, monospace',
                                    boxShadow: parseFloat(leverage) === lv ? `0 0 0 2px ${accentColor}55` : 'none',
                                    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                                    textAlign: 'center'
                                }}
                                onClick={() => setLeverage(lv.toFixed(1))}
                            >
                                {lv.toFixed(1)}x
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                    <span style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>EXECUTION</span>
                    <div style={{ display: 'flex', gap: 32, marginTop: 4, alignItems: 'center', paddingLeft: 2 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#aaa', fontSize: 14, fontFamily: 'Roboto Mono, monospace', minWidth: 120, justifyContent: 'flex-start' }}>
                            <input
                                type="checkbox"
                                checked={postOnly}
                                onChange={e => setPostOnly(e.target.checked)}
                                style={{ accentColor: '#888', width: 18, height: 18, margin: 0 }}
                            />
                            Post-only
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#aaa', fontSize: 14, fontFamily: 'Roboto Mono, monospace', minWidth: 140, justifyContent: 'flex-start' }}>
                            <input
                                type="checkbox"
                                checked={reduceOnly}
                                onChange={e => setReduceOnly(e.target.checked)}
                                style={{ accentColor: '#888', width: 18, height: 18, margin: 0 }}
                            />
                            Reduce-only
                        </label>
                    </div>
                </div>
                <button style={{ width: '100%', padding: '12px 0', borderRadius: 6, fontWeight: 700, fontSize: 13, marginTop: 10, border: 'none', background: tab === 'buy' ? 'linear-gradient(90deg, #00ffae 0%, #0077ff 100%)' : 'linear-gradient(90deg, #ff3c3c 0%, #ffb800 100%)', color: '#111', fontFamily: 'Roboto Mono, monospace', boxShadow: '0 2px 8px #000a', letterSpacing: 1 }}>
                    {tab === 'buy' ? 'Buy' : 'Sell'}
                </button>
                <div style={{ color: '#888', fontSize: 13, fontWeight: 500, marginTop: 18 }}>MAX. ACCOUNT LEVERAGE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.01}
                        value={maxLeverage}
                        onChange={e => {
                            const val = parseFloat(e.target.value);
                            setMaxLeverage(val);
                        }}
                        style={{ flex: 1, accentColor: accentColor }}
                    />
                    <span style={{ color: '#fff', fontFamily: 'Roboto Mono, monospace', fontWeight: 600 }}>{maxLeverage.toFixed(1)}x</span>
                </div>
                <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>CURRENT ACCOUNT LEVERAGE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <input
                        type="text"
                        value={currentLeverage.toFixed(1)}
                        readOnly
                        style={{ width: 70, background: '#23242a', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '6px 0', fontSize: 13, fontFamily: 'Roboto Mono, monospace', textAlign: 'center' }}
                    />
                    <span style={{ color: '#fff', fontFamily: 'Roboto Mono, monospace', fontWeight: 600 }}>x</span>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
