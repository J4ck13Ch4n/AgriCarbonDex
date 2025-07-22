import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    cctBalance: 12500,
    offsetNftsOwned: 5,
    totalCarbonOffset: 25000,
  });

  const [platformStats, setPlatformStats] = useState({
    totalNftsListed: 150,
    totalTrades: 789,
    platformVolumeUsd: 1500000,
    tradesLastHour: 23,
    avgLatencySeconds: 15,
  });

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, type: 'Buy NFT', amount: '5 CCT', asset: 'Forest 001 NFT', date: '2025-07-19', status: 'Completed' },
    { id: 2, type: 'List NFT', amount: '10 CCT', asset: 'Ocean Cleanup NFT', date: '2025-07-18', status: 'Completed' },
    { id: 3, type: 'Receive CCT', amount: '1000 CCT', asset: 'Airdrop', date: '2025-07-17', status: 'Completed' },
    { id: 4, type: 'Sell NFT', amount: '8 CCT', asset: 'Wind Farm NFT', date: '2025-07-16', status: 'Pending' },
  ]);

  const [transactionActivity, setTransactionActivity] = useState([
    { date: 'Jul 17', 'Buy': 20, 'Sell': 30 },
    { date: 'Jul 18', 'Buy': 40, 'Sell': 25 },
    { date: 'Jul 19', 'Buy': 50, 'Sell': 45 },
    { date: 'Jul 20', 'Buy': 30, 'Sell': 60 },
    { date: 'Jul 21', 'Buy': 60, 'Sell': 50 },
    { date: 'Jul 22', 'Buy': 70, 'Sell': 80 },
    { date: 'Jul 23', 'Buy': 90, 'Sell': 70 },
  ]);

  const [latencyMeasurement, setLatencyMeasurement] = useState({
    status: 'idle', // idle, measuring, success, error
    latency: null,
    error: null,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate platform stats changing
      setPlatformStats(prevStats => ({
        ...prevStats,
        totalTrades: prevStats.totalTrades + 1,
        platformVolumeUsd: prevStats.platformVolumeUsd + Math.floor(Math.random() * 500),
        tradesLastHour: Math.floor(Math.random() * 10) + 20,
        avgLatencySeconds: Math.floor(Math.random() * 5) + 13,
      }));

      // Simulate a new transaction appearing occasionally
      if (Math.random() > 0.7) { // ~30% chance every 3 seconds
        const newTx = {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'Buy NFT' : 'Sell NFT',
          amount: `${(Math.random() * 10).toFixed(0)} CCT`,
          asset: `Project ${(Math.random() * 1000).toFixed(0)} NFT`,
          date: new Date().toISOString().split('T')[0].replace(/-/g, '-'),
          status: 'Completed'
        };

        setRecentTransactions(prevTxs => [newTx, ...prevTxs].slice(0, 5));

        // Update user stats based on the new transaction
        if (newTx.type === 'Buy NFT') {
          setUserStats(prevStats => ({
            ...prevStats,
            cctBalance: prevStats.cctBalance - parseInt(newTx.amount),
            offsetNftsOwned: prevStats.offsetNftsOwned + 1,
          }));
        } else { // Sell NFT
            setUserStats(prevStats => ({
            ...prevStats,
            cctBalance: prevStats.cctBalance + parseInt(newTx.amount),
            offsetNftsOwned: prevStats.offsetNftsOwned > 0 ? prevStats.offsetNftsOwned - 1 : 0,
          }));
        }
      }

      // Simulate chart data changing
      setTransactionActivity(prevActivity => {
        const newActivity = [...prevActivity];
        const lastDataPoint = { ...newActivity[newActivity.length - 1] };
        lastDataPoint['Buy'] += Math.floor(Math.random() * 3);
        lastDataPoint['Sell'] += Math.floor(Math.random() * 3);
        newActivity[newActivity.length - 1] = lastDataPoint;
        return newActivity;
      });

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Function to measure real transaction latency
  const measureLatency = async () => {
    if (!window.ethereum) {
      setLatencyMeasurement({ status: 'error', latency: null, error: 'MetaMask is not installed. Please install it to use this feature.' });
      return;
    }

    try {
      setLatencyMeasurement({ status: 'measuring', latency: null, error: null });

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const startTime = Date.now();

      // Send a minimal transaction to self to measure confirmation time
      const tx = await signer.sendTransaction({
        to: address,
        value: ethers.parseUnits("1", "gwei") // Send 1 Gwei, a very small amount
      });

      await tx.wait(); // Wait for the transaction to be mined

      const endTime = Date.now();
      const measuredLatency = ((endTime - startTime) / 1000).toFixed(2);

      setLatencyMeasurement({ status: 'success', latency: measuredLatency, error: null });

      // Update the dashboard with the new measurement
      setPlatformStats(prevStats => ({
        ...prevStats,
        avgLatencySeconds: measuredLatency,
      }));

    } catch (err) {
      console.error(err);
      setLatencyMeasurement({ status: 'error', latency: null, error: err.message });
    }
  };

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

        {/* Transaction Activity Chart */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#00ffae', marginBottom: '24px', textAlign: 'center' }}>Transaction Activity (Last 7 Days)</h2>
          <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={transactionActivity}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip contentStyle={{ backgroundColor: '#111214', border: '1px solid #333' }} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="Buy" stroke="#00ffae" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Sell" stroke="#ff6b6b" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Platform Statistics */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#00ffae', marginBottom: '24px', textAlign: 'center' }}>Platform Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#aaa' }}>Total NFTs Listed</h3>
              <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#fff', marginTop: '8px' }}>{platformStats.totalNftsListed}</p>
            </div>
            <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#aaa' }}>Total Trades</h3>
              <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#fff', marginTop: '8px' }}>{platformStats.totalTrades}</p>
            </div>
            <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#aaa' }}>Trades per Hour</h3>
              <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#fff', marginTop: '8px' }}>{platformStats.tradesLastHour}</p>
            </div>
            <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#aaa' }}>Avg. Latency</h3>
              <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#fff', marginTop: '8px' }}>{platformStats.avgLatencySeconds}s</p>
            </div>
          </div>
        </section>

        {/* Latency Measurement Tool */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#00ffae', marginBottom: '24px', textAlign: 'center' }}>Live Transaction Latency</h2>
          <div style={{ background: '#232426', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px #0002', border: '1px solid #333', textAlign: 'center' }}>
            <p style={{ color: '#aaa', marginBottom: '16px' }}>Click the button to send a live transaction and measure the confirmation time.</p>
            <button
              onClick={measureLatency}
              disabled={latencyMeasurement.status === 'measuring'}
              style={{
                background: latencyMeasurement.status === 'measuring' ? '#555' : '#00ffae',
                color: latencyMeasurement.status === 'measuring' ? '#aaa' : '#111214',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {latencyMeasurement.status === 'measuring' ? 'Measuring...' : 'Start Latency Test'}
            </button>
            {latencyMeasurement.status === 'success' && (
              <p style={{ color: '#00ffae', marginTop: '16px' }}>
                Success! Last transaction confirmed in {latencyMeasurement.latency} seconds.
              </p>
            )}
            {latencyMeasurement.status === 'error' && (
              <p style={{ color: '#ff6b6b', marginTop: '16px', maxWidth: '600px', margin: '16px auto 0' }}>
                Error: {latencyMeasurement.error}
              </p>
            )}
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