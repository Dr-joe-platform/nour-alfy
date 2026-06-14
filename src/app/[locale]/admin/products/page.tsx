'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useToast } from '@/components/ToastContext';
import styles from './AdminProducts.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string | null;
  inStock: boolean;
}

export default function AdminProducts() {
  const { showToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('add') === 'true') {
        setShowAddForm(true);
      }
    }
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

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setImageUrls(['']);
    setShowAddForm(!showAddForm);
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setShowAddForm(true);
    let parsedImages = [''];
    if (product.images) {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsedImages = parsed;
        }
      } catch (e) {}
    }
    setImageUrls(parsedImages);
  };

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleRemoveImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    if (newUrls.length === 0) newUrls.push('');
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      price: formData.get('price'),
      category: formData.get('category'),
      description: formData.get('description'),
      leatherType: formData.get('leatherType'),
      dimensions: formData.get('dimensions'),
      colors: formData.get('colors'),
      images: imageUrls.filter(url => url.trim() !== ''),
    };
    
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setShowAddForm(false);
        setImageUrls(['']);
        setEditingProduct(null);
        fetchProducts();
        showToast(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        const resData = await res.json();
        showToast(resData.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('An error occurred while saving the product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        showToast('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getFirstImage = (imagesStr: string | null) => {
    if (!imagesStr) return null;
    try {
      const parsed = JSON.parse(imagesStr);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className={styles.header} style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gold" style={{ fontWeight: 300, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Products Inventory</h1>
          <p style={{ color: 'var(--secondary-text)' }}>Manage your catalog, add new items, and update stock.</p>
        </div>
        <button 
          onClick={handleAddNewClick}
          className={`bg-accent hover-glow ${styles.addBtn}`}
          style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className={`glass-panel premium-shadow animate-fade-in ${styles.formContainer}`}>
          <h2 style={{ marginBottom: '2rem', fontWeight: 400 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form className={styles.form} onSubmit={handleSubmit} key={editingProduct?.id || 'new'}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Product Name</label>
                <input name="name" type="text" defaultValue={editingProduct?.name} placeholder="e.g. Vintage Leather Tote" required className="accent-border" />
              </div>
              <div className={styles.inputGroup}>
                <label>Category</label>
                <input 
                  name="category" 
                  list="category-options"
                  className="accent-border" 
                  defaultValue={editingProduct?.category || "Accessories"} 
                  required 
                  placeholder="Select or type a new category..."
                />
                <datalist id="category-options">
                  <option value="Beaded Bags" />
                  <option value="Embroidery" />
                  <option value="Accessories" />
                </datalist>
              </div>
              <div className={styles.inputGroup}>
                <label>Price (EGP)</label>
                <input name="price" type="number" defaultValue={editingProduct?.price} placeholder="e.g. 1500" required className="accent-border" />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea name="description" rows={4} defaultValue={editingProduct?.description} placeholder="Describe the product and craftmanship..." className="accent-border"></textarea>
            </div>

            <h3 style={{ marginTop: '1rem', color: 'var(--primary-accent)', fontWeight: 400 }}>Product Specifications</h3>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Leather Type / Material</label>
                <input name="leatherType" type="text" defaultValue={editingProduct?.leatherType} placeholder="e.g. Full-Grain Italian Leather" className="accent-border" />
              </div>
              <div className={styles.inputGroup}>
                <label>Dimensions</label>
                <input name="dimensions" type="text" defaultValue={editingProduct?.dimensions} placeholder="e.g. 35cm x 28cm x 15cm" className="accent-border" />
              </div>
              <div className={styles.inputGroup}>
                <label>Available Colors</label>
                <input name="colors" type="text" defaultValue={editingProduct?.colors} placeholder="e.g. Tan, Espresso, Black (Comma separated)" className="accent-border" />
              </div>
            </div>

            <h3 style={{ marginTop: '1rem', color: 'var(--primary-accent)', fontWeight: 400 }}>Product Images (URLs)</h3>
            <div className={styles.inputGroup}>
              {imageUrls.map((url, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg" 
                    className="accent-border" 
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => handleRemoveImageUrl(index)} style={{ padding: '0 1rem', background: '#333', color: 'white', borderRadius: '4px' }}>X</button>
                </div>
              ))}
              <button type="button" onClick={handleAddImageUrl} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'var(--primary-gold)', color: '#000', borderRadius: '4px', cursor: 'pointer' }}>+ Add Another Image URL</button>
            </div>

            <button type="submit" disabled={isSubmitting} className={`bg-accent text-accent hover-glow ${styles.submitBtn}`} style={{ marginTop: '2rem' }}>
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </form>
        </div>
      )}

      {/* Product List Table */}
      <div className={`glass-panel premium-shadow ${styles.tableContainer}`}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No products found.</td>
                </tr>
              ) : (
                products.map((product) => {
                  const firstImage = getFirstImage(product.images);
                  return (
                    <tr key={product.id}>
                      <td>
                        {firstImage ? (
                          <img src={firstImage} width="50" style={{ borderRadius: '4px', objectFit: 'cover', height: '50px' }} alt={product.name} />
                        ) : (
                          <div style={{ width: 50, height: 50, background: '#eee', borderRadius: '4px' }}></div>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>EGP {product.price.toLocaleString()}</td>
                      <td>
                        {product.inStock ? (
                          <span style={{ color: 'green' }}>In Stock</span>
                        ) : (
                          <span style={{ color: 'red' }}>Out of Stock</span>
                        )}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleEditClick(product)} 
                          className={styles.actionBtn} 
                          style={{ color: '#1e90ff', borderColor: 'rgba(30, 144, 255, 0.2)', background: 'rgba(30, 144, 255, 0.1)' }}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)} className={styles.actionBtn}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
