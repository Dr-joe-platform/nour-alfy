import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-accent" style={{ fontWeight: 300, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--secondary-text)' }}>Welcome to the administration panel. Here's what's happening today.</p>
        </div>
        <Link href="/admin/products/new" className="bg-accent hover-glow" style={{ padding: '0.8rem 1.5rem', borderRadius: '4px', textDecoration: 'none', color: 'var(--background)', fontWeight: 'bold' }}>
          + Quick Add Product
        </Link>
      </div>
      
      <div className={styles.dashboardGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Revenue</h3>
          <p className={styles.statValue}>EGP {totalRevenue.toLocaleString()}</p>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Orders</h3>
          <p className={styles.statValue}>{totalOrders}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Products</h3>
          <p className={styles.statValue}>{productsCount}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Pending Requests</h3>
          <p className={styles.statValue}>{pendingRequests}</p>
        </div>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="text-accent" style={{ fontSize: '1.8rem', fontWeight: 400 }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ color: 'var(--primary-accent)', textDecoration: 'underline' }}>View All Orders</Link>
        </div>
        <div className="glass-panel premium-shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--secondary-text)' }}>
                <th style={{ padding: '1rem' }}>Order ID</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--foreground)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace' }}>#{order.id}</td>
                  <td style={{ padding: '1rem' }}>{order.customerName}</td>
                  <td style={{ padding: '1rem' }}>EGP {order.totalAmount?.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', background: 'var(--accent-glow)', color: 'var(--primary-accent)' }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--secondary-text)' }}>No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
