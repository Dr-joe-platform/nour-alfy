import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import styles from './Admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let totalOrders = 0;
  let pendingRequests = 0;
  let productsCount = 0;
  let totalRevenue = 0;
  let recentOrders: any[] = [];

  try {
    const ordersRef = collection(db, 'orders');
    const customReqsRef = collection(db, 'customRequests');
    const productsRef = collection(db, 'products');

    const [ordersSnap, customReqsSnap, productsSnap, recentOrdersSnap] = await Promise.all([
      getDocs(ordersRef),
      getDocs(query(customReqsRef, where('status', '==', 'PENDING'))),
      getDocs(productsRef),
      getDocs(query(ordersRef, orderBy('createdAt', 'desc'), limit(5)))
    ]);

    totalOrders = ordersSnap.size;
    pendingRequests = customReqsSnap.size;
    productsCount = productsSnap.size;

    ordersSnap.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'DELIVERED') {
        totalRevenue += data.totalAmount || 0;
      }
    });

    recentOrdersSnap.forEach((doc) => {
      const data = doc.data();
      recentOrders.push({
        id: doc.id,
        customerName: data.customerName,
        totalAmount: data.totalAmount,
        status: data.status,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      });
    });
  } catch (error) {
    console.error("Firebase fetch error in Admin Dashboard:", error);
    // Continue rendering with 0s if Firebase permissions fail
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className={styles.headerSection}>
        <div>
          <h1 className="text-accent" style={{ fontWeight: 300, fontSize: '2.8rem', marginBottom: '0.5rem', letterSpacing: '2px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '1.1rem' }}>Welcome to your command center. Here's what's happening today.</p>
        </div>
        <Link href="/admin/products/new" className={`${styles.actionBtn} bg-accent hover-glow premium-shadow`}>
          <Plus size={20} /> Quick Add Product
        </Link>
      </div>
      
      <div className={styles.dashboardGrid}>
        <div className={`${styles.statCard} glass-panel premium-shadow`}>
          <div className={styles.statIconWrapper}><DollarSign size={28} className="text-accent" /></div>
          <div>
            <h3 className={styles.statTitle}>Total Revenue</h3>
            <p className={styles.statValue}>EGP {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className={`${styles.statCard} glass-panel premium-shadow`}>
          <div className={styles.statIconWrapper}><ShoppingBag size={28} className="text-accent" /></div>
          <div>
            <h3 className={styles.statTitle}>Total Orders</h3>
            <p className={styles.statValue}>{totalOrders}</p>
          </div>
        </div>
        
        <div className={`${styles.statCard} glass-panel premium-shadow`}>
          <div className={styles.statIconWrapper}><Package size={28} className="text-accent" /></div>
          <div>
            <h3 className={styles.statTitle}>Total Products</h3>
            <p className={styles.statValue}>{productsCount}</p>
          </div>
        </div>
        
        <div className={`${styles.statCard} glass-panel premium-shadow`}>
          <div className={styles.statIconWrapper}><MessageSquare size={28} className="text-accent" /></div>
          <div>
            <h3 className={styles.statTitle}>Pending Requests</h3>
            <p className={styles.statValue}>{pendingRequests}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="text-accent" style={{ fontSize: '2rem', fontWeight: 300, letterSpacing: '1px' }}>Recent Orders</h2>
          <Link href="/admin/orders" className={styles.viewAllLink}>
            View All <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.modernTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map(order => (
                <tr key={order.id} className="glass-panel premium-shadow hover-glow">
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{order.id.slice(0, 8)}...</td>
                  <td>{order.customerName}</td>
                  <td style={{ fontWeight: 600 }}>EGP {order.totalAmount?.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || styles.defaultStatus}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--secondary-text)' }}>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
