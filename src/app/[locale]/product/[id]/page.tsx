import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AddToCartBtn from '@/components/AddToCartBtn';
import ProductGallery from '@/components/ProductGallery';
import styles from './ProductDetails.module.css';

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let product: any = null;
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    const productData = docSnap.data();
    product = productData ? { id: docSnap.id, ...productData } : null;
  } catch (error) {
    console.error("Firebase fetch error in Product page:", error);
    // product remains null, which will trigger notFound() below
  }

  if (!product) {
    notFound();
  }

  let images: string[] = [];
  try {
    if (product.images) {
      images = JSON.parse(product.images);
    }
  } catch (e) {
    images = [];
  }

  const mainImage = images.length > 0 ? images[0] : '/products/bag1.jpeg';

  return (
    <main className={styles.main}>
      <Navbar />
      
      <div className={styles.container}>
        {/* Product Showcase */}
        <div className={`${styles.productShowcase} glass-panel premium-shadow animate-fade-in`}>
          <ProductGallery images={images} />
          
          <div className={styles.detailsSection}>
            <h1 className="text-accent">{product.name}</h1>
            <p className={`${styles.price} text-accent`}>EGP {product.price.toLocaleString()}</p>
            
            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.specs}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Category:</span>
                <span className={styles.specValue}>{product.category}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Leather Type:</span>
                <span className={styles.specValue}>{product.leatherType || 'N/A'}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Dimensions:</span>
                <span className={styles.specValue}>{product.dimensions || 'N/A'}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Available Colors:</span>
                <span className={styles.specValue}>{product.colors || 'N/A'}</span>
              </div>
            </div>

            <AddToCartBtn 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                img: mainImage
              }} 
              className={`${styles.addToCartBtn} bg-accent hover-glow`} 
            />
          </div>
        </div>

        {/* Related Products Section */}
        <section className={styles.similarProducts}>
          <div className={styles.sectionHeader}>
            <h2 className="text-accent">You May Also Like</h2>
            <div className={styles.divider}></div>
          </div>
          <div className={styles.similarGrid}>
            {[2, 3, 4].map((i) => (
              <Link href={`/product/${i}`} key={i}>
                <div className={`${styles.productCard} glass-panel premium-shadow hover-glow animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={styles.productImageSm}>
                    <img src="/products/logo-light.png" alt="Similar Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} className="site-logo logo-light" />
                    <img src="/products/logo-dark.png" alt="Similar Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} className="site-logo logo-dark" />
                  </div>
                  <div className={styles.productInfoSm}>
                    <h3>Handcrafted Item {i}</h3>
                    <p className="text-accent">EGP 1,{i}00</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className={styles.reviewsSection} style={{ marginTop: '4rem' }}>
          <div className={styles.sectionHeader}>
            <h2 className="text-accent">Customer Reviews</h2>
            <div className={styles.divider}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div className="glass-panel premium-shadow" style={{ padding: '2rem', borderRadius: '8px' }}>
              <div style={{ color: 'var(--primary-gold)', marginBottom: '1rem', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ color: 'var(--secondary-text)', fontStyle: 'italic', marginBottom: '1rem', lineHeight: '1.6' }}>
                "Absolutely stunning craftsmanship. The leather is premium and you can feel the dedication in every stitch. I will definitely be ordering again!"
              </p>
              <strong className="text-accent">- Youssef K.</strong>
            </div>
            <div className="glass-panel premium-shadow" style={{ padding: '2rem', borderRadius: '8px' }}>
              <div style={{ color: 'var(--primary-gold)', marginBottom: '1rem', letterSpacing: '2px' }}>★★★★★</div>
              <p style={{ color: 'var(--secondary-text)', fontStyle: 'italic', marginBottom: '1rem', lineHeight: '1.6' }}>
                "I bought this as a gift for my husband and he was blown away. The packaging, the scent, and the quality of the product is unmatched."
              </p>
              <strong className="text-accent">- Dina M.</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
