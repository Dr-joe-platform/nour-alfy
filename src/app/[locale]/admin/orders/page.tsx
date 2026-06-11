'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastContext';
import styles from './AdminOrders.module.css';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  name?: string;
  product?: {
    name: string;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  customerEmail?: string | null;
}

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('API returned non-array:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
        // Simple toast or alert
        showToast('Order status updated!');
      } else {
        showToast('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    try {
      const response = await fetch(`/api/orders/${orderToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderToDelete));
        if (selectedOrder?.id === orderToDelete) {
          setSelectedOrder(null);
        }
        showToast('Order deleted successfully');
      } else {
        console.error('Failed to delete order');
        showToast('Failed to delete the order.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showToast('An error occurred while deleting the order.');
    } finally {
      setOrderToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className={styles.header} style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gold" style={{ fontWeight: 300, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Orders Management</h1>
          <p style={{ color: 'var(--secondary-text)' }}>Track, update, and manage all customer orders.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by ID, Name, or Phone..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '250px', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--foreground)' }}
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--foreground)', cursor: 'pointer' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      <div className={`glass-panel premium-shadow ${styles.tableContainer}`}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredOrders = orders.filter(order => {
                  const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        order.customerPhone.includes(searchQuery);
                  const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
                  return matchesSearch && matchesStatus;
                });

                if (filteredOrders.length === 0) {
                  return (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No orders found matching your filters.</td>
                    </tr>
                  );
                }

                return filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>#{order.id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <strong>{order.customerName}</strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary-gold)' }}>{order.customerPhone}</span>
                        {order.customerAddress && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', lineHeight: '1.2' }}>
                            {order.customerAddress}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
                        {order.items.map(item => (
                          <li key={item.id || Math.random().toString()} style={{ marginBottom: '0.2rem' }}>
                            <span style={{ color: 'var(--primary-gold)' }}>{item.quantity}x</span> {item.name || item.product?.name || 'Unknown Product'}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ fontWeight: 500 }}>EGP {(order.totalAmount || 0).toLocaleString()}</td>
                    <td>
                      <select 
                        className={styles.statusSelect} 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{
                          borderColor: order.status === 'DELIVERED' ? 'rgba(46, 213, 115, 0.5)' : 
                                       order.status === 'SHIPPED' ? 'rgba(30, 144, 255, 0.5)' :
                                       'rgba(212, 175, 55, 0.5)',
                          color: order.status === 'DELIVERED' ? '#2ed573' : 
                                 order.status === 'SHIPPED' ? '#1e90ff' :
                                 'var(--primary-gold)',
                        }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid var(--primary-accent)', color: 'var(--primary-accent)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          View
                        </button>
                        <a 
                          href={`https://wa.me/${order.customerPhone.replace(/\\D/g, '')}?text=Hello ${order.customerName}, regarding your NOUR ALFY order`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', padding: '0.4rem', border: '1px solid #25D366', color: '#25D366', borderRadius: '4px', textDecoration: 'none' }}
                          title="Chat on WhatsApp"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </a>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid #d32f2f', color: '#d32f2f', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h2 className="text-accent" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Order Details: #{selectedOrder.id.toUpperCase()}</h2>
            
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <strong style={{ color: 'var(--secondary-text)' }}>Customer Name:</strong> <span style={{ color: 'var(--foreground)' }}>{selectedOrder.customerName}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--secondary-text)' }}>Email:</strong> <span style={{ color: 'var(--foreground)' }}>{selectedOrder.customerEmail || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--secondary-text)' }}>Phone:</strong> <span style={{ color: 'var(--foreground)' }}>{selectedOrder.customerPhone}</span>
                <a 
                  href={`https://wa.me/${selectedOrder.customerPhone.replace(/\\D/g, '')}?text=Hello ${selectedOrder.customerName}, regarding your NOUR ALFY order`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-accent)', textDecoration: 'none', border: '1px solid var(--primary-accent)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Chat on WhatsApp
                </a>
              </div>
              <div>
                <strong style={{ color: 'var(--secondary-text)' }}>Address:</strong> <span style={{ color: 'var(--foreground)' }}>{selectedOrder.customerAddress || 'N/A'}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--secondary-text)' }}>Order Date:</strong> <span style={{ color: 'var(--foreground)' }}>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--secondary-text)' }}>Current Status:</strong> 
                <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'var(--accent-glow)', color: 'var(--primary-accent)' }}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <h3 style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }}>Order Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item: any) => (
                  <div key={item.id || Math.random()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--border-color)', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ color: 'var(--foreground)' }}>{item.name || item.product?.name || 'Unknown Product'}</strong>
                      <div style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginTop: '0.3rem' }}>Qty: {item.quantity} x EGP {item.price?.toLocaleString() || 0}</div>
                    </div>
                    <strong style={{ color: 'var(--primary-accent)' }}>EGP {((item.price || 0) * item.quantity).toLocaleString()}</strong>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--secondary-text)', fontStyle: 'italic' }}>No item details available for this order.</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--secondary-text)' }}>Total Amount:</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary-accent)' }}>EGP {selectedOrder.totalAmount?.toLocaleString() || 0}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {orderToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #d32f2f' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(211,47,47,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <h3 style={{ color: 'var(--foreground)', marginBottom: '1rem', fontSize: '1.4rem' }}>Delete Order</h3>
            <p style={{ color: 'var(--secondary-text)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Are you sure you want to delete order <strong>#{orderToDelete.toUpperCase()}</strong>?<br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setOrderToDelete(null)}
                style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--foreground)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteOrder}
                style={{ flex: 1, padding: '0.8rem', background: '#d32f2f', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(211,47,47,0.3)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
