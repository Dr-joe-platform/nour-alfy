'use client'

import {Link, usePathname, useRouter} from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { ShoppingCart, Menu, X, Sun, Moon, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cart, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <nav 
      className={`${styles.navbar} glass-panel premium-shadow`} 
      style={{ 
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/products/logo-light.png" alt="NOUR ALFY Logo" width="80" style={{ height: 'auto', borderRadius: '50%' }} className="site-logo logo-light" />
            <img src="/products/logo-dark.png" alt="NOUR ALFY Logo" width="80" style={{ height: 'auto', borderRadius: '50%' }} className="site-logo logo-dark" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className={styles.navLinks}>
          <Link href="/" className="hover-glow">{t('home')}</Link>
          <Link href="/shop" className="hover-glow">{t('shop')}</Link>
          <Link href="/about" className="hover-glow">{t('ourCraft')}</Link>
          <Link href="/custom-order" className="hover-glow">{t('customOrder')}</Link>
          <Link href="/track-order" className="hover-glow">{t('trackOrder')}</Link>
        </div>

        <div className={styles.navActions}>
          <button onClick={toggleTheme} className={`${styles.iconBtn} text-accent hover-glow`} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          
          <Link href="/wishlist" className={`${styles.iconBtn} text-accent hover-glow`} aria-label="Wishlist" style={{ position: 'relative' }}>
            <Heart size={24} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary-accent)', color: 'var(--background)',
                borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          <button onClick={() => setIsCartOpen(true)} className={`${styles.iconBtn} text-accent hover-glow`} aria-label="Cart" style={{ position: 'relative' }}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--primary-accent)',
                color: 'var(--background)',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </button>
          <div className={styles.mobileMenuBtn} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} className="text-accent" /> : <Menu size={28} className="text-accent" />}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`${styles.mobileMenu} glass-panel animate-fade-in`}>
          <Link href="/" onClick={() => setIsOpen(false)}>{t('home')}</Link>
          <Link href="/shop" onClick={() => setIsOpen(false)}>{t('shop')}</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>{t('ourCraft')}</Link>
          <Link href="/custom-order" onClick={() => setIsOpen(false)}>{t('customOrder')}</Link>
          <Link href="/track-order" onClick={() => setIsOpen(false)}>{t('trackOrder')}</Link>
        </div>
      )}
    </nav>
  );
}
