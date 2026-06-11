export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, setDoc, doc } from 'firebase/firestore';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET() {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerEmail,
      customerPhone, 
      customerAddress, 
      totalAmount, 
      items 
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const shortId = Math.floor(10000 + Math.random() * 90000).toString();
    const orderId = `NA-${shortId}`;

    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, {
      customerName,
      customerEmail: customerEmail || null,
      customerPhone,
      customerAddress: customerAddress || null,
      totalAmount,
      status: 'PENDING',
      items, // Store items directly in the document
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Send confirmation email asynchronously (do not block the response)
    sendOrderConfirmationEmail(orderId, customerEmail, totalAmount, items).catch(console.error);

    return NextResponse.json({ success: true, orderId: orderId }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
