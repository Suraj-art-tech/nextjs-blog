import { NextResponse } from 'next/server';
import setCookie from "set-cookie-parser";
import vtexConfig from '../../../utils/config';

export async function GET(req) {
  const host = req.headers.get("host"); // Gets the domain (e.g., example.com:3000)
  const protocol = req.headers.get("x-forwarded-proto") || "https"; /* Detects HTTP or HTTPS */
  const requestDomain = `${protocol}://${host}`; /* Full domain */

  try {
    // Call VTEX logout endpoint
    const vtexRes = await fetch(`http://vtexid.vtex.com.br/api/vtexid/pub/logout?scope=nagarropartnerind`, {
      method: 'GET',
      headers: {
        'Cookie': req.headers.get('cookie'),
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensures cookies are included
    });

    /* Extract VTEX cookies */
    const rawHeaders = vtexRes.headers;
    const vtexCookies = rawHeaders.getSetCookie?.() || rawHeaders.get('set-cookie');

    const cookiesArray = setCookie.parse(vtexCookies, { map: false });

    console.log('Parsed Cookies', cookiesArray)

    /* Modify the domain of each cookie while preserving attributes */
    const updatedCookies = cookiesArray.map(cookie => {
      let cookieString = `${cookie.name}=${cookie.value}; Path=${cookie.path || "/"}; HttpOnly; Secure; SameSite=${cookie.sameSite || "Lax"}; Domain=${host}`;

      if (cookie.expires) {
        cookieString += `; Expires=${new Date(cookie.expires).toUTCString()}`;
      }
      if (cookie.maxAge) {
        cookieString += `; Max-Age=${cookie.maxAge}`;
      }

      return cookieString;
    });

    /* Create response and set modified cookies */
    const res = NextResponse.redirect(`${requestDomain}`);
    console.log('Final Logout Res Header', updatedCookies);
    updatedCookies.forEach(cookie => res.headers.append("Set-Cookie", cookie));

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
