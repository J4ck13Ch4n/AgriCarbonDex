import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

// THAY ĐỔI: Thêm onDisconnect prop
const Navbar = ({ account, connecting, onConnect, onDisconnect }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const shortAddress = acc => acc ? `${acc.slice(0, 6)}...${acc.slice(-4)}` : '';

    const isActiveLink = (path) => location.pathname === path;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            background: '#111214',
            color: '#fff',
            boxShadow: '0 2px 8px #0002',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            borderBottom: '1px solid #333'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link to="/" style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontFamily: 'Roboto Mono, monospace',
                    transition: 'color 0.3s ease'
                }}
                    onMouseEnter={(e) => e.target.style.color = '#00ffae'}
                    onMouseLeave={(e) => e.target.style.color = '#fff'}>
                    AgriCarbonDex
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '24px', fontSize: '1rem', fontWeight: '500' }}>
                <Link
                    to="/dashboard"
                    style={{
                        color: isActiveLink('/dashboard') ? '#00ffae' : '#aaa',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        if (!isActiveLink('/dashboard')) {
                            e.target.style.color = '#fff';
                            e.target.style.background = '#333';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActiveLink('/dashboard')) {
                            e.target.style.color = '#aaa';
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    Dashboard
                </Link>
                <Link
                    to="/trade"
                    style={{
                        color: isActiveLink('/trade') ? '#00ffae' : '#aaa',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        if (!isActiveLink('/trade')) {
                            e.target.style.color = '#fff';
                            e.target.style.background = '#333';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActiveLink('/trade')) {
                            e.target.style.color = '#aaa';
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    Marketplace
                </Link>
                <Link
                    to="/list"
                    style={{
                        color: isActiveLink('/list') ? '#00ffae' : '#aaa',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        if (!isActiveLink('/list')) {
                            e.target.style.color = '#fff';
                            e.target.style.background = '#333';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActiveLink('/list')) {
                            e.target.style.color = '#aaa';
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    NFTs
                </Link>

            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                {account ? (
                    // Connected State - Dropdown Menu Style
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'linear-gradient(135deg, #232426 0%, #1a1b1e 100%)',
                                border: '1px solid #333',
                                borderRadius: '12px',
                                padding: '8px 12px',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '0.875rem',
                                fontFamily: 'Roboto Mono, monospace',
                                minWidth: '140px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #2a2b2d 0%, #1f2021 100%)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #232426 0%, #1a1b1e 100%)';
                            }}
                        >
                            {/* Avatar Circle */}
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: '#fff'
                            }}>
                                {account ? account.slice(2, 4).toUpperCase() : '??'}
                            </div>

                            {/* Address - Màu xanh khi connected */}
                            <span style={{
                                color: '#00ffae',
                                fontWeight: '600',
                                letterSpacing: '0.5px'
                            }}>
                                {shortAddress(account)}
                            </span>

                            {/* Dropdown Arrow */}
                            <span style={{
                                color: '#aaa',
                                fontSize: '0.75rem',
                                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                            }}>
                                ▼
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                marginTop: '8px',
                                background: '#232426',
                                border: '1px solid #333',
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                                minWidth: '200px',
                                zIndex: 1000,
                                overflow: 'hidden'
                            }}>
                                {/* Wallet Info Header */}
                                <div style={{
                                    padding: '16px',
                                    borderBottom: '1px solid #333',
                                    background: '#1a1b1e'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '8px'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.875rem',
                                            fontWeight: '700',
                                            color: '#fff'
                                        }}>
                                            {account ? account.slice(2, 4).toUpperCase() : '??'}
                                        </div>
                                        <div>
                                            <div style={{
                                                color: '#fff',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                fontFamily: 'Roboto Mono, monospace'
                                            }}>
                                                {shortAddress(account)}
                                            </div>
                                            <div style={{
                                                color: '#00ffae',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <div style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: '#00ffae',
                                                    boxShadow: '0 0 6px rgba(0, 255, 174, 0.6)'
                                                }}></div>
                                                Connected
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div style={{ padding: '8px 0' }}>
                                    {/* Activity */}
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            // Handle activity navigation
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#aaa',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#2a2b2d';
                                            e.target.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#aaa';
                                        }}
                                    >
                                        Activity
                                    </button>

                                    {/* Separator */}
                                    <div style={{
                                        height: '1px',
                                        background: '#333',
                                        margin: '8px 16px'
                                    }}></div>

                                    {/* Disconnect */}
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            onDisconnect();
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ef4444',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#2a2b2d';
                                            e.target.style.color = '#ff6b6b';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#ef4444';
                                        }}
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Connect Button - Modern Design with Gradient
                    <button
                        style={{
                            background: connecting
                                ? 'linear-gradient(135deg, #333 0%, #2a2b2d 100%)'
                                : 'linear-gradient(135deg, #00ffae 0%, #22c55e 100%)',
                            color: connecting ? '#aaa' : '#111',
                            border: `1px solid ${connecting ? '#333' : '#00ffae'}`,
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            fontFamily: 'Roboto Mono, monospace',
                            transition: 'all 0.3s ease',
                            cursor: connecting ? 'not-allowed' : 'pointer',
                            opacity: connecting ? 0.6 : 1,
                            boxShadow: connecting
                                ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                                : '0 4px 16px rgba(0, 255, 174, 0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                            minWidth: '140px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onClick={onConnect}
                        disabled={connecting}
                        onMouseEnter={(e) => {
                            if (!connecting) {
                                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 174, 0.4)';
                                e.target.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!connecting) {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 4px 16px rgba(0, 255, 174, 0.3)';
                                e.target.style.background = 'linear-gradient(135deg, #00ffae 0%, #22c55e 100%)';
                            }
                        }}
                    >
                        {connecting ? (
                            <>
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid #aaa',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                Connecting...
                            </>
                        ) : (
                            'Connect Wallet'
                        )}
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
