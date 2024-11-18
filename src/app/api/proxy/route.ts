import { NextRequest } from 'next/server';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url || typeof url !== 'string') {
    return Response.json(
      { error: 'Missing URL query parameter' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Set appropriate headers
    const headers = new Headers();
    headers.set(
      'Content-Type',
      response.headers.get('Content-Type') || 'audio/mpeg'
    );
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET');

    // Send the response body
    const arrayBuffer = await response.arrayBuffer();
    return new Response(arrayBuffer, { headers });
  } catch (error) {
    console.error('Proxy Error:', error);
    return Response.json({ error: 'Failed to fetch URL' }, { status: 500 });
  }
}
