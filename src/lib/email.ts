import nodemailer from 'nodemailer';

// This is a placeholder/mock transport.
// In production, replace the host/port/auth with your actual SMTP credentials.
// For example, if using Gmail, use service: 'gmail', auth: { user: '...', pass: 'APP_PASSWORD' }
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
    pass: process.env.SMTP_PASS || 'ethereal_password',
  },
});

export const sendOrderConfirmationEmail = async (orderId: string, customerEmail: string, totalAmount: number, items: any[]) => {
  // If email is not provided, just log it.
  if (!customerEmail) {
    console.log(`[Email Mock] Order ${orderId} confirmation not sent (No email provided).`);
    return;
  }

  const itemsHtml = items ? items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e2d5c3; color: #2b2520;"><strong>${item.name || item.product?.name || 'Product'}</strong></td>
      <td style="padding: 15px; border-bottom: 1px solid #e2d5c3; text-align: center; color: #5c4d40;">${item.quantity}</td>
      <td style="padding: 15px; border-bottom: 1px solid #e2d5c3; text-align: right; color: #8b5a2b;">EGP ${((item.price || 0) * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('') : '';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const mailOptions = {
    from: '"NOUR ALFY" <nouralfy26@gmail.com>',
    to: customerEmail,
    subject: `Order Confirmation & Receipt - #${orderId}`,
    attachments: [{
      filename: 'logo-light.png',
      path: process.cwd() + '/public/products/logo-light.png',
      cid: 'nouralfylogo' 
    }],
    html: `
      <div style="background-color: #f7f3eb; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; border-top: 5px solid #8b5a2b; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="cid:nouralfylogo" alt="NOUR ALFY Logo" style="width: 100px; height: auto; border-radius: 50%; margin-bottom: 15px;" />
            <h1 style="font-family: Georgia, serif; color: #d4af37; margin: 0; font-size: 28px; letter-spacing: 2px;">NOUR ALFY</h1>
            <p style="color: #8b5a2b; margin-top: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Premium Handmade Leather</p>
          </div>

          <h2 style="color: #2b2520; font-family: Georgia, serif; font-size: 22px; text-align: center; margin-bottom: 20px;">Thank You For Choosing Excellence!</h2>
          <p style="color: #5c4d40; line-height: 1.8; font-size: 16px; text-align: center; margin-bottom: 30px;">
            Your order <strong>#${orderId.toUpperCase()}</strong> has been successfully placed. <br><br>
            Every piece at NOUR ALFY is more than just a product; it is a masterpiece born from passion and meticulous craftsmanship. Our artisans use only the finest, carefully selected leather, dedicating hours of precision to ensure that what you receive is nothing short of perfection. We are truly honored to craft these pieces exclusively for you.
          </p>
          
          <div style="margin-top: 40px;">
            <h3 style="color: #2b2520; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2d5c3; padding-bottom: 10px;">Your Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr>
                  <th style="padding: 10px 15px; border-bottom: 2px solid #8b5a2b; text-align: left; color: #2b2520; font-size: 14px;">Item</th>
                  <th style="padding: 10px 15px; border-bottom: 2px solid #8b5a2b; text-align: center; color: #2b2520; font-size: 14px;">Qty</th>
                  <th style="padding: 10px 15px; border-bottom: 2px solid #8b5a2b; text-align: right; color: #2b2520; font-size: 14px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: right; font-size: 20px; font-weight: bold; color: #8b5a2b; margin-top: 20px; font-family: Georgia, serif;">
              Total: EGP ${totalAmount.toLocaleString()}
            </div>
          </div>

          <div style="margin-top: 40px; text-align: center; padding-top: 30px; border-top: 1px solid #e2d5c3;">
            <p style="color: #5c4d40; font-size: 15px; line-height: 1.6;">Our master craftsmen will begin preparing your order immediately.<br>You will receive another notification the moment it ships.</p>
            <p style="color: #2b2520; font-weight: bold; margin-top: 20px; font-family: Georgia, serif; font-size: 18px;">Warm Regards,<br>The NOUR ALFY Team</p>
          </div>
          
        </div>
      </div>
    `,
  };

  try {
    // We are just logging for now unless environment variables are set
    console.log(`[Email Mock] Sending order confirmation to ${customerEmail}...`);
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Sent successfully.`);
  } catch (error) {
    console.error(`[Email Error] Failed to send email:`, error);
  }
};

export const sendStatusUpdateEmail = async (orderId: string, customerEmail: string, newStatus: string) => {
  if (!customerEmail) return;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const mailOptions = {
    from: '"NOUR ALFY" <nouralfy26@gmail.com>',
    to: customerEmail,
    subject: `Order Status Update - #${orderId.toUpperCase()}`,
    attachments: [{
      filename: 'logo-light.png',
      path: process.cwd() + '/public/products/logo-light.png',
      cid: 'nouralfylogo' 
    }],
    html: `
      <div style="background-color: #f7f3eb; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; border-top: 5px solid #d4af37; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="cid:nouralfylogo" alt="NOUR ALFY Logo" style="width: 100px; height: auto; border-radius: 50%; margin-bottom: 15px;" />
            <h1 style="font-family: Georgia, serif; color: #d4af37; margin: 0; font-size: 28px; letter-spacing: 2px;">NOUR ALFY</h1>
            <p style="color: #8b5a2b; margin-top: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Premium Handmade Leather</p>
          </div>

          <h2 style="color: #2b2520; font-family: Georgia, serif; font-size: 22px; text-align: center; margin-bottom: 20px;">Order Update</h2>
          <p style="color: #5c4d40; line-height: 1.6; font-size: 16px; text-align: center;">There is an exciting update regarding your handcrafted order <strong>#${orderId.toUpperCase()}</strong>.</p>
          
          <div style="background-color: #fffbf2; border: 1px solid #e2d5c3; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
            <span style="display: block; font-size: 14px; color: #5c4d40; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Current Status</span>
            <strong style="font-size: 24px; color: #8b5a2b; font-family: Georgia, serif; letter-spacing: 1px;">${newStatus}</strong>
          </div>

          <p style="color: #5c4d40; line-height: 1.8; font-size: 15px; text-align: center;">
            We pour our hearts into every stitch, ensuring the final piece reflects our legacy of unmatched quality.<br>
            You can track the live status of your order anytime using the <strong>Track Order</strong> page on our website.
          </p>

          <div style="margin-top: 40px; text-align: center; padding-top: 30px; border-top: 1px solid #e2d5c3;">
            <p style="color: #2b2520; font-weight: bold; font-family: Georgia, serif; font-size: 18px;">Warm Regards,<br>The NOUR ALFY Team</p>
          </div>
          
        </div>
      </div>
    `,
  };

  try {
    console.log(`[Email Mock] Sending status update to ${customerEmail}...`);
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Sent successfully.`);
  } catch (error) {
    console.error(`[Email Error] Failed to send email:`, error);
  }
};
