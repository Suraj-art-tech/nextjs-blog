import { NextResponse } from 'next/server';
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

    console.log('2dssdv:- Parsed Cookies', cookiesArray)
    // Get the cookies from the request
    // const cookies = req.headers.get('cookie');
    // const cookiesArr = cookies?.split(';');
    // const cookierNameArr = cookiesArr.map((cookie) => cookie.split('=')[0]);

    const response = NextResponse.redirect(`${requestDomain}`);

    // // Loop through parsed cookies and expire each of them
    // cookierNameArr.forEach(cookieName => {
    //   response.cookies.set(cookieName, '', {
    //     path: '/',
    //     httpOnly: true,
    //     domain: `.${host}`,
    //     expires: new Date(0),  // Expire immediately
    //     secure: protocol === 'https',
    //   });
    //   console.log(`Expired cookie: ${cookieName}`);
    // });

    // // Log the cookies that are set in the response for debugging
    // const allCookies = response.cookies.getAll();
    // console.log('Final Cookies:', allCookies);

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
