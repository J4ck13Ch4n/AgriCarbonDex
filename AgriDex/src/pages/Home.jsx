import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#111214', color: '#fff', fontFamily: 'Inter, Roboto Mono, Arial, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 64px', minHeight: '100vh' }}>

        {/* Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '800px' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            color: '#fff',
            lineHeight: '1.2',
            marginBottom: '16px',
            fontFamily: 'Roboto Mono, monospace',
            letterSpacing: '2px'
          }}>
            AgriCarbonDex
          </h1>
          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            color: '#aaa',
            marginBottom: '32px',
            fontWeight: '500'
          }}>
            Transparent Carbon Credit NFT Trading Platform on Blockchain
          </p>
          <p style={{
            fontSize: '1.125rem',
            color: '#aaa',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Transform carbon offset projects into NFTs (ERC-721) and trade them efficiently and securely using Carbon Credit Token (CCT - ERC-20). All transactions are permanently recorded on the blockchain.
          </p>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
              <Link
                to="/trade"
                style={{
                  padding: '16px 32px',
                  background: '#00ffae',
                  color: '#111',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0, 255, 174, 0.3)',
                  transition: 'all 0.2s ease',
                  border: '1px solid #00ffae',
                  fontFamily: 'Roboto Mono, monospace',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 174, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 255, 174, 0.3)';
                }}
              >
                Start Trading
              </Link>
              <Link
                to="/list"
                style={{
                  padding: '16px 32px',
                  background: '#232426',
                  color: '#fff',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px #0002',
                  transition: 'all 0.2s ease',
                  border: '1px solid #333',
                  fontFamily: 'Roboto Mono, monospace',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.background = '#333';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = '#232426';
                  e.target.style.boxShadow = '0 2px 8px #0002';
                }}
              >
                List Your NFT
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          width: '100%',
          maxWidth: '1200px',
          marginTop: '64px',
          padding: '32px',
          background: '#1a1b1e',
          borderRadius: '16px',
          boxShadow: '0 4px 16px #0002',
          border: '1px solid #333'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            color: '#00ffae',
            marginBottom: '48px',
            fontFamily: 'Roboto Mono, monospace',
            letterSpacing: '2px'
          }}>
            Why Choose AgriCarbonDex?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {/* Feature 1 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px',
              background: '#232426',
              borderRadius: '12px',
              border: '1px solid #333',
              boxShadow: '0 2px 8px #0002',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.background = '#2a2b2d';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#232426';
                e.currentTarget.style.boxShadow = '0 2px 8px #0002';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌳</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '12px',
                fontFamily: 'Roboto Mono, monospace'
              }}>
                Digitized Carbon Credits
              </h3>
              <p style={{
                color: '#aaa',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                Convert carbon offset projects into unique, transparent digital assets in the form of NFTs (ERC-721).
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px',
              background: '#232426',
              borderRadius: '12px',
              border: '1px solid #333',
              boxShadow: '0 2px 8px #0002',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.background = '#2a2b2d';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#232426';
                e.currentTarget.style.boxShadow = '0 2px 8px #0002';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔗</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '12px',
                fontFamily: 'Roboto Mono, monospace'
              }}>
                Transparency & Decentralization
              </h3>
              <p style={{
                color: '#aaa',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                Every transaction is recorded on the blockchain, ensuring integrity, immutability, and no intermediaries.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px',
              background: '#232426',
              borderRadius: '12px',
              border: '1px solid #333',
              boxShadow: '0 2px 8px #0002',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.background = '#2a2b2d';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#232426';
                e.currentTarget.style.boxShadow = '0 2px 8px #0002';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💰</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '12px',
                fontFamily: 'Roboto Mono, monospace'
              }}>
                Efficient Trading
              </h3>
              <p style={{
                color: '#aaa',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                Use Carbon Credit Token (CCT - ERC-20) to seamlessly buy, sell, and exchange Carbon Credit NFTs.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
