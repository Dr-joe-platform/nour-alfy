import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { name, price, category, description, leatherType, dimensions, colors, images } = data;

    if (!name || isNaN(parseFloat(price))) {
      return NextResponse.json({ error: 'Name and valid price are required' }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, 'products'), {
      name,
      price: parseFloat(price),
      category: category || 'Accessories',
      description: description || null,
      leatherType: leatherType || null,
      dimensions: dimensions || null,
      colors: colors || null,
      images: images && images.length > 0 ? JSON.stringify(images) : null,
      inStock: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
