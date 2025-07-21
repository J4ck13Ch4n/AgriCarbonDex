import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      background: '#1a1b1e',
      color: '#aaa',
      textAlign: 'center',
      padding: '24px 0',
      marginTop: 'auto',
      borderTop: '1px solid #333',
      fontFamily: 'Roboto Mono, monospace'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        gap: '12px'
      }}>
        <p style={{
          margin: '0',
          letterSpacing: '1px',
          fontWeight: '500'
        }}>
          © {new Date().getFullYear()} AgriCarbonDex. All rights reserved.
        </p>
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <a
            href="#"
            style={{
              color: '#aaa',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              padding: '4px 8px',
              borderRadius: '4px',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#00ffae';
              e.target.style.background = 'rgba(0, 255, 174, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#aaa';
              e.target.style.background = 'transparent';
            }}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            style={{
              color: '#aaa',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              padding: '4px 8px',
              borderRadius: '4px',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#00ffae';
              e.target.style.background = 'rgba(0, 255, 174, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#aaa';
              e.target.style.background = 'transparent';
            }}
          >
            Terms of Service
          </a>
          <a
            href="#"
            style={{
              color: '#aaa',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              padding: '4px 8px',
              borderRadius: '4px',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#00ffae';
              e.target.style.background = 'rgba(0, 255, 174, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#aaa';
              e.target.style.background = 'transparent';
            }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;