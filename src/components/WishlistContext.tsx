'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

type WishlistItem = {
  id: string;
  name: string;
  price: string | number;
  img: string;
  category: string;
};

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const addToWishlist = (item: WishlistItem) => {
    if (!wishlist.find(p => p.id === item.id)) {
      setWishlist(prev => [...prev, item]);
      showToast('Added to Wishlist!');
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
    showToast('Removed from Wishlist');
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(p => p.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
