import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development'

function verifyTokenMiddleware(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicPaths = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/api/auth/login', 
    '/api/auth/register',
    '/',
    '/favicon.ico',
    '/_next',
    '/api/health'
  ]
  
  // Check if the current path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for authentication on protected routes
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    console.log('No token found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = verifyTokenMiddleware(token)
  if (!payload || typeof payload === 'string') {
    console.log('Invalid token, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Add user info to headers for API routes
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', (payload as any).userId)
    requestHeaders.set('x-user-role', (payload as any).role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}