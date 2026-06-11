'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastContext';
import styles from '../orders/AdminOrders.module.css';

interface PromoCode {
  id: string;
  code: string;
  type: string;
  value: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: any;
}

export default function AdminPromoCodes() {
  const { showToast } = useToast();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const res = await fetch('/api/promo-codes');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPromos(data);
      } else {
        setPromos([]);
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value || !expiryDate) return;

    try {
      const res = await fetch('/api/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type, value: Number(value), expiryDate })
      });
      
      if (res.ok) {
        showToast('Promo code created successfully');
        setShowForm(false);
        setCode('');
        setValue('');
        setExpiryDate('');
        fetchPromos();
      } else {
        showToast('Failed to create promo code');
      }
    } catch (error) {
      showToast('Error creating promo code');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      const res = await fetch(`/api/promo-codes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPromos(promos.filter(p => p.id !== id));
        showToast('Promo code deleted');
      }
    } catch (error) {
      showToast('Error deleting promo code');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/promo-codes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setPromos(promos.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
        showToast(`Promo code ${!currentStatus ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      showToast('Error updating status');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className={styles.header} style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gold" style={{ fontWeight: 300, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Promo Codes</h1>
          <p style={{ color: 'var(--secondary-text)' }}>Manage discount codes for your customers.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-accent hover-glow" 
          style={{ padding: '0.8rem 1.5rem', borderRadius: '4px', border: 'none', color: 'var(--background)', fontWeight: 600, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ New Promo Code'}
        </button>
      </div>

      {showForm && (
        <div className="glass-panel premium-shadow" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '8px' }}>
          <h3 className="text-accent" style={{ marginBottom: '1.5rem' }}>Create New Promo Code</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Code (e.g. SAVE10)</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Discount Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--foreground)' }}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (EGP)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Value</label>
              <input type="number" value={value} onChange={e => setValue(e.target.value)} required min="1" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Expiry Date</label>
              <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--foreground)' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
              <button type="submit" className="bg-accent hover-glow" style={{ padding: '0.8rem 2rem', borderRadius: '4px', border: 'none', color: 'var(--background)', fontWeight: 600, cursor: 'pointer' }}>Save Promo Code</button>
            </div>
          </form>
        </div>
      )}

      <div className={`glass-panel premium-shadow ${styles.tableContainer}`}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading promo codes...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No promo codes yet.</td>
                </tr>
              ) : (
                promos.map((promo) => (
                  <tr key={promo.id}>
                    <td style={{ fontWeight: 600, letterSpacing: '1px' }}>{promo.code}</td>
                    <td>{promo.type === 'percentage' ? `${promo.value}%` : `EGP ${promo.value}`}</td>
                    <td>{new Date(promo.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
                        backgroundColor: promo.isActive ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                        color: promo.isActive ? '#2ed573' : '#ff4757'
                      }}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleToggleActive(promo.id, promo.isActive)}
                        className={styles.actionBtn}
                        style={{ borderColor: promo.isActive ? 'rgba(255, 165, 2, 0.5)' : 'rgba(46, 213, 115, 0.5)', color: promo.isActive ? '#ffa502' : '#2ed573' }}
                      >
                        {promo.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDelete(promo.id)}
                        className={styles.actionBtn}
                        style={{ borderColor: 'rgba(255, 71, 87, 0.5)', color: '#ff4757' }}
                      >
                        Delete
                      </button>
                    </td>
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
