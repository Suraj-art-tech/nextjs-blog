import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const externalResponse = await fetch(
      'http://vtexid.vtex.com.br/api/vtexid/pub/authentication/start?appStart=true&scope=nagarropartnerind&accountName=nagarropartnerind&callbackUrl=/&returnUrl=/',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensures cookies are included
      }
    );

    // Read raw headers to get cookies
    const rawHeaders = externalResponse.headers;
    const cookies = rawHeaders.getSetCookie?.() || rawHeaders.get('set-cookie');

    console.log('Cookies', cookies)
    const data = await externalResponse.json();
    const res = NextResponse.json(data);

    if (cookies) {
      // Ensure cookies are properly formatted and set for the client's domain
      res.headers.set('Set-Cookie', cookies);
    }

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
