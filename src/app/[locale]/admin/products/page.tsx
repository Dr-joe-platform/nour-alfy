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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [customCategory, setCustomCategory] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

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
    setSelectedFiles([]);
    setUploadProgress('');
    setShowAddForm(!showAddForm);
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setSelectedFiles([]);
    setUploadProgress('');
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
    
    // Check if category is standard
    const standardCategories = ["All", "Beaded Bags", "Embroidery", "Accessories"];
    if (product.category && !standardCategories.includes(product.category)) {
      setCustomCategory(true);
    } else {
      setCustomCategory(false);
    }
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress('Preparing upload...');
    
    // Construct FormData synchronously before any await
    const formData = new FormData(e.currentTarget);
    
    try {
      const uploadedUrls: string[] = [];
      
      // Upload files to ImgBB
      if (selectedFiles.length > 0) {
        const apiKey = "f616121a0de030c874e31d14666bb9c2";
        if (!apiKey) {
          throw new Error('Missing ImgBB API Key! Please add NEXT_PUBLIC_IMGBB_API_KEY to your .env file.');
        }

        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          setUploadProgress(`Uploading image ${i + 1} of ${selectedFiles.length}...`);
          
          const formDataImg = new FormData();
          formDataImg.append('image', file);
          
          const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formDataImg,
          });
          
          const uploadData = await uploadRes.json();
          if (uploadData.success) {
            uploadedUrls.push(uploadData.data.url);
          } else {
            throw new Error(uploadData.error?.message || 'Failed to upload image to ImgBB');
          }
        }
      }
      
      setUploadProgress('Saving product...');
      const categoryVal = formData.get('category');
      const customCategoryVal = formData.get('customCategory');
      const finalCategory = categoryVal === 'Other' ? customCategoryVal : categoryVal;

      const allImages = [...imageUrls.filter(url => url.trim() !== ''), ...uploadedUrls];

      const data = {
        name: formData.get('name'),
        price: formData.get('price'),
        category: finalCategory,
        description: formData.get('description'),
        leatherType: formData.get('leatherType'),
        dimensions: formData.get('dimensions'),
        colors: formData.get('colors'),
        images: allImages,
      };
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
        setSelectedFiles([]);
        setUploadProgress('');
        setEditingProduct(null);
        fetchProducts();
        showToast(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Failed to save product. Please try again.');
        setIsSubmitting(false);
        setUploadProgress('');
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      showToast(error.message || 'An error occurred. Please try again.');
      setIsSubmitting(false);
      setUploadProgress('');
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

  const handleSendEmail = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to send a newsletter email to all subscribers for "${name}"?`)) return;
    
    const toastId = showToast('Sending email to subscribers...');
    try {
      const res = await fetch(`/api/products/${id}/send-email`, {
        method: 'POST',
      });
      
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Emails sent successfully!');
      } else {
        showToast(data.error || 'Failed to send emails.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('An error occurred while sending emails.');
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
                <select 
                  name="category" 
                  className="accent-border" 
                  defaultValue={customCategory ? "Other" : (editingProduct?.category || "Accessories")} 
                  required
                  onChange={(e) => setCustomCategory(e.target.value === 'Other')}
                >
                  <option value="Beaded Bags">Beaded Bags</option>
                  <option value="Embroidery">Embroidery</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other (Add Custom)</option>
                </select>
                
                {customCategory && (
                  <input 
                    name="customCategory" 
                    type="text" 
                    className="accent-border" 
                    defaultValue={editingProduct?.category}
                    placeholder="Type custom category..." 
                    style={{ marginTop: '0.5rem' }}
                    required 
                  />
                )}
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

            <h3 style={{ marginTop: '1rem', color: 'var(--primary-accent)', fontWeight: 400 }}>Product Images</h3>
            
            <div className={styles.inputGroup} style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed var(--primary-accent)' }}>
              <label>Upload Images (via ImgBB)</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileSelect} 
                className="accent-border"
                style={{ background: 'transparent', padding: '0.5rem 0' }}
              />
              {selectedFiles.length > 0 && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--primary-accent)' }}>
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>

            <div className={styles.inputGroup} style={{ marginTop: '1.5rem' }}>
              <label>Or provide External Image URLs (Optional)</label>
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
              <button type="button" onClick={handleAddImageUrl} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'transparent', color: 'var(--primary-accent)', border: '1px solid var(--primary-accent)', borderRadius: '4px', cursor: 'pointer' }}>+ Add External URL</button>
            </div>

            <button type="submit" disabled={isSubmitting} className={`bg-accent text-accent hover-glow ${styles.submitBtn}`} style={{ marginTop: '2rem' }}>
              {isSubmitting ? uploadProgress || 'Saving...' : 'Save Product'}
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
                          onClick={() => handleSendEmail(product.id, product.name)} 
                          className={styles.actionBtn} 
                          style={{ color: '#d4af37', borderColor: 'rgba(212, 175, 55, 0.2)', background: 'rgba(212, 175, 55, 0.1)', marginRight: '0.5rem' }}
                        >
                          Email
                        </button>
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
