import React from 'react';
import Image from 'next/image';

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

const mockPosts = [
  { id: 1, img: '/products/bag1.jpeg' },
  { id: 2, img: '/products/bag2.jpeg' },
  { id: 3, img: '/products/bag3.jpeg' },
  { id: 4, img: '/products/wallet1.jpeg' },
  { id: 5, img: '/products/bag1.jpeg' },
];

export default function InstagramFeed() {
  return (
    <section style={{ padding: '4rem 5%', backgroundColor: 'var(--bg-dark)', textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a 
          href={INSTAGRAM_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--primary-gold)', textDecoration: 'none', transition: 'opacity 0.3s' }}
          className="hover-glow"
        >
          <InstagramIcon size={32} />
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 300, letterSpacing: '2px' }}>Follow Us @nouralfy</h2>
        </a>
        <p style={{ color: 'var(--secondary-text)', marginTop: '10px' }}>Join our community for the latest handcrafted designs.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {mockPosts.map((post) => (
          <a 
            key={post.id} 
            href={INSTAGRAM_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              position: 'relative', 
              aspectRatio: '1 / 1', 
              overflow: 'hidden', 
              borderRadius: '8px',
              display: 'block'
            }}
            className="instagram-post"
          >
            <Image 
              src={post.img} 
              alt="Instagram Post" 
              fill 
              style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} 
            />
            <div className="instagram-overlay" style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}>
              <InstagramIcon size={32} color="#fff" />
            </div>
          </a>
        ))}
      </div>
      
      <style>{`
        .instagram-post:hover img {
          transform: scale(1.1);
        }
        .instagram-post:hover .instagram-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
