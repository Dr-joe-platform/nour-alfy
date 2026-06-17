import { NextResponse } from 'next';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';

  return NextResponse.json({
    name: 'Nour Alfy Admin',
    short_name: 'Nour Alfy Admin',
    description: 'Nour Alfy Admin Dashboard',
    start_url: `/${locale}/admin`,
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  });
}
