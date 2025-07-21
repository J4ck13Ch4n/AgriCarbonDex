import React from 'react';

const Dashboard = () => {
  const userStats = {
    cctBalance: 12500, // Carbon Credit Token
    offsetNftsOwned: 5,
    totalCarbonOffset: 25000, // total tons of carbon offset by user's NFTs
  };

  const platformStats = {
    totalNftsListed: 150,
    totalTrades: 789,
    platformVolumeUsd: 1500000, // Just a large number for demonstration
  };

  const recentTransactions = [
    { id: 1, type: 'Buy NFT', amount: '5 CCT', asset: 'Forest 001 NFT', date: '2025-07-19', status: 'Completed' },
    { id: 2, type: 'List NFT', amount: '10 CCT', asset: 'Ocean Cleanup NFT', date: '2025-07-18', status: 'Completed' },
    { id: 3, type: 'Receive CCT', amount: '1000 CCT', asset: 'Airdrop', date: '2025-07-17', status: 'Completed' },
    { id: 4, type: 'Sell NFT', amount: '8 CCT', asset: 'Wind Farm NFT', date: '2025-07-16', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#111214', color: '#fff', paddingTop: '80px' }}>
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', color: '#fff', marginBottom: '40px' }}>
          Your Dashboard
        </h1>

        {/* Overview Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {/* User CCT Balance */}
          <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00ffae'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#00ffae', marginBottom: '12px' }}>Your CCT Balance</h2>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff' }}>{userStats.cctBalance} CCT</p>
            <p style={{ color: '#aaa', marginTop: '8px' }}>Carbon Credit Token</p>
          </div>

          {/* User NFT Count */}
          <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00ffae'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#00ffae', marginBottom: '12px' }}>Your Carbon Offset NFTs</h2>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff' }}>{userStats.offsetNftsOwned} NFTs</p>
            <p style={{ color: '#aaa', marginTop: '8px' }}>Representing {userStats.totalCarbonOffset} tons of CO2 offset</p>
          </div>

          {/* Platform Volume */}
          <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00ffae'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#00ffae', marginBottom: '12px' }}>Platform Trading Volume</h2>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff' }}>${platformStats.platformVolumeUsd.toLocaleString()}</p>
            <p style={{ color: '#aaa', marginTop: '8px' }}>Total value traded on AgriCarbonDex</p>
          </div>
        </section>

        {/* Platform Statistics */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#00ffae', marginBottom: '24px', textAlign: 'center' }}>Platform Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#aaa' }}>Total NFTs Listed</h3>
              <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#fff', marginTop: '8px' }}>{platformStats.totalNftsListed}</p>
            </div>
            <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#aaa' }}>Total Trades</h3>
              <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#fff', marginTop: '8px' }}>{platformStats.totalTrades}</p>
            </div>
          </div>
        </section>

        {/* Recent Transactions Table */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#00ffae', marginBottom: '24px', textAlign: 'center' }}>Recent Transactions</h2>
          <div style={{ background: '#232426', borderRadius: '12px', boxShadow: '0 2px 8px #0002', overflow: 'hidden', border: '1px solid #333' }}>
            <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#333' }}>
                <tr>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Type
                  </th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Asset
                  </th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Amount
                  </th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody style={{ background: '#232426' }}>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #333', transition: 'background 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#232426'}>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: '500', color: '#fff' }}>
                      {tx.type}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#aaa' }}>
                      {tx.asset}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#00ffae' }}>
                      {tx.amount}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#aaa' }}>
                      {tx.date}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem' }}>
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        background: tx.status === 'Completed' ? 'rgba(0, 255, 174, 0.1)' : 'rgba(255, 224, 102, 0.1)',
                        color: tx.status === 'Completed' ? '#00ffae' : '#ffe066',
                        border: `1px solid ${tx.status === 'Completed' ? 'rgba(0, 255, 174, 0.3)' : 'rgba(255, 224, 102, 0.3)'}`
                      }}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentTransactions.length === 0 && (
              <p style={{ textAlign: 'center', color: '#aaa', padding: '32px' }}>No recent transactions found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;