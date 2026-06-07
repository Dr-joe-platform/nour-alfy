import Navbar from '@/components/Navbar';

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ padding: '6rem 2rem 2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--foreground)' }}>
        <h1 className="text-accent" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 300 }}>Terms & Conditions</h1>
        
        <div className="glass-panel" style={{ padding: '2rem', lineHeight: '1.8' }}>
          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>1. Introduction</h2>
          <p style={{ marginBottom: '1.5rem' }}>Welcome to NOUR ALFY. By using our website and purchasing our products, you agree to comply with and be bound by the following terms and conditions of use.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>2. Products and Services</h2>
          <p style={{ marginBottom: '1.5rem' }}>All products are handcrafted and subject to availability. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>3. Orders and Payments</h2>
          <p style={{ marginBottom: '1.5rem' }}>We currently accept Cash on Delivery (COD). By placing an order, you agree to pay the total amount specified at checkout upon delivery.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>4. Custom Orders</h2>
          <p style={{ marginBottom: '1.5rem' }}>Custom orders require special approval and may involve different pricing, timelines, and deposit requirements. Custom orders are final and cannot be returned unless defective.</p>
        </div>
      </div>
    </main>
  );
}
