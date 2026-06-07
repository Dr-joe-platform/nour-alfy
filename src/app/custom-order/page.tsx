'use client';

import { useState } from 'react';
import { useToast } from '@/components/ToastContext';
import Navbar from '@/components/Navbar';
import styles from './CustomOrder.module.css';

export default function CustomOrder() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Bag',
    material: 'Full-Grain Leather',
    idea: '',
    dimensions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '', phone: '', category: 'Bag', material: 'Full-Grain Leather', idea: '', dimensions: ''
        });
      } else {
        showToast("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <Navbar />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className="text-accent animate-fade-in" style={{ fontWeight: 300 }}>Bespoke & Custom Design</h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.1s', color: 'var(--secondary-text)', maxWidth: '600px', margin: '1rem auto' }}>
            Can't find exactly what you're looking for? Let's create it together. 
            Fill out the form below with your dream concept, and our master craftsmen will reach out to bring your vision to reality.
          </p>
        </div>
        
        <div className={`${styles.formWrapper} glass-panel premium-shadow animate-fade-in`} style={{ animationDelay: '0.2s' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <h2 className="text-accent" style={{ marginBottom: '1rem' }}>Request Received!</h2>
              <p>Thank you for reaching out. Our craftsmen will review your bespoke design idea and contact you shortly at <strong>{formData.phone}</strong>.</p>
              <button onClick={() => setSuccess(false)} className={`${styles.submitBtn} accent-border text-accent hover-glow`} style={{ background: 'transparent', marginTop: '2rem' }}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleRequestSubmit}>
            
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="accent-border" placeholder="e.g. Sara Ahmed" />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="accent-border" placeholder="01xxxxxxxxx" />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Product Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="accent-border">
                  <option value="Bag">Bag</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Perfume Composition">Perfume Composition</option>
                  <option value="Accessories">Other Accessories</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Material Preference</label>
                <select name="material" value={formData.material} onChange={handleChange} className="accent-border">
                  <option value="Full-Grain Leather">Full-Grain Leather</option>
                  <option value="Suede">Suede</option>
                  <option value="Exotic Leather">Exotic Leather</option>
                  <option value="Not Sure Yet">Not Sure Yet / Advise Me</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Approximate Dimensions (Optional)</label>
              <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="accent-border" placeholder="e.g. 30x20x10 cm" />
            </div>

            <div className={styles.inputGroup}>
              <label>Describe Your Dream Design</label>
              <textarea 
                name="idea" 
                value={formData.idea} 
                onChange={handleChange} 
                required 
                className="accent-border" 
                rows={6}
                placeholder="Tell us about the shape, colors, compartments, or any specific details you have in mind..."
              ></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className={`${styles.submitBtn} bg-accent hover-glow`} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Sending Request...' : 'Submit Design Request'}
            </button>
          </form>
          )}
        </div>
      </div>
    </main>
  );
}
