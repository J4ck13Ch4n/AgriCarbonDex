import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// THAY ĐỔI: Thêm onDisconnect prop
const Navbar = ({ account, connecting, onConnect, onDisconnect }) => {
    const location = useLocation();
    const shortAddress = acc => acc ? `${acc.slice(0, 6)}...${acc.slice(-4)}` : '';

    const isActiveLink = (path) => location.pathname === path;

    return (
        <nav className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-emerald-900 to-green-700 text-white shadow-lg z-10 w-full fixed top-0">
            <div className="flex items-center space-x-4">
                <Link to="/" className="text-3xl font-extrabold tracking-tight hover:text-emerald-200 transition-colors duration-300">
                    🌱 AgriCarbonDex
                </Link>
            </div>

            <div className="flex space-x-6 text-lg font-medium">
                <Link 
                    to="/trade" 
                    className={`transition-colors duration-300 ${isActiveLink('/trade') ? 'text-emerald-100 font-bold border-b-2 border-emerald-300 pb-1' : 'text-gray-300 hover:text-white'}`}
                >
                    Trade
                </Link>
                <Link 
                    to="/buy" 
                    className={`transition-colors duration-300 ${isActiveLink('/buy') ? 'text-emerald-100 font-bold border-b-2 border-emerald-300 pb-1' : 'text-gray-300 hover:text-white'}`}
                >
                    Buy
                </Link>
                <Link 
                    to="/sell" 
                    className={`transition-colors duration-300 ${isActiveLink('/sell') ? 'text-emerald-100 font-bold border-b-2 border-emerald-300 pb-1' : 'text-gray-300 hover:text-white'}`}
                >
                    Sell
                </Link>
                <Link 
                    to="/list" 
                    className={`transition-colors duration-300 ${isActiveLink('/list') ? 'text-emerald-100 font-bold border-b-2 border-emerald-300 pb-1' : 'text-gray-300 hover:text-white'}`}
                >
                    List
                </Link>
                <Link 
                    to="/dashboard" 
                    className={`transition-colors duration-300 ${isActiveLink('/dashboard') ? 'text-emerald-100 font-bold border-b-2 border-emerald-300 pb-1' : 'text-gray-300 hover:text-white'}`}
                >
                    Dashboard
                </Link>
            </div>

            <div>
                {account ? (
                    // THAY ĐỔI: Hiển thị địa chỉ và nút Disconnect
                    <div className="flex items-center space-x-2">
                        <span className="bg-gray-800 text-emerald-300 border border-emerald-500 rounded-full 
                                       px-4 py-2 text-sm font-mono font-semibold tracking-wide 
                                       cursor-default min-w-32 flex justify-center items-center">
                            {shortAddress(account)}
                        </span>
                        <button
                            onClick={onDisconnect} // Gọi hàm onDisconnect khi click
                            className="bg-red-600 text-white border border-red-600 rounded-full 
                                       px-3 py-2 text-sm font-semibold shadow-md 
                                       hover:bg-red-700 transition-colors duration-300"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        className={`bg-emerald-500 text-gray-900 border border-emerald-500 rounded-full 
                                    px-5 py-2 text-sm font-semibold tracking-wide shadow-md 
                                    hover:bg-emerald-400 transition-all duration-300 
                                    ${connecting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={onConnect}
                        disabled={connecting}
                    >
                        {connecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;