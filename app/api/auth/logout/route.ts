import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

// Force this route to use Node.js runtime instead of Edge Runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' })
    
    // Clear the auth cookie
    response.headers.set('Set-Cookie', clearAuthCookie())
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}