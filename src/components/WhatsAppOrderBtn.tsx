'use client';

import React from 'react';

type WhatsAppOrderBtnProps = {
  product: {
    id: string;
    name: string;
    price: number;
  };
  className?: string;
};

export default function WhatsAppOrderBtn({ product, className = '' }: WhatsAppOrderBtnProps) {
  const handleWhatsAppOrder = () => {
    const phoneNumber = '201022702111';
    
    // Create the message
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const message = `مرحباً، أريد طلب هذا المنتج:
*${product.name}*
السعر: EGP ${product.price.toLocaleString()}
الرابط: ${currentUrl}`;

    // Encode the message
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <button 
      onClick={handleWhatsAppOrder}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
      Order via WhatsApp
    </button>
  );
}
