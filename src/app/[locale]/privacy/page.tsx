import Navbar from '@/components/Navbar';

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ padding: '6rem 2rem 2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--foreground)' }}>
        <h1 className="text-accent" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 300 }}>Privacy Policy</h1>
        
        <div className="glass-panel" style={{ padding: '2rem', lineHeight: '1.8' }}>
          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '1.5rem' }}>We collect information from you when you register on our site, place an order, subscribe to our newsletter, or respond to a survey. The collected information includes your name, email address, mailing address, and phone number.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: '1.5rem' }}>Any of the information we collect from you may be used to personalize your experience, improve our website, improve customer service, and process transactions securely.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>3. Data Protection</h2>
          <p style={{ marginBottom: '1.5rem' }}>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>

          <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>4. Contacting Us</h2>
          <p style={{ marginBottom: '1.5rem' }}>If there are any questions regarding this privacy policy, you may contact us using the information on our website.</p>
        </div>
      </div>
    </main>
  );
}
