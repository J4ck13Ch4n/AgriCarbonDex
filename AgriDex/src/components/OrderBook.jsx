import React, { useState } from 'react';

const OrderBook = () => {
    const [tab, setTab] = useState('orderbook');
    return (
        <div className="card-dark p-0 flex flex-col min-h-[400px]" style={{ minWidth: 340, maxHeight: 480, height: 480, position: 'relative', paddingBottom: 44 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #23242a' }}>
                <button
                    className={tab === 'orderbook' ? 'active' : ''}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px 0',
                        fontFamily: 'Roboto Mono,monospace',
                        fontWeight: 600,
                        fontSize: 16,
                        color: tab === 'orderbook' ? '#00ffae' : '#fff',
                        background: '#181A20',
                        border: 'none',
                        borderTopLeftRadius: 10,
                        borderBottom: tab === 'orderbook' ? '2px solid #00ffae' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'color 0.2s, border 0.2s',
                    }}
                    onClick={() => setTab('orderbook')}
                >
                    Orderbook
                </button>
                <button
                    className={tab === 'recent' ? 'active' : ''}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px 0',
                        fontFamily: 'Roboto Mono,monospace',
                        fontWeight: 600,
                        fontSize: 16,
                        color: tab === 'recent' ? '#00ffae' : '#888',
                        background: '#181A20',
                        border: 'none',
                        borderTopRightRadius: 10,
                        borderBottom: tab === 'recent' ? '2px solid #00ffae' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'color 0.2s, border 0.2s',
                    }}
                    onClick={() => setTab('recent')}
                >
                    Recent Trades
                </button>
            </div>
            <div className="orderbook-section" style={{ padding: '16px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                    {tab === 'orderbook' ? (
                        <>
                            <table className="orderbook-table" style={{ width: '100%', fontSize: 13, tableLayout: 'fixed' }}>
                                <colgroup>
                                    <col style={{ width: '33.33%' }} />
                                    <col style={{ width: '33.33%' }} />
                                    <col style={{ width: '33.33%' }} />
                                </colgroup>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #23242a' }}>
                                        <th style={{ color: '#888', fontWeight: 500, padding: '4px 0', textAlign: 'left', width: '33.33%' }}>PRICE($)</th>
                                        <th style={{ color: '#888', fontWeight: 500, padding: '4px 0', textAlign: 'center', width: '33.33%' }}>SIZE(SOL)</th>
                                        <th style={{ color: '#888', fontWeight: 500, padding: '4px 0', textAlign: 'right', width: '33.33%' }}>TOTAL($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', color: '#888', fontSize: 13, padding: '12px 0' }}>No data</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <table className="orderbook-table" style={{ width: '100%', fontSize: 13, tableLayout: 'fixed' }}>
                            <colgroup>
                                <col style={{ width: '25%' }} />
                                <col style={{ width: '25%' }} />
                                <col style={{ width: '25%' }} />
                                <col style={{ width: '25%' }} />
                            </colgroup>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #23242a' }}>
                                    <th style={{ color: '#888', fontWeight: 500, padding: '4px 0', textAlign: 'left' }}>Time</th>
                                    <th style={{ color: '#888', fontWeight: 500, padding: '4px 0', textAlign: 'center' }}>Price</th>
                                    <th style={{ color: '#888', fontWeight: 500, padding: '4px 0', textAlign: 'center' }}>Amount</th>
                                    <th style={{ color: '#888', fontWeight: 500, padding: '4px 0', textAlign: 'right' }}>Side</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', color: '#888', fontSize: 13, padding: '12px 0' }}>No data</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', width: '100%', marginTop: 0, borderTop: '1px solid #23242a', background: '#181A20', position: 'absolute', left: 0, bottom: 0, height: 44, alignItems: 'center', padding: '0 24px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    {tab === 'orderbook' && (
                        <span style={{ color: '#888', fontSize: 12 }}>PRECISION</span>
                    )}
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {tab === 'orderbook' && (
                        <select style={{ background: '#181A20', color: '#fff', border: 'none', fontSize: 12, borderRadius: 4, padding: '2px 8px', outline: 'none' }} defaultValue="1.0">
                            <option value="1.0">1.0</option>
                            <option value="1.00">1.00</option>
                            <option value="1.000">1.000</option>
                            <option value="1.0000">1.0000</option>
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderBook;
