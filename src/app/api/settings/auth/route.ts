export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const authDocRef = doc(db, 'settings', 'auth');
    const authDocSnap = await getDoc(authDocRef);
    
    let actualCurrentPassword = process.env.ADMIN_PASSWORD || 'nouralfy2026';
    
    if (authDocSnap.exists() && authDocSnap.data().password) {
      actualCurrentPassword = authDocSnap.data().password;
    }

    if (currentPassword !== actualCurrentPassword) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
    }

    // Save new password
    await setDoc(authDocRef, { password: newPassword }, { merge: true });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Failed to update password:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
