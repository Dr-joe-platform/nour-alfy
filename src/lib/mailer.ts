import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this if using another provider
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendNewProductEmail(
  subscribers: string[],
  product: { id: string; name: string; price: number; description: string | null; img: string | null },
  baseUrl: string
) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP credentials missing. Please add SMTP_EMAIL and SMTP_PASSWORD to your .env file.');
  }

  if (subscribers.length === 0) return;

  const productUrl = `${baseUrl}/product/${product.id}`;
  const displayImage = product.img || `${baseUrl}/products/bag1.jpeg`;

  const htmlContent = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a; letter-spacing: 2px; margin-bottom: 5px; font-family: 'Times New Roman', Times, serif;">NOUR ALFY</h1>
        <p style="color: #d4af37; font-style: italic; margin-top: 0;">handmade products</p>
      </div>

      <h2 style="color: #333; text-align: center; font-weight: 300;">New Arrival: ${product.name}</h2>
      
      <div style="text-align: center; margin: 20px 0;">
        <img src="${displayImage}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
      </div>

      <div style="padding: 20px; background-color: #fcfcfc; border-radius: 8px; text-align: center;">
        <p style="font-size: 18px; color: #d4af37; font-weight: bold; margin-bottom: 15px;">EGP ${product.price.toLocaleString()}</p>
        
        ${product.description ? `<p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${product.description}</p>` : ''}
        
        <a href="${productUrl}" style="display: inline-block; padding: 12px 30px; background-color: #d4af37; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
          Shop Now
        </a>
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #999;">
        <p>You received this email because you subscribed to the NOUR ALFY newsletter.</p>
        <p>&copy; ${new Date().getFullYear()} NOUR ALFY. All rights reserved.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"NOUR ALFY" <${process.env.SMTP_EMAIL}>`,
    to: [], // We'll use bcc so subscribers don't see each other's emails
    bcc: subscribers,
    subject: `✨ New Arrival: ${product.name} | NOUR ALFY`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Successfully sent new product email to ${subscribers.length} subscribers.`);
  } catch (error) {
    console.error('Error sending newsletter email:', error);
    throw error;
  }
}
