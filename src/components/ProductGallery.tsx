'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../app/product/[id]/ProductDetails.module.css';

export default function ProductGallery({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(images[0] || '/products/bag1.jpeg');

  if (!images || images.length === 0) {
    return (
      <div className={styles.mainImage}>
        <Image src="/products/bag1.jpeg" alt="Product" fill style={{ objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div className={styles.imageSection}>
      <div className={styles.mainImage}>
        <Image src={mainImage} alt="Product" fill style={{ objectFit: 'cover' }} />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setMainImage(img)}
              style={{ 
                width: '80px', 
                height: '80px', 
                position: 'relative', 
                cursor: 'pointer',
                border: mainImage === img ? '2px solid var(--primary-gold)' : '2px solid transparent',
                borderRadius: '4px',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
