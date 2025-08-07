import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path)

  // API routes that don't require authentication
  const publicApiPaths = ['/api/auth/login', '/api/auth/register', '/api/demo']
  const isPublicApiPath = publicApiPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // If accessing a protected route without a token, redirect to login
  if (!token && !isPublicPath && !isPublicApiPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If token exists, verify it
  if (token) {
    const payload = verifyToken(token)
    
    // If token is invalid and accessing protected route, redirect to login
    if (!payload && !isPublicPath && !isPublicApiPath) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // If valid token and accessing login/register, redirect to dashboard
    if (payload && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}