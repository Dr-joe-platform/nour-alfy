'use client';
import { motion } from 'framer-motion';

export default function MarqueeBanner() {
  const text = "100% HANDCRAFTED • PREMIUM LEATHER • WORLDWIDE SHIPPING • EXQUISITE BEADWORK • ";
  
  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--primary-accent)',
      color: 'var(--background)',
      padding: '10px 0',
      overflow: 'hidden',
      display: 'flex',
      whiteSpace: 'nowrap',
      borderTop: '1px solid var(--border-color)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 20
        }}
        style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', letterSpacing: '2px' }}
      >
        <span>{text}{text}{text}{text}</span>
      </motion.div>
    </div>
  );
}
