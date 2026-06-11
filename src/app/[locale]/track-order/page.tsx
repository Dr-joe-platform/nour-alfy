'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Package, Scissors, Truck, MapPin, CheckCircle } from 'lucide-react';
import styles from './TrackOrder.module.css';

// Mock order statuses
type OrderStatus = 'placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setError('');
    setCurrentStatus(null);

    try {
      const response = await fetch(`/api/orders/${orderId.trim()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Tracking number not found. Please verify your Order ID.');
        setIsSearching(false);
        return;
      }

      // Map DB Status to Timeline Status
      const dbStatus = data.order.status; // PENDING, SHIPPED, DELIVERED
      let timelineStatus: OrderStatus = 'placed';
      
      if (dbStatus === 'PENDING') timelineStatus = 'processing';
      else if (dbStatus === 'SHIPPED') timelineStatus = 'shipped';
      else if (dbStatus === 'DELIVERED') timelineStatus = 'delivered';

      setCurrentStatus(timelineStatus);
    } catch (err) {
      setError('An error occurred while tracking. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStepClass = (stepStatus: OrderStatus) => {
    if (!currentStatus) return '';
    const statuses: OrderStatus[] = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(stepStatus);

    if (stepIndex < currentIndex) return styles.completed;
    if (stepIndex === currentIndex) return styles.active;
    return styles.pending;
  };

  return (
    <main className={styles.main}>
      <Navbar />

      <div className={styles.header}>
        <h1 className="text-accent animate-fade-in">Track Your Order</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Enter your order ID to see real-time updates on your handcrafted items.
        </p>
      </div>

      <div className={styles.container}>
        {/* Search Box */}
        <div className={`${styles.searchBox} glass-panel premium-shadow animate-fade-in`} style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleTrack} className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                placeholder="e.g. ORD-12345" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button type="submit" className={`${styles.trackBtn} bg-accent hover-glow`} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Track'}
            </button>
          </form>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>

        {/* Timeline UI */}
        {currentStatus && (
          <div className={`${styles.timelineContainer} glass-panel premium-shadow animate-fade-in`}>
            <div className={styles.timelineHeader}>
              <h3>Order Status: <span className="text-accent">#{orderId.toUpperCase()}</span></h3>
            </div>
            
            <div className={styles.timeline}>
              {/* Step 1 */}
              <div className={`${styles.timelineStep} ${getStepClass('placed')}`}>
                <div className={styles.stepIconWrapper}>
                  <Package size={24} />
                </div>
                <div className={styles.stepContent}>
                  <h4>Order Placed</h4>
                  <p>We have received your order details.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`${styles.timelineStep} ${getStepClass('processing')}`}>
                <div className={styles.stepIconWrapper}>
                  <Scissors size={24} />
                </div>
                <div className={styles.stepContent}>
                  <h4>Handcrafting</h4>
                  <p>Your items are currently being crafted and prepared by our artisans.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`${styles.timelineStep} ${getStepClass('shipped')}`}>
                <div className={styles.stepIconWrapper}>
                  <Truck size={24} />
                </div>
                <div className={styles.stepContent}>
                  <h4>Shipped</h4>
                  <p>Your package has been handed over to our shipping partner.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className={`${styles.timelineStep} ${getStepClass('out_for_delivery')}`}>
                <div className={styles.stepIconWrapper}>
                  <MapPin size={24} />
                </div>
                <div className={styles.stepContent}>
                  <h4>Out for Delivery</h4>
                  <p>Your package is on its way to your address.</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className={`${styles.timelineStep} ${getStepClass('delivered')}`}>
                <div className={styles.stepIconWrapper}>
                  <CheckCircle size={24} />
                </div>
                <div className={styles.stepContent}>
                  <h4>Delivered</h4>
                  <p>Your order has been successfully delivered. Enjoy your handcrafted piece!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
