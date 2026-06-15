import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await deleteDoc(doc(db, 'products', id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const { name, price, category, description, leatherType, dimensions, colors, images, stock } = data;

    if (!name || isNaN(parseFloat(price))) {
      return NextResponse.json({ error: 'Name and valid price are required' }, { status: 400 });
    }

    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
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
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
