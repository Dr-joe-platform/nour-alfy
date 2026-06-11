import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 className="text-accent" style={{
        fontSize: '8rem',
        fontWeight: '300',
        lineHeight: '1',
        marginBottom: '1rem',
        fontFamily: 'var(--font-playfair, Georgia, serif)',
        letterSpacing: '0.05em'
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '400',
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-playfair, Georgia, serif)',
        color: 'var(--foreground)'
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: 'var(--secondary-text)',
        fontSize: '1.1rem',
        maxWidth: '500px',
        marginBottom: '2.5rem',
        lineHeight: '1.6'
      }}>
        We couldn't find the page you were looking for. It might have been removed, renamed, or perhaps it never existed in our collection.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link 
          href="/" 
          className="hover-glow"
          style={{
            display: 'inline-block',
            padding: '1rem 2.5rem',
            background: 'var(--primary-accent)',
            color: 'var(--background)',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
        >
          Return Home
        </Link>
        <Link 
          href="/shop" 
          className="hover-glow"
          style={{
            display: 'inline-block',
            padding: '1rem 2.5rem',
            background: 'transparent',
            color: 'var(--primary-accent)',
            border: '1px solid var(--primary-accent)',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
        >
          Explore Shop
        </Link>
      </div>
    </div>
  );
}
