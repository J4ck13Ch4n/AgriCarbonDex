import React from 'react';

const PriceChart = () => (
    <div
        className="card-dark flex flex-col items-center justify-center"
        style={{
            background: '#181A20',
            border: '1px solid #23242a',
            borderRadius: 10,
            width: 'calc(100% + 32px)',
            height: 420,
            minHeight: 420,
            maxHeight: 420,
            position: 'relative',
            padding: 0,
            overflow: 'hidden',
            fontFamily: 'Roboto Mono, monospace',
            marginLeft: '-16px'
        }}
    >
        {/* Chart area placeholder */}
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
        }}>
            <span style={{ color: '#444', fontSize: 18, fontWeight: 400 }}>
                {/* Chart will render here */}
            </span>
        </div>
        {/* Chart axes (y-axis, x-axis) placeholder */}
        <div style={{
            position: 'absolute',
            left: 0,
            top: 40,
            bottom: 32,
            width: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#888',
            fontSize: 13,
            zIndex: 2
        }}>
            {[40, 36, 32, 28, 24, 20, 19].map((v, i) => (
                <div key={i} style={{ textAlign: 'right', paddingRight: 6 }}>{v.toFixed(2)}</div>
            ))}
        </div>
        <div style={{
            position: 'absolute',
            left: 48,
            right: 0,
            bottom: 0,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            color: '#888',
            fontSize: 13,
            zIndex: 2
        }}>
            {[15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3].map((v, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>{v < 10 ? `0${v}:00` : `${v}:00`}</div>
            ))}
        </div>
        {/* Chart settings icon placeholder */}
        <div style={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            zIndex: 3
        }}>
            <svg width="18" height="18" fill="#888" viewBox="0 0 24 24"><path d="M19.14,12.94a1.43,1.43,0,0,0,0-1.88l2-1.56a.5.5,0,0,0,.12-.65l-2-3.46a.5.5,0,0,0-.61-.22l-2.35,1a5.37,5.37,0,0,0-1.62-.94l-.36-2.49A.5.5,0,0,0,13,3H11a.5.5,0,0,0-.5.42l-.36,2.49a5.37,5.37,0,0,0-1.62.94l-2.35-1a.5.5,0,0,0-.61.22l-2,3.46a.5.5,0,0,0,.12.65l2,1.56a1.43,1.43,0,0,0,0,1.88l-2,1.56a.5.5,0,0,0-.12.65l2,3.46a.5.5,0,0,0,.61.22l2.35-1a5.37,5.37,0,0,0,1.62.94l.36,2.49A.5.5,0,0,0,11,21h2a.5.5,0,0,0,.5-.42l.36-2.49a5.37,5.37,0,0,0,1.62-.94l2.35,1a.5.5,0,0,0,.61-.22l2-3.46a.5.5,0,0,0-.12-.65ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
        </div>
    </div>
);

export default PriceChart;
