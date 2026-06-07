'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  return (
    <main className={styles.main}>
      <Navbar />
      
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className="text-accent animate-fade-in">Our Heritage</h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Where master craftsmanship meets timeless luxury.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.storySection}>
          <div className={styles.textContent}>
            <h2 className="text-accent">The NOUR ALFY Story</h2>
            <p>
              Founded with an uncompromising vision for luxury, NOUR ALFY began as a bespoke atelier dedicated to the art of leatherwork and perfumery. We believe that true luxury is not mass-produced; it is meticulously crafted by hand, shaped by passion, and refined by time.
            </p>
            <p>
              Every bag, wallet, and fragrance in our collection is a testament to Egyptian heritage blended with modern sophistication. Our master artisans bring decades of experience to the cutting table, ensuring that every stitch is perfect and every scent note is harmonious.
            </p>
          </div>
          <div className={`${styles.imagePlaceholder} glass-panel premium-shadow`} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image src="/products/logo-light.png" alt="NOUR ALFY Light" fill style={{ objectFit: 'cover' }} />
          </div>
        </section>

        <section className={styles.craftSection}>
          <div className={`${styles.imagePlaceholder} glass-panel premium-shadow`} style={{ position: 'relative', overflow: 'hidden', background: '#1a1a1a' }}>
            <Image src="/products/logo-dark.png" alt="NOUR ALFY Dark" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.textContent}>
            <h2 className="text-accent">Uncompromising Quality</h2>
            <p>
              <strong>The Leather:</strong> We source only the finest full-grain and exotic leathers, celebrated for their durability and natural beauty. Unlike synthetic alternatives, our leathers age gracefully, developing a rich patina that tells the story of your journeys.
            </p>
            <p>
              <strong>The Scents:</strong> Our exclusive perfume compositions are developed using rare, ethically sourced ingredients from around the world. From deep, resinous Oud to delicate floral absolute, each bottle holds an unforgettable olfactory experience.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
