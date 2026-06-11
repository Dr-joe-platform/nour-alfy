'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={`glass-panel premium-shadow animate-fade-in ${styles.loginCard}`}>
        <h1 className="text-gold" style={{ fontFamily: 'var(--font-cinzel)', marginBottom: '0.5rem' }}>NOUR ALFY</h1>
        <p style={{ color: 'var(--secondary-text)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Admin Portal</p>
        
        <form className={styles.form} onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            autoFocus
          />
          {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Authenticating...' : 'Enter Secure Area'}
          </button>
        </form>
      </div>
    </div>
  );
}
