'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Admin.module.css';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout} 
      className={`${styles.navLink} ${styles.logoutBtn}`}
    >
      <LogOut size={20} /> Logout
    </button>
  );
}
