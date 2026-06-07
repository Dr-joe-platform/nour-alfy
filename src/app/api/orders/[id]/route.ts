import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { sendStatusUpdateEmail } from '@/lib/email';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const data = docSnap.data();
    const order = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
    };

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    let customerEmail = null;
    if (docSnap.exists()) {
      customerEmail = docSnap.data().customerEmail;
    }

    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });

    if (customerEmail) {
      sendStatusUpdateEmail(id, customerEmail, status).catch(console.error);
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Since Firebase Client SDK for Firestore does not have deleteDoc exported from 'firebase/firestore' directly
    // Wait, it is exported as deleteDoc!
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(docRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
