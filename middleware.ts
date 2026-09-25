import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protects /admin/* at the edge and keeps the Supabase session cookie fresh.
 * This is the FIRST layer. Every admin page and server action ALSO verifies the session
 * and the staff role on the server (src/lib/auth.ts) — never rely on middleware alone.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = pathname === '/admin/login';

  const toLogin = () => {
    const dest = request.nextUrl.clone();
    dest.pathname = '/admin/login';
    dest.search = '';
    if (pathname !== '/admin') dest.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(dest);
  };

  // Without Supabase configured nothing in /admin can work; send people to the login page (which explains it).
  if (!url || !key) return isLogin ? NextResponse.next() : toLogin();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list: { name: string; value: string; options: CookieOptions }[]) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() validates the JWT with Supabase Auth (getSession() alone would trust the cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) return toLogin();
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
