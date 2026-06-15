export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { sendNewProductEmail } from '@/lib/mailer';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Fetch the product
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productData = productSnap.data();

    // 2. Fetch subscribers
    const subscribersRef = collection(db, 'newsletterSubscribers');
    const subSnapshot = await getDocs(subscribersRef);
    const emails = subSnapshot.docs.map(doc => doc.data().email).filter(Boolean);

    if (emails.length === 0) {
      return NextResponse.json({ error: 'No subscribers found to send emails to.' }, { status: 400 });
    }

    // 3. Prepare product details
    let images = [];
    try {
      images = productData.images ? JSON.parse(productData.images) : [];
    } catch (e) {
      // Ignore
    }
    const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
    const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 4. Send Email
    await sendNewProductEmail(
      emails,
      { 
        id: productSnap.id, 
        name: productData.name, 
        price: productData.price, 
        description: productData.description, 
        img: firstImage 
      },
      baseUrl
    );

    return NextResponse.json({ success: true, message: `Email sent to ${emails.length} subscribers!` });
  } catch (error) {
    console.error('Failed to send manual product email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
