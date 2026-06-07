import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <img src="/products/logo-light.png" alt="NOUR ALFY Logo" style={{ width: '150px', height: 'auto' }} className={`site-logo logo-light ${styles.heroLogo}`} />
            <img src="/products/logo-dark.png" alt="NOUR ALFY Logo" style={{ width: '150px', height: 'auto' }} className={`site-logo logo-dark ${styles.heroLogo}`} />
          </div>
          <h1 className="animate-fade-in text-accent">NOUR ALFY</h1>
          <p className={`${styles.scriptText} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
            handmade products
          </p>
          <div className={`${styles.ctaGroup} animate-fade-in`} style={{ animationDelay: '0.4s' }}>
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
          {["/products/feat1-new.jpeg", "/products/feat2-new.jpeg", "/products/feat3-new.jpeg"].map((imgSrc, i) => (
            <Link href={`/product/${i + 1}`} key={i} className={`${styles.productCard} glass-panel premium-shadow hover-glow`}>
              <div className={styles.productImagePlaceholder}>
                <Image 
                  src={imgSrc} 
                  alt="Product" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
              <div className={styles.productInfo}>
                <span className={styles.categoryLabel}>Bags</span>
                <h3>Handcrafted Leather Bag {i + 1}</h3>
                <p className="text-accent">EGP 1,200</p>
              </div>
            </Link>
          ))}
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
