import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
      }
    });

    const host = request.headers.get('host') || 'www.nouralfy.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>NOUR ALFY Products</title>
    <link>${baseUrl}</link>
    <description>Premium Handmade Leather Bags &amp; Accessories</description>
`;

    products.forEach((product) => {
      let imageUrl = '';
      try {
        if (product.images) {
          const imagesArr = JSON.parse(product.images);
          if (Array.isArray(imagesArr) && imagesArr.length > 0) {
            imageUrl = imagesArr[0];
            if (imageUrl.startsWith('/')) {
              imageUrl = `${baseUrl}${imageUrl}`;
            }
          }
        }
      } catch (e) {
        console.error('Error parsing product images', e);
      }

      // Default to Arabic locale as primary for Egypt, or EN if preferred. Let's use Arabic 'ar' as it is targeting local market mostly.
      const productLink = `${baseUrl}/ar/product/${product.id}`;
      const availability = product.inStock ? 'in_stock' : 'out_of_stock';
      const description = product.description 
        ? product.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') 
        : 'Premium Handmade Leather Product';
      const title = product.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      xml += `
    <item>
      <g:id>${product.id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${productLink}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price.toFixed(2)} EGP</g:price>
      <g:brand>NOUR ALFY</g:brand>
    </item>`;
    });

    xml += `
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating Google Shopping Feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
