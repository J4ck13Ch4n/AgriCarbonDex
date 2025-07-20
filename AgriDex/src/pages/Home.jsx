import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 sm:p-10 font-sans">
      {/* Hero Section */}
      <section className="text-center mb-16 max-w-4xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-emerald-400 leading-tight mb-4 animate-fade-in-down">
          AgriCarbonDex
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 animate-fade-in-up">
          Transparent Carbon Credit NFT Trading Platform on Blockchain
        </p>
        <p className="text-lg text-gray-400 mb-10 leading-relaxed animate-fade-in-up delay-200">
          Transform carbon offset projects into NFTs (ERC-721) and trade them efficiently and securely using Carbon Credit Token (CCT - ERC-20). All transactions are permanently recorded on the blockchain.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-400">
          <Link 
            to="/trade" 
            className="px-8 py-4 bg-emerald-600 text-white text-xl font-bold rounded-lg shadow-lg 
                       hover:bg-emerald-500 transform hover:scale-105 transition duration-300 ease-in-out
                       focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
          >
            Start Trading
          </Link>
          <Link 
            to="/list" 
            className="px-8 py-4 bg-gray-700 text-gray-100 text-xl font-bold rounded-lg shadow-lg 
                       hover:bg-gray-600 transform hover:scale-105 transition duration-300 ease-in-out
                       focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
          >
            List Your NFT
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mt-16 p-8 bg-gray-800 rounded-xl shadow-2xl animate-fade-in-up delay-600">
        <h2 className="text-4xl font-bold text-center text-emerald-300 mb-12">Why Choose AgriCarbonDex?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-700 rounded-lg shadow-lg transition duration-300 hover:bg-gray-600">
            <div className="text-6xl text-emerald-400 mb-4">🌳</div>
            <h3 className="text-2xl font-semibold text-white mb-3">Digitized Carbon Credits</h3>
            <p className="text-gray-300 text-lg">
              Convert carbon offset projects into unique, transparent digital assets in the form of NFTs (ERC-721).
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-700 rounded-lg shadow-lg transition duration-300 hover:bg-gray-600">
            <div className="text-6xl text-emerald-400 mb-4">🔗</div>
            <h3 className="text-2xl font-semibold text-white mb-3">Transparency & Decentralization</h3>
            <p className="text-gray-300 text-lg">
              Every transaction is recorded on the blockchain, ensuring integrity, immutability, and no intermediaries.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-700 rounded-lg shadow-lg transition duration-300 hover:bg-gray-600">
            <div className="text-6xl text-emerald-400 mb-4">💰</div>
            <h3 className="text-2xl font-semibold text-white mb-3">Efficient Trading</h3>
            <p className="text-gray-300 text-lg">
              Use Carbon Credit Token (CCT - ERC-20) to seamlessly buy, sell, and exchange Carbon Credit NFTs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer (Simple) */}
      <footer className="mt-20 text-gray-500 text-sm">
        © {new Date().getFullYear()} AgriCarbonDex. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
