import React from 'react';

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const INSTAGRAM_LINK = "https://www.instagram.com/nour_alfy_handmade_store?igsh=MTQxa3RqMG0wOTI2NQ%3D%3D";

export default function InstagramFeed() {
  return (
    <section style={{ padding: '4rem 5%', backgroundColor: 'var(--bg-dark)', textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a 
          href={INSTAGRAM_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', color: 'var(--primary-gold)', textDecoration: 'none', transition: 'opacity 0.3s' }}
          className="hover-glow"
        >
          <InstagramIcon size={32} />
          <h2 style={{ margin: 0, fontSize: 'clamp(1.2rem, 5vw, 2rem)', fontWeight: 300, letterSpacing: '1px', wordBreak: 'break-word' }}>Follow Us @nour_alfy_handmade_store</h2>
        </a>
        <p style={{ color: 'var(--secondary-text)', marginTop: '10px' }}>Join our community for the latest handcrafted designs.</p>
      </div>
    </section>
  );
}

