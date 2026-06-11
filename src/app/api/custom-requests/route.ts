export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, 'customRequests'), {
      ...data,
      status: 'PENDING',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Send Email Notification
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER || process.env.EMAIL_USER,
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER || process.env.EMAIL_USER,
        to: process.env.SMTP_USER || process.env.EMAIL_USER, // Send to the store owner
        subject: `New Custom Order Request from ${data.name}`,
        html: `
          <h2>New Custom Design Request</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Material:</strong> ${data.material}</p>
          <p><strong>Dimensions:</strong> ${data.dimensions || 'N/A'}</p>
          <h3>Design Idea:</h3>
          <p>${data.idea}</p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // We do not fail the request if the email fails, since it is saved in Firebase
    }
    
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
