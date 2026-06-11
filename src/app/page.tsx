'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

export default function Home() {
  const [step, setStep] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    // Sequence timeline
    const t1 = setTimeout(() => setStep(1), 1500); // Shrink logo
    const t2 = setTimeout(() => setStep(2), 3000); // Show navbar
    const t3 = setTimeout(() => setStep(3), 3800); // Show title
    const t4 = setTimeout(() => setStep(4), 4600); // Show subtitle
    const t5 = setTimeout(() => setStep(5), 5400); // Show buttons

    // Fetch featured products
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeaturedProducts(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    fetchProducts();

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  const getFirstImage = (imagesStr: string | null) => {
    if (!imagesStr) return '/products/bag1.jpeg';
    try {
      const parsed = JSON.parse(imagesStr);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/products/bag1.jpeg';
    } catch (e) {
      return '/products/bag1.jpeg';
    }
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.navWrapper} ${step >= 2 ? styles.navVisible : styles.navHidden}`}>
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={`${styles.logoContainer} ${step === 0 ? styles.logoLarge : styles.logoNormal}`}>
            <img src="/products/logo-splash.png" alt="NOUR ALFY Logo" style={{ width: '150px', height: 'auto' }} className={`site-logo logo-light ${styles.heroLogo}`} />
            <img src="/products/logo-dark.png" alt="NOUR ALFY Logo" style={{ width: '150px', height: 'auto' }} className={`site-logo logo-dark ${styles.heroLogo}`} />
          </div>
          <h1 className={`text-accent ${styles.staggerItem} ${step >= 3 ? styles.visibleItem : styles.hiddenItem}`}>NOUR ALFY</h1>
          <p className={`${styles.scriptText} ${styles.staggerItem} ${step >= 4 ? styles.visibleItem : styles.hiddenItem}`}>
            handmade products
          </p>
          <div className={`${styles.ctaGroup} ${styles.staggerItem} ${step >= 5 ? styles.visibleItem : styles.hiddenItem}`}>
            <Link href="/shop" className={`${styles.btnPrimary} bg-accent premium-shadow hover-glow`}>
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* The Craft Section */}
      <section className={styles.craftSection}>
        <div className={styles.craftContainer}>
          <div className={styles.craftText}>
            <h2 className="text-accent">The Art of Beadwork</h2>
            <p>
              Every stitch, every bead, and every thread is a testament to our dedication to true craftsmanship. 
              We select only the finest materials to create pieces that not only look exquisite but 
              last beautifully with you. 
            </p>
            <Link href="/shop" className={`${styles.btnLink} text-accent`}>
              Discover Our Process &rarr;
            </Link>
          </div>
          <div className={styles.craftImages}>
            <div className={`${styles.craftImg1} premium-shadow`}>
              <Image src="/products/art1-new.jpeg" alt="Craftsmanship" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={`${styles.craftImg2} premium-shadow`}>
              <Image src="/products/art2-new.jpeg" alt="Bead Details" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <h2 className={`text-accent ${styles.sectionTitle}`}>Curated Collections</h2>
        <div className={styles.categoryGrid}>
          <Link href="/shop?category=Beaded+Bags" className={`${styles.categoryCard} premium-shadow`}>
            <Image src="/products/img3.jpeg" alt="Beaded Bags" fill style={{ objectFit: 'cover' }} />
            <div className={styles.categoryOverlay}>
              <h3>Beaded Bags</h3>
            </div>
          </Link>
          <Link href="/shop?category=Embroidery" className={`${styles.categoryCard} premium-shadow`}>
            <Image src="/products/img4.jpeg" alt="Embroidery" fill style={{ objectFit: 'cover' }} />
            <div className={styles.categoryOverlay}>
              <h3>Custom Embroidery</h3>
            </div>
          </Link>
          <Link href="/shop?category=Accessories" className={`${styles.categoryCard} premium-shadow`}>
            <Image src="/products/img5.jpeg" alt="Accessories" fill style={{ objectFit: 'cover' }} />
            <div className={styles.categoryOverlay}>
              <h3>Handcrafted Accessories</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Masterpieces */}
      <section className={styles.featured}>
        <h2 className={`text-accent ${styles.sectionTitle}`}>Featured Masterpieces</h2>
        <div className={styles.productGrid}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className={`${styles.productCard} glass-panel premium-shadow hover-glow`}>
                <div className={styles.productImagePlaceholder}>
                  <Image 
                    src={getFirstImage(product.images)} 
                    alt={product.name} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.categoryLabel}>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="text-accent">EGP {product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', color: 'var(--secondary-text)' }}>Loading featured collection...</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/shop" className={`${styles.btnSecondary} accent-border text-accent premium-shadow hover-glow`}>
            View Entire Shop
          </Link>
        </div>
      </section>

      {/* Custom Orders Banner */}
      <section className={styles.customOrderBanner}>
        <div className={`${styles.customOverlay} glass-panel`}>
          <h2 className="text-accent">Have a Unique Vision?</h2>
          <p>
            Bring your dream design to life. Work directly with our master craftsmen to create 
            a bespoke leather piece tailored specifically to your needs and style.
          </p>
          <Link href="/custom-order" className={`${styles.btnPrimary} bg-accent premium-shadow hover-glow`}>
            Request Custom Design
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2 className="text-accent">What Our Clients Say</h2>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.testimonialsGrid}>
          <div className={`${styles.testimonialCard} glass-panel premium-shadow`}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.reviewText}>"The pearl beaded bag I ordered is an absolute masterpiece. The attention to detail in the beadwork is stunning!"</p>
            <h4 className="text-accent">- Laila T.</h4>
          </div>
          <div className={`${styles.testimonialCard} glass-panel premium-shadow`}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.reviewText}>"I requested a custom embroidery hoop for a wedding gift. It came out so beautiful and delicate. Truly talented hands."</p>
            <h4 className="text-accent">- Omar H.</h4>
          </div>
          <div className={`${styles.testimonialCard} glass-panel premium-shadow`}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.reviewText}>"The quality of the threads and beads used is top-notch. These aren't just accessories, they are pieces of art."</p>
            <h4 className="text-accent">- Sarah M.</h4>
          </div>
        </div>
      </section>

    </main>
  );
}
