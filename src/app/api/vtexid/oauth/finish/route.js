import { NextResponse } from 'next/server';

/** Final finish OAuth on the master workspace account */
const masterWSURI = 'https://nagarropartnerind.myvtex.com';

export async function GET(req) {
  const host = req.headers.get("host"); // Gets the domain (e.g., example.com:3000)
  const protocol = req.headers.get("x-forwarded-proto") || "https"; // Detects HTTP or HTTPS
  const requestDomain = `${protocol}://${host}`; // Full domain

  try {
    /* Parse the URL from the request */
    const url = new URL(req.url);
    const externalResponse = await fetch(
      `${masterWSURI}/api/vtexid/oauth/finish${url.search}`,
      {
        method: 'GET'
      }
    );

    /* Determine user's domain dynamically (assuming it's provided in the callbackUrl query param) */
    const callbackUrl = `${requestDomain}/auth/success`;

    /* Read raw headers to get cookies */
    const rawHeaders = externalResponse.headers;
    const cookies = rawHeaders.getSetCookie?.() || rawHeaders.get('set-cookie');

    console.log('Cookies', cookies);
    const res = NextResponse.redirect(callbackUrl);

    if (cookies) {
      /* Ensure cookies are properly formatted and set for the client's domain */
      res.headers.set('Set-Cookie', cookies);
    }

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
