'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingBag, MessageSquare, LayoutDashboard, Sun, Moon, Mail, Tag, Truck } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import styles from './Admin.module.css';


export default function AdminSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === '/admin' && pathname !== '/admin') return false;
    return pathname?.startsWith(path);
  };

  return (
    <aside className={`${styles.sidebar} glass-panel`}>
      <div className={styles.sidebarHeader}>
        <h2 className="text-accent">Admin Panel</h2>
      </div>
      <nav className={styles.sidebarNav}>
        <Link 
          href="/admin" 
          className={`${styles.navLink} ${isActive('/admin') ? styles.navLinkActive : ''}`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link 
          href="/admin/products" 
          className={`${styles.navLink} ${isActive('/admin/products') ? styles.navLinkActive : ''}`}
        >
          <Package size={20} /> Products
        </Link>
        <Link 
          href="/admin/orders" 
          className={`${styles.navLink} ${isActive('/admin/orders') ? styles.navLinkActive : ''}`}
        >
          <ShoppingBag size={20} /> Orders
        </Link>
        <Link 
          href="/admin/custom-requests" 
          className={`${styles.navLink} ${isActive('/admin/custom-requests') ? styles.navLinkActive : ''}`}
        >
          <MessageSquare size={20} /> Custom Requests
        </Link>
        <Link 
          href="/admin/newsletter" 
          className={`${styles.navLink} ${isActive('/admin/newsletter') ? styles.navLinkActive : ''}`}
        >
          <Mail size={20} /> Newsletter
        </Link>
        <Link 
          href="/admin/promo-codes" 
          className={`${styles.navLink} ${isActive('/admin/promo-codes') ? styles.navLinkActive : ''}`}
        >
          <Tag size={20} /> Promo Codes
        </Link>
        <Link 
          href="/admin/shipping" 
          className={`${styles.navLink} ${isActive('/admin/shipping') ? styles.navLinkActive : ''}`}
        >
          <Truck size={20} /> Shipping Rates
        </Link>
        <Link href="/" className={`${styles.navLink} ${styles.backLink}`}>
          &larr; Back to Store
        </Link>
        <button 
          onClick={toggleTheme} 
          className={styles.navLink} 
          style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', outline: 'none' }}
        >
          {theme === 'dark' ? (
            <><Sun size={20} /> Light Mode</>
          ) : (
            <><Moon size={20} /> Dark Mode</>
          )}
        </button>

      </nav>
    </aside>
  );
}
