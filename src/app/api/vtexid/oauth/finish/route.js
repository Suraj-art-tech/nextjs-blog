import { NextResponse } from "next/server";
import setCookie from "set-cookie-parser";

const masterWSURI = "https://nagarropartnerind.myvtex.com";

export async function GET(req) {
  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const requestDomain = `${protocol}://${host}`;

  try {
    const url = new URL(req.url);
    const externalResponse = await fetch(
      `${masterWSURI}/api/vtexid/oauth/finish${url.search}`,
      {
        method: "GET",
        headers: {
          cookie: req.headers.get("cookie") || "", // Forward cookies from client
        },
        credentials: "include",
      }
    );

    // Extract VTEX cookies
    const vtexCookies = externalResponse.headers.get("set-cookie") || "";
    console.log("VTEX Set-Cookie Header:", vtexCookies);

    // Parse the received cookies
    const cookiesArray = setCookie.splitCookiesString(vtexCookies);
    const res = NextResponse.redirect(`${requestDomain}/auth/success`);
    res.headers.set("Cache-Control", "no-store");

    // Modify and append cookies
    cookiesArray.forEach((cookieStr) => {
      const parsedCookie = setCookie.parse(cookieStr)[0];

      if (!parsedCookie) return;
      
      let modifiedCookie = `${parsedCookie.name}=${parsedCookie.value}; Path=/; Secure; HttpOnly; SameSite=None;`;

      console.log('ParsedCookies', parsedCookie)
      if (parsedCookie.Expires) {
        modifiedCookie += ` Expires=${parsedCookie.Expires};`;
      }

      if (parsedCookie["Max-Age"]) {
        modifiedCookie += ` Max-Age=${parsedCookie["Max-Age"]};`;
      }

      modifiedCookie += ` Domain=${host};`;
      res.headers.append("Set-Cookie", modifiedCookie);
    });

    console.log("Final Response Headers:", [...res.headers.entries()]);
    return res;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
