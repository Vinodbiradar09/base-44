
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Session } from '@/lib/auth';

const PROTECTED_ROUTES = ['/chat-page'];
const PUBLIC_AUTH_ROUTES = ['/sign-in', '/sign-up', '/reset-password', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) => path.startsWith(route));

  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => path.startsWith(route));

  try {
    const session: Session | null = await auth.api.getSession({
      headers: request.headers,
    });

    if (isProtected && !session?.user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (session?.user && isPublicAuthRoute) {
      return NextResponse.redirect(new URL('/chat-page', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error while checking session:', error);
    if (isProtected) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/chat-page/:path*', '/sign-in/:path*', '/sign-up/:path*', '/reset-password/:path*', '/forgot-password/:path*'],
};