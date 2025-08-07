import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isDemoMode = request.nextUrl.searchParams.get('demo') === 'true'

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path)

  // API routes that don't require authentication
  const publicApiPaths = ['/api/auth/login', '/api/auth/register', '/api/demo']
  const isPublicApiPath = publicApiPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Allow demo mode access to dashboard and other protected routes
  if (isDemoMode && request.nextUrl.pathname.startsWith('/dashboard')) {
    const response = NextResponse.next()
    // Set a demo session cookie that lasts for the browser session
    response.cookies.set('demo-mode', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    return response
  }

  // Check if user is in demo mode
  const isDemoModeActive = request.cookies.get('demo-mode')?.value === 'true'

  // If accessing a protected route without a token and not in demo mode, redirect to login
  if (!token && !isPublicPath && !isPublicApiPath && !isDemoModeActive) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If token exists, verify it
  if (token) {
    const payload = verifyToken(token)
    
    // If token is invalid and accessing protected route and not in demo mode, redirect to login
    if (!payload && !isPublicPath && !isPublicApiPath && !isDemoModeActive) {
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