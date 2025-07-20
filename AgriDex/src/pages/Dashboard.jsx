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
    <div className="min-h-[calc(100vh-theme(spacing.20))] bg-gray-900 text-white p-6 sm:p-10">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-emerald-400 mb-10">Your Dashboard</h1>
      
      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
        {/* User CCT Balance */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:border-emerald-500 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-emerald-300 mb-3">Your CCT Balance</h2>
          <p className="text-4xl font-bold text-white">{userStats.cctBalance} CCT</p>
          <p className="text-gray-400 mt-2">Carbon Credit Token</p>
        </div>

        {/* User NFT Count */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:border-emerald-500 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-emerald-300 mb-3">Your Carbon Offset NFTs</h2>
          <p className="text-4xl font-bold text-white">{userStats.offsetNftsOwned} NFTs</p>
          <p className="text-gray-400 mt-2">Representing {userStats.totalCarbonOffset} tons of CO2 offset</p>
        </div>

        {/* Platform Volume (Example for a general metric) */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 hover:border-emerald-500 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-emerald-300 mb-3">Platform Trading Volume</h2>
          <p className="text-4xl font-bold text-white">${platformStats.platformVolumeUsd.toLocaleString()}</p>
          <p className="text-gray-400 mt-2">Total value traded on AgriCarbonDex</p>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="mb-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-emerald-300 mb-6 text-center">Platform Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Total NFTs Listed</h3>
            <p className="text-3xl font-bold text-white mt-2">{platformStats.totalNftsListed}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Total Trades</h3>
            <p className="text-3xl font-bold text-white mt-2">{platformStats.totalTrades}</p>
          </div>
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="max-w-7xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-emerald-300 mb-6 text-center">Recent Transactions</h2>
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Asset
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {tx.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {tx.asset}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400">
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`
                    }>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentTransactions.length === 0 && (
            <p className="text-center text-gray-500 py-8">No recent transactions found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;