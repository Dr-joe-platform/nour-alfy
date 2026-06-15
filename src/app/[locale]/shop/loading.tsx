import Navbar from '@/components/Navbar';
import styles from './Shop.module.css';

export default function Loading() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.header}>
        <h1 className="text-accent">Our Collection</h1>
        <p className={styles.subtitle}>Loading our exclusive pieces...</p>
      </div>
      
      <div className={styles.container}>
        <div className={styles.productGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`${styles.productCard} glass-panel premium-shadow`} style={{ animation: `pulse 1.5s infinite ${i * 0.1}s` }}>
              <div style={{ width: '100%', height: '320px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
              <div className={styles.productInfo}>
                <div style={{ width: '60%', height: '20px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '0 auto 10px', borderRadius: '4px' }}></div>
                <div style={{ width: '40%', height: '20px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '0 auto', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </main>
  );
}
