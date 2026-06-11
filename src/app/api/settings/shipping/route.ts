export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const docRef = doc(db, 'settings', 'shipping');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      // Default initial state
      return NextResponse.json({ defaultRate: 100, overrides: {} });
    }
  } catch (error) {
    console.error('Failed to fetch shipping settings:', error);
    return NextResponse.json({ error: 'Failed to fetch shipping settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const docRef = doc(db, 'settings', 'shipping');
    await setDoc(docRef, body, { merge: true });
    return NextResponse.json({ success: true, message: 'Shipping settings updated' });
  } catch (error) {
    console.error('Failed to update shipping settings:', error);
    return NextResponse.json({ error: 'Failed to update shipping settings' }, { status: 500 });
  }
}
