import { NextRequest, NextResponse } from 'next/server'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll use a simple password check
    // In production, you'd want proper password hashing
    const demoPassword = 'demo123'
    
    if (password !== demoPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    try {
      // Find user by email in Cosmic CMS
      const { objects: users } = await cosmic.objects
        .find({ type: 'users', 'metadata.email': email.toLowerCase().trim() })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)

      if (!users || users.length === 0) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const user = users[0]
      
      // Check if user is active
      if (user.metadata?.is_active === false) {
        return NextResponse.json(
          { error: 'Account is disabled' },
          { status: 401 }
        )
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.metadata?.email || '',
        firstName: user.metadata?.first_name || '',
        lastName: user.metadata?.last_name || '',
        role: user.metadata?.role?.value || user.metadata?.role?.key || 'user'
      })

      // Create response with user data
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.metadata?.email,
          firstName: user.metadata?.first_name,
          lastName: user.metadata?.last_name,
          role: user.metadata?.role?.value || user.metadata?.role?.key,
          department: user.metadata?.department,
          territory: user.metadata?.territory
        }
      })

      // Set HTTP-only cookie
      response.headers.set('Set-Cookie', setAuthCookie(token))

      return response
    } catch (cosmicError) {
      console.error('Cosmic CMS error:', cosmicError)
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}