'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { useToast } from '@/components/ToastContext';
import Navbar from '@/components/Navbar';
import Receipt from '@/components/Receipt';
import Image from 'next/image';
import styles from './Checkout.module.css';

export default function Checkout() {
  const router = useRouter();
  const { showToast } = useToast();
  const { cart, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('kashier');
  const [billingMethod, setBillingMethod] = useState('same');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{code: string, type: string, value: number} | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: 'Cairo',
    email: '',
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingApartment: '',
    billingCity: 'Cairo',
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  // Static shipping fee as requested
  const shippingFee = 100;
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discountAmount = (cartTotal * appliedPromo.value) / 100;
    } else {
      discountAmount = appliedPromo.value;
    }
  }
  
  const grandTotal = Math.max(0, cartTotal + shippingFee - discountAmount);

  const handleApplyDiscount = async () => {
    if (!promoInput) return;
    setIsApplyingPromo(true);
    try {
      const res = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput })
      });
      const data = await res.json();
      
      if (data.valid) {
        setAppliedPromo(data.discount);
        setPromoInput('');
        showToast('Promo code applied successfully!');
      } else {
        showToast(data.error || 'Invalid promo code');
      }
    } catch (error) {
      showToast('Error validating promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePayNow = async () => {
    if (cart.length === 0) return;
    
    // Validation
    const newErrors: Record<string, boolean> = {};
    if (!formData.firstName) newErrors.firstName = true;
    if (!formData.lastName) newErrors.lastName = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.address) newErrors.address = true;
    if (!formData.email) newErrors.email = true;
    
    if (billingMethod === 'different') {
      if (!formData.billingFirstName) newErrors.billingFirstName = true;
      if (!formData.billingLastName) newErrors.billingLastName = true;
      if (!formData.billingAddress) newErrors.billingAddress = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    
    // If Kashier, simulate redirect (since we don't have API keys yet)
    if (paymentMethod === 'kashier') {
      showToast('Redirecting to Kashier Secure Payment...');
      // Simulated delay for "redirect"
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: `${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}`,
          billingAddress: billingMethod === 'different' 
            ? `${formData.billingAddress}, ${formData.billingApartment ? formData.billingApartment + ', ' : ''}${formData.billingCity}` 
            : 'Same as shipping',
          paymentMethod: paymentMethod,
          totalAmount: grandTotal,
          discount: discountAmount,
          promoCode: appliedPromo?.code || null,
          items: cart.map(item => {
            const priceVal = typeof item.price === 'string' ? parseInt(item.price.replace(/,/g, '')) : item.price;
            return {
              id: item.id,
              name: item.name,
              price: priceVal,
              quantity: item.quantity,
              img: item.img
            };
          })
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccessOrderId(data.orderId);
        setPlacedOrder({
          orderId: data.orderId,
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          customerPhone: formData.phone,
          customerAddress: `${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}`,
          items: [...cart],
          totalAmount: grandTotal,
          date: new Date().toISOString()
        });
        clearCart();
      } else {
        showToast(data.error || 'Failed to place order.');
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      showToast(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successOrderId && placedOrder) {
    return (
      <main className={styles.main}>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '100px', padding: '2rem' }}>
          <h1 className="text-accent" style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '1rem' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '1.2rem', marginBottom: '2rem' }}>Thank you for shopping with NOUR ALFY.</p>
          
          <div style={{ margin: '0 auto', display: 'inline-block', textAlign: 'left' }}>
            <Receipt {...placedOrder} />
          </div>

          <div style={{ marginTop: '3rem' }}>
            <button 
              onClick={() => window.print()} 
              className={`${styles.payBtn} bg-accent hover-glow`} 
              style={{ width: 'auto', padding: '1rem 3rem', marginRight: '1rem' }}
            >
              Download / Print Receipt
            </button>
            <button 
              onClick={() => router.push('/track-order')} 
              className={`${styles.payBtn}`} 
              style={{ width: 'auto', padding: '1rem 3rem', background: 'transparent', border: '1px solid var(--primary-accent)', color: 'var(--primary-accent)', marginRight: '1rem' }}
            >
              Track Order Now
            </button>
            <button 
              onClick={() => router.push('/')} 
              className={`${styles.payBtn}`} 
              style={{ width: 'auto', padding: '1rem 3rem', background: 'transparent', border: '1px solid var(--primary-accent)', color: 'var(--primary-accent)' }}
            >
              Return Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className={styles.main}>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2 className="text-accent" style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem' }}>Your cart is empty</h2>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Navbar />
      
      <div className={styles.checkoutLayout}>
        
        {/* Left Column - Forms */}
        <div className={styles.formColumn}>
          
          {/* Contact Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Contact</h2>
              <a href="#">Sign in</a>
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`} />
              </div>
              <div className={`${styles.checkboxRow} ${styles.fullWidth}`}>
                <input type="checkbox" id="news" defaultChecked />
                <label htmlFor="news">Email me with news and offers</label>
              </div>
            </div>
          </section>

          {/* Delivery Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Delivery</h2>
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <select className={styles.selectField} defaultValue="Egypt">
                  <option value="Egypt">Egypt</option>
                  <option value="Other">Other Region...</option>
                </select>
              </div>
              
              <div className={styles.inputGroup}>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className={`${styles.inputField} ${errors.firstName ? styles.inputError : ''}`} />
              </div>
              <div className={styles.inputGroup}>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className={`${styles.inputField} ${errors.lastName ? styles.inputError : ''}`} />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <input type="text" placeholder="Company (optional)" className={styles.inputField} />
              </div>
              
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={`${styles.inputField} ${errors.address ? styles.inputError : ''}`} />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" className={styles.inputField} />
              </div>

              <div className={styles.inputGroup}>
                <input type="text" value={formData.city} readOnly placeholder="City" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <select name="city" value={formData.city} onChange={handleChange} className={styles.selectField}>
                  {["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai", "Kafr Al sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <input type="text" placeholder="Postal code (optional)" className={styles.inputField} />
              </div>
              
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className={`${styles.inputField} ${errors.phone ? styles.inputError : ''}`} />
              </div>

              <div className={`${styles.checkboxRow} ${styles.fullWidth}`}>
                <input type="checkbox" id="saveInfo" />
                <label htmlFor="saveInfo">Save this information for next time</label>
              </div>
            </div>
          </section>

          {/* Shipping Method Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Shipping method</h2>
            </div>
            <div className={styles.radioGroup}>
              <div className={styles.radioOption}>
                <div className={styles.radioLabelRow}>
                  <label className={styles.radioLabel}>
                    <input type="radio" checked readOnly />
                    Standard
                  </label>
                  <span className="text-accent" style={{ fontWeight: 500 }}>EGP 100.00</span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Payment</h2>
            </div>
            <p className={styles.infoText}>All transactions are secure and encrypted.</p>
            
            <div className={styles.radioGroup}>
              {/* Kashier Option */}
              <div className={`${styles.radioOption} ${paymentMethod === 'kashier' ? styles.selected : ''}`} onClick={() => setPaymentMethod('kashier')}>
                <div className={styles.radioLabelRow}>
                  <label className={styles.radioLabel}>
                    <input type="radio" checked={paymentMethod === 'kashier'} readOnly />
                    Pay with Card, Wallet and Installment via Kashier
                  </label>
                  <div className={styles.paymentIcons}>
                    {/* Placeholder for VISA / Meeza icons - using text tags for styling */}
                    <span style={{ fontSize: '0.7rem', border: '1px solid currentColor', padding: '2px 4px', borderRadius: '2px' }}>VISA</span>
                    <span style={{ fontSize: '0.7rem', border: '1px solid currentColor', padding: '2px 4px', borderRadius: '2px' }}>ميزة</span>
                  </div>
                </div>
                {paymentMethod === 'kashier' && (
                  <div className={styles.radioDescription}>
                    You'll be redirected to Pay with Card, Wallet and Installment via Kashier to complete your purchase.
                  </div>
                )}
              </div>

              {/* COD Option */}
              <div className={`${styles.radioOption} ${paymentMethod === 'cod' ? styles.selected : ''}`} onClick={() => setPaymentMethod('cod')}>
                <div className={styles.radioLabelRow}>
                  <label className={styles.radioLabel}>
                    <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Billing Address Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Billing address</h2>
            </div>
            
            <div className={styles.radioGroup}>
              <div className={`${styles.radioOption} ${billingMethod === 'same' ? styles.selected : ''}`} onClick={() => setBillingMethod('same')}>
                <div className={styles.radioLabelRow}>
                  <label className={styles.radioLabel}>
                    <input type="radio" checked={billingMethod === 'same'} readOnly />
                    Same as shipping address
                  </label>
                </div>
              </div>

              <div className={`${styles.radioOption} ${billingMethod === 'different' ? styles.selected : ''}`} onClick={() => setBillingMethod('different')}>
                <div className={styles.radioLabelRow}>
                  <label className={styles.radioLabel}>
                    <input type="radio" checked={billingMethod === 'different'} readOnly />
                    Use a different billing address
                  </label>
                </div>
              </div>
            </div>

            {/* Dynamic Billing Form */}
            {billingMethod === 'different' && (
              <div className={styles.formGrid} style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div className={styles.inputGroup}>
                  <input type="text" name="billingFirstName" value={formData.billingFirstName} onChange={handleChange} placeholder="First name" className={`${styles.inputField} ${errors.billingFirstName ? styles.inputError : ''}`} />
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" name="billingLastName" value={formData.billingLastName} onChange={handleChange} placeholder="Last name" className={`${styles.inputField} ${errors.billingLastName ? styles.inputError : ''}`} />
                </div>
                
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <input type="text" name="billingAddress" value={formData.billingAddress} onChange={handleChange} placeholder="Address" className={`${styles.inputField} ${errors.billingAddress ? styles.inputError : ''}`} />
                </div>

                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <input type="text" name="billingApartment" value={formData.billingApartment} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" className={styles.inputField} />
                </div>

                <div className={styles.inputGroup}>
                  <select name="billingCity" value={formData.billingCity} onChange={handleChange} className={styles.selectField}>
                    {["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai", "Kafr Al sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Right Column - Order Summary */}
        <div className={styles.summaryColumn}>
          
          <div className={styles.summaryItems}>
            {cart.map((item, index) => (
              <div key={index} className={styles.summaryItem}>
                <div className={styles.itemImageWrapper}>
                  <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover', borderRadius: '8px' }} />
                  <div className={styles.itemBadge}>{item.quantity}</div>
                </div>
                <div className={styles.itemDetails}>
                  <h4>{item.name}</h4>
                </div>
                <div className={styles.itemPrice}>
                  EGP {((typeof item.price === 'string' ? parseInt(item.price.replace(/,/g, '')) : item.price) * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.discountSection}>
            {appliedPromo ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.8rem', background: 'rgba(46, 213, 115, 0.1)', border: '1px dashed #2ed573', borderRadius: '4px' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#2ed573' }}>{appliedPromo.code}</span> applied
                </div>
                <button onClick={() => setAppliedPromo(null)} style={{ background: 'none', border: 'none', color: 'var(--secondary-text)', cursor: 'pointer', textDecoration: 'underline' }}>Remove</button>
              </div>
            ) : (
              <>
                <input 
                  type="text" 
                  placeholder="Add discount" 
                  className={styles.discountInput} 
                  value={promoInput}
                  onChange={e => setPromoInput(e.target.value)}
                />
                <button 
                  className={styles.applyBtn} 
                  onClick={handleApplyDiscount}
                  disabled={isApplyingPromo || !promoInput}
                >
                  {isApplyingPromo ? '...' : 'Apply'}
                </button>
              </>
            )}
          </div>

          <div className={styles.totalsSection}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>EGP {cartTotal.toLocaleString()}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>EGP {shippingFee.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className={styles.totalRow} style={{ color: '#2ed573' }}>
                <span>Discount ({appliedPromo?.code})</span>
                <span>- EGP {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <div>
                <span className={styles.totalCurrency}>EGP</span>
                <span>{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button className={`${styles.payBtn} bg-accent text-accent hover-glow`} onClick={handlePayNow} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : paymentMethod === 'kashier' ? 'Proceed to Payment (Kashier)' : 'Place Order (Cash on Delivery)'}
          </button>
          
        </div>

      </div>
    </main>
  );
}
