'use client';

import { useWishlist } from './WishlistContext';
import { Heart } from 'lucide-react';

interface WishlistBtnProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    img: string;
    category: string;
  };
  className?: string;
  size?: number;
}

export default function WishlistBtn({ product, className = '', size = 20 }: WishlistBtnProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent navigating to product page if button is inside a Link
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      className={`wishlist-btn ${className}`}
      aria-label="Toggle Wishlist"
      style={{
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: inWishlist ? '#ff4757' : 'var(--foreground)'
      }}
    >
      <Heart size={size} fill={inWishlist ? '#ff4757' : 'none'} color={inWishlist ? '#ff4757' : 'currentColor'} />
    </button>
  );
}
