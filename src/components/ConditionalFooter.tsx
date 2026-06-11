'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  // Match /admin, /login, or /[locale]/admin, /[locale]/login
  const isAdminOrLogin = pathname?.match(/^\/([a-zA-Z]{2}\/)?(admin|login)/);
  
  if (isAdminOrLogin) {
    return null;
  }
  
  return <Footer />;
}
