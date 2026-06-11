import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    const promoRef = collection(db, 'promoCodes');
    const q = query(promoRef, where('code', '==', code.toUpperCase().trim()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ valid: false, error: 'Invalid promo code' }, { status: 404 });
    }

    const promoDoc = snapshot.docs[0].data();

    // Check if active
    if (promoDoc.isActive === false) {
      return NextResponse.json({ valid: false, error: 'This promo code is no longer active' }, { status: 400 });
    }

    // Check expiry
    const now = new Date();
    const expiry = new Date(promoDoc.expiryDate);
    if (now > expiry) {
      return NextResponse.json({ valid: false, error: 'This promo code has expired' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      discount: {
        type: promoDoc.type,
        value: promoDoc.value,
        code: promoDoc.code
      }
    });

  } catch (error) {
    console.error('Failed to validate promo code:', error);
    return NextResponse.json({ valid: false, error: 'Failed to validate promo code' }, { status: 500 });
  }
}
