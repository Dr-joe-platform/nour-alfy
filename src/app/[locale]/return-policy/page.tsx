import Navbar from '@/components/Navbar';

export default function ReturnPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ padding: '6rem 2rem 2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--foreground)' }}>
        <h1 className="text-accent" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 300 }}>Return & Exchange Policy</h1>
        
        <div className="glass-panel" style={{ padding: '2rem', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1.5rem' }}>At NOUR ALFY, we take pride in the quality and craftsmanship of our handmade products. We want you to be completely satisfied with your purchase.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>Returns</h2>
          <p style={{ marginBottom: '1.5rem' }}>If you are not completely satisfied with your purchase, you may return the item within 14 days of delivery. The item must be unused, in the same condition that you received it, and in its original packaging.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>Exchanges</h2>
          <p style={{ marginBottom: '1.5rem' }}>We only replace items if they are defective or damaged upon arrival. If you need to exchange it for the same item, please contact our support team.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>Custom Orders</h2>
          <p style={{ marginBottom: '1.5rem' }}>Please note that bespoke or custom-made items are crafted specifically to your requirements and are non-refundable and non-exchangeable unless there is a manufacturing defect.</p>
        </div>
      </div>
    </main>
  );
}
