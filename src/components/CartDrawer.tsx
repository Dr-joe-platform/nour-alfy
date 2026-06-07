'use client';

import { useCart } from './CartContext';
import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsCartOpen(false)}></div>
      <div className={`${styles.drawer} glass-panel animate-fade-in`}>
        <div className={styles.header}>
          <h2 className="text-accent">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className={styles.closeBtn}>
            <X size={24} className="text-accent" />
          </button>
        </div>

        <div className={styles.items}>
          {cart.length === 0 ? (
            <p className={styles.emptyText}>Your cart is currently empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.itemInfo}>
                  <h4>{item.name}</h4>
                  <p>EGP {item.price} x {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Total:</span>
              <span className="text-accent">EGP {cartTotal.toLocaleString()}</span>
            </div>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <button className={`${styles.checkoutBtn} bg-accent hover-glow`}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
