'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastContext';
import styles from '../orders/AdminOrders.module.css'; // Reusing orders styles for table
import { Download } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminNewsletter() {
  const { showToast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSubscribers(data);
      } else {
        console.error('API returned non-array:', data);
        setSubscribers([]);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (subscribers.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed At\n"
      + subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported subscribers successfully');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className={styles.header} style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gold" style={{ fontWeight: 300, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Newsletter</h1>
          <p style={{ color: 'var(--secondary-text)' }}>Manage your email subscribers for marketing campaigns.</p>
        </div>
        <button 
          onClick={handleExport} 
          className="bg-accent hover-glow" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '4px', border: 'none', color: 'var(--background)', fontWeight: 600, cursor: 'pointer' }}
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className={`glass-panel premium-shadow ${styles.tableContainer}`}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading subscribers...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Subscription Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '2rem' }}>No subscribers yet.</td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 500 }}>{sub.email}</td>
                    <td>{new Date(sub.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
