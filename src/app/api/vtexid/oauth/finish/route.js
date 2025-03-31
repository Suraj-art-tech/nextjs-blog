import setCookie from "set-cookie-parser";
import { NextResponse } from "next/server";

const masterWSURI = "https://nagarropartnerind.myvtex.com";

export async function GET(req) {
  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const requestDomain = `${protocol}://${host}`;

  try {
    const url = new URL(req.url);
    console.log('URL 1:-', `${masterWSURI}/api/vtexid/oauth/finish${url.search}`);
    const externalResponse = await fetch(`${masterWSURI}/api/vtexid/oauth/finish${url.search}`);

    /* Extract VTEX cookies */
    const vtexCookies = externalResponse.headers.get("set-cookie");

    if (!vtexCookies) {
      console.warn("No cookies received from VTEX API.");
      return NextResponse.redirect(`${requestDomain}/auth/success`);
    }

    /* Parse the received cookies */
    const cookiesArray = setCookie.parse(vtexCookies, { map: false });

    console.log('Cookies', vtexCookies);
    console.log('Cookies Array', cookiesArray);
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
    const res = NextResponse.redirect(`${requestDomain}/auth/success`);
    console.log('Updated Cookies', updatedCookies);
    updatedCookies.forEach(cookie => res.headers.append("Set-Cookie", cookie));

    return res;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
