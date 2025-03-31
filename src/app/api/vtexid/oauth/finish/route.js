import { NextResponse } from "next/server";

/** Final finish OAuth on the master workspace account */
const masterWSURI = "https://nagarropartnerind.myvtex.com";

export async function GET(req) {
  const host = req.headers.get("host"); // Gets the domain (e.g., example.com:3000)
  const protocol = req.headers.get("x-forwarded-proto") || "https"; // Detects HTTP or HTTPS
  const requestDomain = `${protocol}://${host}`; // Full domain

  try {
    /* Parse the URL from the request */
    const url = new URL(req.url);
    const vtexResponse  = await fetch(`${masterWSURI}/api/vtexid/oauth/finish${url.search}`);

    /* Determine user's domain dynamically (assuming it's provided in the callbackUrl query param) */
    const callbackUrl = `${requestDomain}/auth/success`;

    /* Read raw headers to get cookies */
    const vtexCookies = vtexResponse.headers.get("set-cookie");

    const res = NextResponse.redirect(callbackUrl);

    if (vtexCookies) {
      /* Split multiple cookies and re-set them for your domain */
      const cookiesArray = vtexCookies.split(", ");
      console.log('Cookie Array', cookiesArray);
      cookiesArray.forEach((cookie) => {
        const modifiedCookie = cookie.replace(
          "domain=nagarropartnerind.myvtex.com",
          `domain=${host}`
        );
        res.headers.append("Set-Cookie", modifiedCookie);
      });    
    }

    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
