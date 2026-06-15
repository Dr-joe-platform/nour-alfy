'use client';
import React, { useState } from 'react';
import CareGuideModal from './CareGuideModal';
import { Info } from 'lucide-react';

export default function CareGuideBtn() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: '1px solid var(--primary-accent)',
          color: 'var(--primary-accent)',
          padding: '8px 16px',
          borderRadius: '30px',
          cursor: 'pointer',
          marginTop: '1rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          transition: 'all 0.3s ease'
        }}
        className="hover-glow"
      >
        <Info size={16} />
        View Care Guide
      </button>

      <CareGuideModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
