'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastContext';
import styles from '../orders/AdminOrders.module.css';

const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", 
  "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya", "New Valley", "Suez", 
  "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai", 
  "Kafr Al sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
];

interface ShippingSettings {
  defaultRate: number;
  overrides: Record<string, number>;
}

export default function AdminShipping() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<ShippingSettings>({ defaultRate: 100, overrides: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/shipping');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
      showToast('Error loading shipping settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showToast('Shipping rates saved successfully!');
      } else {
        showToast('Failed to save settings');
      }
    } catch (error) {
      showToast('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleOverrideChange = (city: string, value: string) => {
    const numValue = parseInt(value);
    const newOverrides = { ...settings.overrides };
    
    if (isNaN(numValue) || value === '') {
      delete newOverrides[city];
    } else {
      newOverrides[city] = numValue;
    }
    
    setSettings({ ...settings, overrides: newOverrides });
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className={styles.header} style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gold" style={{ fontWeight: 300, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Shipping Rates</h1>
          <p style={{ color: 'var(--secondary-text)' }}>Control delivery fees across Egypt.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-accent hover-glow" 
          style={{ padding: '0.8rem 2rem', borderRadius: '4px', border: 'none', color: 'var(--background)', fontWeight: 600, cursor: 'pointer' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="glass-panel premium-shadow" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '8px' }}>
        <h3 className="text-accent" style={{ marginBottom: '1rem' }}>Default Shipping Rate</h3>
        <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          This rate will be applied to any governorate that does not have a specific custom rate below.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 600 }}>EGP</span>
          <input 
            type="number" 
            value={settings.defaultRate} 
            onChange={(e) => setSettings({ ...settings, defaultRate: parseInt(e.target.value) || 0 })}
            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--foreground)', width: '150px' }} 
          />
        </div>
      </div>

      <div className="glass-panel premium-shadow" style={{ padding: '2rem', borderRadius: '8px' }}>
        <h3 className="text-accent" style={{ marginBottom: '1rem' }}>Custom Rates per Governorate</h3>
        <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Leave the field empty to use the Default Rate ({settings.defaultRate} EGP).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {GOVERNORATES.map(city => (
            <div key={city} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
              <span style={{ fontWeight: 500 }}>{city}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>EGP</span>
                <input 
                  type="number" 
                  placeholder={settings.defaultRate.toString()}
                  value={settings.overrides[city] !== undefined ? settings.overrides[city] : ''}
                  onChange={(e) => handleOverrideChange(city, e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--foreground)', width: '80px', textAlign: 'right' }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
