import { NextResponse } from 'next/server';
import vtexConfig from '../../../utils/config';
import setCookie from 'set-cookie-parser';  // Importing set-cookie-parser

export async function GET(req) {
  const host = req.headers.get("host"); // Gets the domain (e.g., example.com:3000)
  const protocol = req.headers.get("x-forwarded-proto") || "https"; /* Detects HTTP or HTTPS */
  const requestDomain = `${protocol}://${host}`; /* Full domain */

  try {
    // Call VTEX logout endpoint
    const vtexRes = await fetch(`${vtexConfig.MASTERWSURI}/api/vtexid/pub/logout?scope=${vtexConfig.scope}`);

    /* Extract VTEX cookies */
    const rawHeaders = vtexRes.headers;
    const vtexCookies = rawHeaders.getSetCookie?.() || rawHeaders.get('set-cookie');

    console.log('1:- VTEX COOKIES', vtexCookies)

    // Get the cookies from the request
    const cookies = req.headers.get('cookie') || '';
    
    console.log('2:- REQ DOMAIN COOKIES', cookies?.split(';'))

    // Parse cookies using set-cookie-parser
    const parsedCookies = setCookie.parse(cookies);

    // Create a response object to redirect the user
    const response = NextResponse.redirect(`${requestDomain}`);

    // Loop through parsed cookies and expire each of them
    parsedCookies.forEach((cookie) => {
      const cookieName = cookie.name;

      // Expire the cookie by setting it to the past
      response.cookies.set(cookieName, '', {
        path: '/',
        domain: host,
        expires: new Date(0), // Expire the cookie immediately
        httpOnly: cookie.httpOnly, // Maintain HttpOnly flag
        secure: protocol === 'https', // Secure cookies only over HTTPS
      });
    });

    // Log the cookies that are set in the response for debugging
    const allCookies = response.cookies.getAll();
    console.log('Final Cookies:', allCookies);

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
