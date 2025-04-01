import { NextResponse } from 'next/server';
import vtexConfig from '../../../utils/config';

export async function GET(req) {
  const host = req.headers.get("host"); // Gets the domain (e.g., example.com:3000)
  const protocol = req.headers.get("x-forwarded-proto") || "https"; /* Detects HTTP or HTTPS */
  const requestDomain = `${protocol}://${host}`; /* Full domain */

  try {
    // Call VTEX logout endpoint
    const vtexRes = await fetch(`${vtexConfig.VTEXIDPUBURI}/api/vtexid/pub/logout?scope=${vtexConfig.scope}`);

    /* Extract VTEX cookies */
    const rawHeaders = vtexRes.headers;
    const vtexCookies = rawHeaders.getSetCookie?.() || rawHeaders.get('set-cookie');

    console.log('1:- VTEX COOKIES', vtexCookies)

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
