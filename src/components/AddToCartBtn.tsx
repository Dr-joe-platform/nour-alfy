'use client';

import { useCart } from './CartContext';
import { useToast } from './ToastContext';

export default function AddToCartBtn({ product, className }: { product: any, className: string }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  return (
    <button 
      className={className}
      onClick={(e) => {
        e.preventDefault(); // Prevent navigating if inside a Link
        addToCart({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          img: product.img
        });
        showToast(`${product.name} added to cart`);
        setIsCartOpen(true);
      }}
    >
      Add to Cart
    </button>
  );
}
