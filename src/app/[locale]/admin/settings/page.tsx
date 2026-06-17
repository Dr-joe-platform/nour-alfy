'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from '../orders/AdminOrders.module.css';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [globalVolume, setGlobalVolume] = useState(0.5);
  const [isSavingVolume, setIsSavingVolume] = useState(false);

  useEffect(() => {
    const fetchVolume = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'audio'));
        if (docSnap.exists() && docSnap.data().volume !== undefined) {
          setGlobalVolume(docSnap.data().volume);
        }
      } catch (e) {
        console.error("Error fetching volume", e);
      }
    };
    fetchVolume();
  }, []);

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setGlobalVolume(newVol);
    
    setIsSavingVolume(true);
    try {
      await setDoc(doc(db, 'settings', 'audio'), { volume: newVol }, { merge: true });
    } catch (error) {
      showToast('Failed to save volume setting');
    } finally {
      setIsSavingVolume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/settings/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.error || 'Failed to change password');
      }
    } catch (error) {
      showToast('An error occurred while changing password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem', maxWidth: '600px' }}>
      <div className={styles.header} style={{ marginBottom: '2rem' }}>
        <h1 className="text-gold" style={{ fontWeight: 300, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Settings</h1>
        <p style={{ color: 'var(--secondary-text)' }}>Manage your account security and preferences.</p>
      </div>

      <div className="glass-panel premium-shadow" style={{ padding: '2rem', borderRadius: '8px' }}>
        <h3 className="text-accent" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Change Password</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>Current Password</label>
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--foreground)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--foreground)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--foreground)' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-accent hover-glow" 
            style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', border: 'none', color: 'var(--background)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="glass-panel premium-shadow" style={{ padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>
        <h3 className="text-accent" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Global Website Audio</h3>
        <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Adjust the background music volume for all visitors on the website.
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🔈</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={globalVolume}
            onChange={handleVolumeChange}
            style={{ flex: 1, accentColor: 'var(--primary-accent)' }}
          />
          <span style={{ fontSize: '1.2rem' }}>🔊</span>
        </div>
        
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-text)', fontSize: '0.9rem' }}>
          <span>Current Volume: {Math.round(globalVolume * 100)}%</span>
          {isSavingVolume && <span className="text-accent">Saving...</span>}
        </div>
      </div>
    </div>
  );
}
