import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'REVIEWED', 'CONTACTED', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const docRef = doc(db, 'customRequests', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error('Failed to update request status:', error);
    return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { deleteDoc, doc } = await import('firebase/firestore');
    
    const docRef = doc(db, 'customRequests', id);
    await deleteDoc(docRef);
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to delete request:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
