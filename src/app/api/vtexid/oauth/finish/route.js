import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Parse the URL from the request
    const url = new URL(req.url);

    // Extract query parameters
    const params = Object.fromEntries(url.searchParams);
    const { authCookieName, authCookieValue, accountAuthCookieName, accountAuthCookieValue } = params;

    // Determine user's domain dynamically (assuming it's provided in the callbackUrl query param)
    const callbackUrl = params.callbackUrl || 'https://www.surajhub.com';

    const res = NextResponse.redirect(callbackUrl);

    // Set cookies on the user's domain
    if (authCookieName && authCookieValue) {
      res.headers.append(
        'Set-Cookie',
        `${authCookieName}=${authCookieValue}; Path=/; HttpOnly; Secure; SameSite=Lax`
      );
    }

    if (accountAuthCookieName && accountAuthCookieValue) {
      res.headers.append(
        'Set-Cookie',
        `${accountAuthCookieName}=${accountAuthCookieValue}; Path=/; HttpOnly; Secure; SameSite=Lax`
      );
    }

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
