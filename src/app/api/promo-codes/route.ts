import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, type, value, expiryDate } = body;

    if (!code || !type || !value || !expiryDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const promoRef = collection(db, 'promoCodes');
    
    // Convert expiry to ISO to easily sort/compare
    const expiryISO = new Date(expiryDate).toISOString();

    await addDoc(promoRef, {
      code: code.toUpperCase().trim(),
      type, // 'percentage' | 'fixed'
      value: Number(value),
      expiryDate: expiryISO,
      isActive: true,
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ success: true, message: 'Promo code created' });
  } catch (error) {
    console.error('Failed to create promo code:', error);
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const promoRef = collection(db, 'promoCodes');
    const snapshot = await getDocs(promoRef);
    
    const codes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by newest
    codes.sort((a: any, b: any) => new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime());

    return NextResponse.json(codes);
  } catch (error) {
    console.error('Failed to fetch promo codes:', error);
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
}
