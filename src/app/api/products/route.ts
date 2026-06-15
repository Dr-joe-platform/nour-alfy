export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { sendNewProductEmail } from '@/lib/mailer';

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
    
    const { name, price, category, description, leatherType, dimensions, colors, images, stock } = data;

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
      stock: stock !== undefined ? parseInt(stock) : 1,
      inStock: stock !== undefined ? parseInt(stock) > 0 : true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Send newsletter emails asynchronously (don't await so it doesn't block the response)
    const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
      const subscribersRef = collection(db, 'newsletterSubscribers');
      const subSnapshot = await getDocs(subscribersRef);
      const emails = subSnapshot.docs.map(doc => doc.data().email).filter(Boolean);
      
      if (emails.length > 0) {
        const firstImage = images && images.length > 0 ? images[0] : null;
        await sendNewProductEmail(
          emails,
          { id: docRef.id, name, price: parseFloat(price), description, img: firstImage },
          baseUrl
        );
      }
    } catch (emailError) {
      console.error('Error initiating newsletter emails:', emailError);
    }

    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
