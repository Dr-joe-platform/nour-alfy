import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, 'customRequests'), {
      ...data,
      status: 'PENDING',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    console.error('Failed to submit custom request:', error);
    return NextResponse.json(
      { error: 'Failed to submit custom request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requestsRef = collection(db, 'customRequests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const requests = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });
    
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Failed to fetch custom requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom requests' },
      { status: 500 }
    );
  }
}
