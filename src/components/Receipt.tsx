import React from 'react';

interface ReceiptProps {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  totalAmount: number;
  date: string;
}

export default function Receipt({
  orderId,
  customerName,
  customerPhone,
  customerAddress,
  items,
  totalAmount,
  date,
}: ReceiptProps) {
  return (
    <div className="receipt-container printable-receipt">
      <div className="receipt-header">
        <h2>NOUR ALFY</h2>
        <p>Premium Handmade Products</p>
        <p>Receipt #{orderId}</p>
        <p>Date: {new Date(date).toLocaleString()}</p>
      </div>

      <div className="receipt-customer">
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> {customerName}</p>
        <p><strong>Phone:</strong> {customerPhone}</p>
        <p><strong>Address:</strong> {customerAddress}</p>
      </div>

      <div className="receipt-items">
        <h3>Order Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Item</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const itemPrice = typeof item.price === 'string' ? parseInt(item.price.replace(/,/g, '')) : item.price;
              return (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{item.name}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>EGP {(itemPrice * item.quantity).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="receipt-total" style={{ marginTop: '2rem', textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Total: EGP {totalAmount.toLocaleString()}
      </div>

      <div className="receipt-footer" style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
        <p>Thank you for shopping with NOUR ALFY.</p>
        <p>For support, contact us at +20 102 270 2111</p>
      </div>

      <style jsx>{`
        .receipt-container {
          background: white;
          color: black;
          padding: 3rem;
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid #ddd;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          font-family: 'Playfair Display', serif;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid #000;
          padding-bottom: 1rem;
        }
        .receipt-header h2 {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          margin: 0;
          letter-spacing: 2px;
        }
        .receipt-header p {
          margin: 0.2rem 0;
          color: #333;
        }
        .receipt-customer {
          margin-bottom: 2rem;
        }
        .receipt-customer h3 {
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }
        .receipt-customer p {
          margin: 0.2rem 0;
        }
      `}</style>
    </div>
  );
}
