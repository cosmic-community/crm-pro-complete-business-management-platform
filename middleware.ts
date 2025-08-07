import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isDemoMode = request.cookies.get('demo-mode')?.value === 'true'

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path)

  // API routes that don't require authentication
  const publicApiPaths = ['/api/auth/login', '/api/auth/register', '/api/demo']
  const isPublicApiPath = publicApiPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Skip middleware for public paths and API paths
  if (isPublicPath || isPublicApiPath) {
    return NextResponse.next()
  }

  // Check if user is authenticated or in demo mode
  const isAuthenticated = token && verifyToken(token)
  
  // If accessing a protected route without authentication and not in demo mode
  if (!isAuthenticated && !isDemoMode) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated and accessing login/register pages, redirect to dashboard
  if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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