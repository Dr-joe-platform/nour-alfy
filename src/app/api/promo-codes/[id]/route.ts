import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const docRef = doc(db, 'promoCodes', id);
    await deleteDoc(docRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete promo code:', error);
    return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const docRef = doc(db, 'promoCodes', id);
    await updateDoc(docRef, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update promo code:', error);
    return NextResponse.json({ error: 'Failed to update promo code' }, { status: 500 });
  }
}
