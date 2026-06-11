'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastContext';
import styles from '../orders/AdminOrders.module.css';

interface CustomRequest {
  id: string;
  name: string;
  phone: string;
  category: string;
  material: string;
  idea: string;
  status: string;
  createdAt: string;
}

export default function AdminCustomRequests() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/custom-requests');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.error('API returned non-array:', data);
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching custom requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/custom-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
        showToast('Status updated!');
      } else {
        showToast('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this custom request?')) return;
    
    try {
      const res = await fetch(`/api/custom-requests/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRequests(requests.filter(req => req.id !== id));
        showToast('Request deleted successfully');
      } else {
        showToast('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      showToast('Error deleting request');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className={styles.header} style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gold" style={{ fontWeight: 300, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Custom Requests</h1>
          <p style={{ color: 'var(--secondary-text)' }}>Manage and review bespoke design requests from your customers.</p>
        </div>
      </div>

      <div className={`glass-panel premium-shadow ${styles.tableContainer}`}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading requests...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Idea & Material</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No requests yet.</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      <strong>{req.name}</strong><br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>{req.phone}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--primary-gold)', fontWeight: 500 }}>{req.category}</span> - {req.material}<br/>
                      <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
                        {req.idea.substring(0, 60)}{req.idea.length > 60 ? '...' : ''}
                      </span>
                    </td>
                    <td>
                      <select 
                        className={styles.statusSelect} 
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        style={{
                          borderColor: req.status === 'COMPLETED' ? 'rgba(46, 213, 115, 0.5)' : 
                                       req.status === 'CONTACTED' ? 'rgba(30, 144, 255, 0.5)' :
                                       req.status === 'REVIEWED' ? 'rgba(165, 94, 234, 0.5)' :
                                       'rgba(212, 175, 55, 0.5)',
                          color: req.status === 'COMPLETED' ? '#2ed573' : 
                                 req.status === 'CONTACTED' ? '#1e90ff' :
                                 req.status === 'REVIEWED' ? '#a55eea' :
                                 'var(--primary-gold)',
                        }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className={styles.actionBtn} onClick={() => showToast(`Full Idea: ${req.idea}`)}>Details</button>
                      <a 
                        href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.actionBtn}
                        style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#25D366', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                      >
                        WhatsApp
                      </a>
                      <button 
                        className={styles.actionBtn} 
                        onClick={() => handleDelete(req.id)}
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
