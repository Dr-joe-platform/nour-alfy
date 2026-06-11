import Link from 'next/link';
import { Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastContext';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (res.ok) {
        showToast('Successfully subscribed to our newsletter!');
        setEmail('');
      } else {
        showToast(data.error || 'Failed to subscribe.');
      }
    } catch (error) {
      showToast('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <h2 className={styles.brandName}>NOUR ALFY</h2>
          <p className={styles.brandTagline}>handmade products</p>
          <p className={styles.brandDescription}>
            Meticulously handcrafted beaded accessories and intricate embroidery, 
            designed to add a touch of timeless elegance to your everyday life.
          </p>
        </div>

        <div className={styles.linksSection}>
          <h3>Quick Links</h3>
          <ul className={styles.linkList}>
            <li><Link href="/terms" className="hover-glow">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover-glow">Privacy Policy</Link></li>
            <li><Link href="/return-policy" className="hover-glow">Return Policy</Link></li>
          </ul>
        </div>

        <div className={styles.newsletterSection}>
          <h3>Join Our Newsletter</h3>
          <p>Subscribe to receive updates on new collections, exclusive offers, and the latest from NOUR ALFY.</p>
          <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading}
              className="accent-border"
            />
            <button type="submit" disabled={loading} className="bg-accent hover-glow" aria-label="Subscribe">
              {loading ? '...' : <Send size={18} />}
            </button>
          </form>
        </div>

        <div className={styles.contactSection}>
          <h3>Contact Us</h3>
          <ul className={styles.contactList}>
            <li>
              <a href="https://wa.me/201022702111" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit', textDecoration: 'none' }}>
                <Phone size={18} className="text-accent" />
                <span>+20 102 270 2111</span>
              </a>
            </li>
            <li>
              <a href="mailto:nouralfy26@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
                <Mail size={18} className="text-accent" />
                <span>nouralfy26@gmail.com</span>
              </a>
            </li>
          </ul>
          
          <div className={styles.socialLinks}>
            <a href="https://www.instagram.com/nour_alfy_handmade_store?igsh=MTQxa3RqMG0wOTI2NQ==" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.facebook.com/share/1Cs8mz2isc/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} NOUR ALFY Handmade Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
