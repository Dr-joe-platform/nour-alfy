import Navbar from '@/components/Navbar';
import styles from './ProductDetails.module.css';

export default function Loading() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.productShowcase} glass-panel`} style={{ padding: '2rem' }}>
          {/* Image Skeleton */}
          <div style={{ width: '100%', height: '500px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
          
          {/* Details Skeleton */}
          <div className={styles.detailsSection} style={{ gap: '2rem' }}>
            <div style={{ width: '80%', height: '40px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ width: '40%', height: '30px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ width: '100%', height: '100px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            
            <div style={{ width: '100%', height: '150px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }}></div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ flex: 1, height: '50px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ flex: 1, height: '50px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            </div>
          </div>
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
