import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Fetch password from Firebase
    const authDocRef = doc(db, 'settings', 'auth');
    const authDocSnap = await getDoc(authDocRef);
    
    let adminPassword = process.env.ADMIN_PASSWORD || 'nouralfy2026';
    
    if (authDocSnap.exists() && authDocSnap.data().password) {
      adminPassword = authDocSnap.data().password;
    }

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'admin_token',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
