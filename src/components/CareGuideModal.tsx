'use client';
import React, { useEffect } from 'react';
import { X, Sparkles, Droplets, Sun, Wind } from 'lucide-react';

interface CareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CareGuideModal({ isOpen, onClose }: CareGuideModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)',
      padding: '20px'
    }}>
      <div 
        style={{
          backgroundColor: '#fdfbf7',
          width: '100%', maxWidth: '600px',
          maxHeight: '90vh', overflowY: 'auto',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          animation: 'modalSlideIn 0.3s ease-out'
        }}
        className="premium-border"
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '15px', right: '15px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--secondary-text)',
            padding: '5px'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ padding: '40px 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Sparkles size={32} color="var(--primary-gold)" style={{ marginBottom: '10px' }} />
            <h2 style={{ fontFamily: 'Georgia, serif', color: 'var(--primary-accent)', fontSize: '2rem', margin: 0 }}>Product Care Guide</h2>
            <p style={{ color: 'var(--secondary-text)', marginTop: '10px' }}>How to keep your handcrafted pieces timeless.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Leather Care */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ minWidth: '40px', color: 'var(--primary-gold)' }}><Droplets size={28} /></div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2b2520' }}>Leather Care</h3>
                <p style={{ margin: 0, color: '#5c4d40', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Keep leather away from water, oils, and perfumes. If it gets wet, gently dab it with a soft, light-colored cloth and let it dry naturally. Do not use artificial heat.
                </p>
              </div>
            </div>

            {/* Beadwork Care */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ minWidth: '40px', color: 'var(--primary-gold)' }}><Sparkles size={28} /></div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2b2520' }}>Beadwork & Embroidery</h3>
                <p style={{ margin: 0, color: '#5c4d40', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Handle with care to avoid snagging the threads or chipping the beads. Avoid friction against rough surfaces and keep away from sharp objects.
                </p>
              </div>
            </div>

            {/* Storage */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ minWidth: '40px', color: 'var(--primary-gold)' }}><Sun size={28} /></div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2b2520' }}>Storage</h3>
                <p style={{ margin: 0, color: '#5c4d40', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Store your bag in its original dust bag when not in use. Stuff it with tissue paper to maintain its shape, and keep it away from direct sunlight and humidity.
                </p>
              </div>
            </div>
            
            {/* Cleaning */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ minWidth: '40px', color: 'var(--primary-gold)' }}><Wind size={28} /></div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2b2520' }}>Cleaning</h3>
                <p style={{ margin: 0, color: '#5c4d40', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  For minor dirt on leather, use a dry, clean microfiber cloth. Never use harsh chemicals or alcohol-based cleaners on leather or beads.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button 
              onClick={onClose}
              style={{
                backgroundColor: 'var(--primary-accent)', color: '#fff',
                padding: '12px 30px', borderRadius: '30px', border: 'none',
                cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px'
              }}
              className="hover-glow"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
