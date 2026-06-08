'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './WhatsAppWidget.module.css';

export default function WhatsAppWidget() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  const phoneNumber = '201022702111'; // Without '+'
  const message = 'Hello NOUR ALFY, I have an inquiry about your products.';
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={waUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.waWidget}
      aria-label="Chat with us on WhatsApp"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </a>
  );
}
