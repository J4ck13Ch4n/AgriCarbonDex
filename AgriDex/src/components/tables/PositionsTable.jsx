import React from 'react';

const PositionsTable = ({ data = [] }) => (
    <table className="table-dark w-full text-xs" style={{ tableLayout: 'fixed', width: '100%' }}>
        <colgroup>
            <col style={{ width: '16%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
        </colgroup>
        <thead>
            <tr>
                <th style={{ color: '#888', fontWeight: 500, fontSize: 13, fontFamily: 'Roboto Mono, monospace', background: '#181A20', textAlign: 'left', padding: '4px 0', borderBottom: '1px solid #23242a' }}>MARKET</th>
                <th style={{ color: '#888', fontWeight: 500, fontSize: 13, fontFamily: 'Roboto Mono, monospace', background: '#181A20', textAlign: 'center', padding: '4px 0', borderBottom: '1px solid #23242a' }}>SIDE</th>
                <th style={{ color: '#888', fontWeight: 500, fontSize: 13, fontFamily: 'Roboto Mono, monospace', background: '#181A20', textAlign: 'right', padding: '4px 0', borderBottom: '1px solid #23242a' }}>PRICE</th>
                <th style={{ color: '#888', fontWeight: 500, fontSize: 13, fontFamily: 'Roboto Mono, monospace', background: '#181A20', textAlign: 'right', padding: '4px 0', borderBottom: '1px solid #23242a' }}>REMAINING</th>
                <th style={{ color: '#888', fontWeight: 500, fontSize: 13, fontFamily: 'Roboto Mono, monospace', background: '#181A20', textAlign: 'right', padding: '4px 0', borderBottom: '1px solid #23242a' }}>TRADE VALUE</th>
                <th style={{ background: '#181A20', borderBottom: '1px solid #23242a', textAlign: 'center' }}></th>
                <th style={{ background: '#181A20', borderBottom: '1px solid #23242a', textAlign: 'center' }}></th>
            </tr>
        </thead>
        <tbody>
            {data.length === 0 ? (
                <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '16px 0' }}>No data</td>
                </tr>
            ) : (
                data.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #23242a' }}>
                        <td style={{ textAlign: 'left', color: '#fff', fontWeight: 500 }}>
                            {row.market}
                            <div style={{ color: '#888', fontSize: 12 }}>{row.marketSub}</div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '2px 12px',
                                borderRadius: 6,
                                fontWeight: 600,
                                fontSize: 13,
                                background: row.side === 'LONG' ? '#003f2d' : '#3f0000',
                                color: row.side === 'LONG' ? '#00ffae' : '#ff3c3c',
                                border: `1px solid ${row.side === 'LONG' ? '#00ffae' : '#ff3c3c'}`
                            }}>{row.side}</span>
                        </td>
                        <td style={{ textAlign: 'right', color: '#fff' }}>{row.price}</td>
                        <td style={{ textAlign: 'right', color: '#fff' }}>{row.remaining}</td>
                        <td style={{ textAlign: 'right', color: '#fff' }}>{row.tradeValue}</td>
                        <td style={{ textAlign: 'center' }}>
                            <span style={{ cursor: 'pointer' }} title="Edit">
                                <svg width="16" height="16" fill="#888" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                            </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            <span style={{ cursor: 'pointer' }} title="Delete">
                                <svg width="16" height="16" fill="#888" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm2 3h14v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm3 2v9h2v-9H8zm4 0v9h2v-9h-2z" /></svg>
                            </span>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </table>
);

export default PositionsTable;
