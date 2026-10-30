import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add routes that require authentication here
const protectedRoutes = ['/checkout', '/profile', '/admin'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login/register while already logged in, redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
};
