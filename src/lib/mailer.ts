import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this if using another provider
  auth: {
    user: process.env.SMTP_EMAIL || process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

export async function sendNewProductEmail(
  subscribers: string[],
  product: { id: string; name: string; price: number; description: string | null; img: string | null },
  baseUrl: string
) {
  const emailUser = process.env.SMTP_EMAIL || process.env.SMTP_USER;
  const emailPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('SMTP credentials missing. Please add SMTP_EMAIL and SMTP_PASSWORD to your .env file.');
  }

  if (subscribers.length === 0) return;

  const productUrl = `${baseUrl}/product/${product.id}`;
  const displayImage = product.img || `${baseUrl}/products/bag1.jpeg`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Arrival - NOUR ALFY</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f7f7f7">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <tr>
                <td align="center" bgcolor="#111111" style="padding: 40px 20px; border-bottom: 3px solid #d4af37;">
                  <h1 style="color: #ffffff; font-family: 'Times New Roman', Times, serif; font-size: 32px; font-weight: normal; letter-spacing: 6px; margin: 0 0 10px 0;">NOUR ALFY</h1>
                  <p style="color: #d4af37; font-family: 'Georgia', serif; font-style: italic; font-size: 16px; margin: 0; letter-spacing: 1px;">handmade elegance</p>
                </td>
              </tr>
              
              <!-- Hero Section -->
              <tr>
                <td align="center" style="padding: 40px 30px 20px 30px;">
                  <h2 style="color: #222222; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 30px 0;">✨ Discover Our Latest Creation</h2>
                  <img src="${displayImage}" alt="${product.name}" width="500" style="width: 100%; max-width: 500px; height: auto; border-radius: 8px; display: block; box-shadow: 0 5px 20px rgba(0,0,0,0.1);" />
                </td>
              </tr>
              
              <!-- Product Details -->
              <tr>
                <td align="center" style="padding: 20px 40px;">
                  <h3 style="color: #111111; font-size: 26px; font-weight: 500; margin: 0 0 15px 0; font-family: 'Georgia', serif;">${product.name}</h3>
                  <div style="height: 2px; width: 40px; background-color: #d4af37; margin: 0 auto 20px auto;"></div>
                  <p style="color: #d4af37; font-size: 22px; font-weight: bold; margin: 0 0 20px 0;">EGP ${product.price.toLocaleString()}</p>
                  
                  ${product.description ? `<p style="color: #555555; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0; text-align: center;">${product.description}</p>` : ''}
                </td>
              </tr>
              
              <!-- CTA Button -->
              <tr>
                <td align="center" style="padding: 0 40px 50px 40px;">
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" bgcolor="#d4af37" style="border-radius: 4px;">
                        <a href="${productUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; text-decoration: none; border: 1px solid #d4af37; border-radius: 4px;">Explore Now</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td align="center" bgcolor="#fcfcfc" style="padding: 30px 20px; border-top: 1px solid #eeeeee;">
                  <p style="color: #888888; font-size: 13px; line-height: 1.5; margin: 0 0 10px 0;">You received this email because you are subscribed to exclusive updates from NOUR ALFY.</p>
                  <p style="color: #aaaaaa; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} NOUR ALFY. All rights reserved.</p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"NOUR ALFY" <${emailUser}>`,
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
