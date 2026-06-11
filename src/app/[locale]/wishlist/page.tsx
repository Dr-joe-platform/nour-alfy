'use client';

import { useWishlist } from '@/components/WishlistContext';
import { useCart } from '@/components/CartContext';
import { useToast } from '@/components/ToastContext';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import styles from './Wishlist.module.css';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img
    });
    removeFromWishlist(item.id);
    showToast(`${item.name} moved to cart`);
  };

  return (
    <main className={styles.main}>
      <Navbar />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className="text-accent">My Wishlist</h1>
          <p>Saved items: {wishlist.length}</p>
        </div>

        {wishlist.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love so you don't lose sight of them.</p>
            <Link href="/shop" className={`${styles.shopBtn} bg-accent hover-glow`}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlist.map((item) => (
              <div key={item.id} className={`${styles.card} glass-panel premium-shadow`}>
                <Link href={`/product/${item.id}`} className={styles.imageLink}>
                  <div className={styles.imageWrapper}>
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                </Link>
                <div className={styles.info}>
                  <span className={styles.category}>{item.category}</span>
                  <Link href={`/product/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p className="text-accent">EGP {item.price.toLocaleString()}</p>
                  
                  <div className={styles.actions}>
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className={`${styles.cartBtn} bg-accent hover-glow`}
                    >
                      <ShoppingBag size={16} /> Move to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className={styles.removeBtn}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
