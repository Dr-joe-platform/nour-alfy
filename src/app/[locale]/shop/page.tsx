'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AddToCartBtn from '@/components/AddToCartBtn';
import WishlistBtn from '@/components/WishlistBtn';
import { Search, Filter, ChevronDown } from 'lucide-react';
import styles from './Shop.module.css';

const CATEGORIES = ["All", "Beaded Bags", "Embroidery", "Accessories"];

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string | null;
  stock?: number;
}

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('API returned error:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFirstImage = (imagesStr: string | null) => {
    if (!imagesStr) return '/products/bag1.jpeg'; // fallback
    try {
      const parsed = JSON.parse(imagesStr);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/products/bag1.jpeg';
    } catch (e) {
      return '/products/bag1.jpeg';
    }
  };

  // Filter and Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMin = minPrice === "" || product.price >= parseInt(minPrice);
    const matchesMax = maxPrice === "" || product.price <= parseInt(maxPrice);
    
    return matchesCategory && matchesSearch && matchesMin && matchesMax;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // "newest" defaults to DB order (desc)
  });

  return (
    <main className={styles.main}>
      <Navbar />
      
      {/* Shop Header Banner */}
      <div className={styles.shopHeader}>
        <div className={styles.headerContent}>
          <h1 className="text-accent animate-fade-in">THE COLLECTION</h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover our meticulously handcrafted beaded bags, embroidery art, and accessories.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Sidebar Filters */}
        <aside className={`${styles.sidebar} glass-panel premium-shadow animate-fade-in`}>
          <div className={styles.filterGroup}>
            <h3 className="text-accent">Categories</h3>
            <ul className={styles.categoryList}>
              {CATEGORIES.map(category => (
                <li key={category}>
                  <button 
                    className={`${styles.categoryBtn} ${activeCategory === category ? styles.activeCategory : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.filterGroup}>
            <h3 className="text-accent">Price Range</h3>
            <div className={styles.priceFilter}>
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="accent-border" 
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="accent-border" 
              />
            </div>
          </div>
        </aside>

        {/* Main Product Area */}
        <div className={styles.productArea}>
          
          {/* Toolbar (Search & Sort) */}
          <div className={`${styles.toolbar} animate-fade-in`}>
            <div className={`${styles.searchBar} accent-border`}>
              <Search size={20} className="text-accent" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className={styles.sortOptions}>
              <span className="text-accent">Sort by:</span>
              <div className={`${styles.selectWrapper} accent-border`}>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>

          <div className={styles.productGrid}>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`${styles.productCard} glass-panel premium-shadow`} style={{ animation: `pulse 1.5s infinite ${i * 0.1}s` }}>
                  <div style={{ width: '100%', height: '320px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                  <div className={styles.productInfo}>
                    <div style={{ width: '60%', height: '20px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '0 auto 10px', borderRadius: '4px' }}></div>
                    <div style={{ width: '40%', height: '20px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '0 auto', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <div 
                  key={product.id} 
                  className={`${styles.productCard} glass-panel premium-shadow hover-glow animate-fade-in`}
                  style={{ animationDelay: `${(i % 10) * 0.1}s` }}
                >
                  <Link href={`/product/${product.id}`} className={styles.cardLink}>
                    <div className={styles.productImage}>
                      <Image 
                        src={getFirstImage(product.images)} 
                        alt={product.name} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                      />
                      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                        <WishlistBtn product={{...product, img: getFirstImage(product.images)}} />
                      </div>
                      {product.stock !== undefined && product.stock <= 0 && (
                        <div style={{
                          position: 'absolute', top: '10px', left: '10px', zIndex: 10,
                          backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', padding: '4px 10px',
                          borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px'
                        }}>
                          SOLD OUT
                        </div>
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <span className={styles.productCategory}>{product.category}</span>
                      <h3>{product.name}</h3>
                      <p className="text-accent">EGP {product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                  <div className={styles.cardActions}>
                    {(product.stock === undefined || product.stock > 0) ? (
                      <AddToCartBtn 
                        product={{...product, img: getFirstImage(product.images)}} 
                        className={`${styles.addToCart} bg-accent text-accent hover-glow`} 
                      />
                    ) : (
                      <button disabled className={`${styles.addToCart} bg-accent`} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <p>No products found matching your criteria.</p>
                <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className={`${styles.applyBtn} bg-accent hover-glow`} style={{marginTop: '1rem'}}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </main>
  );
}
