import { NextResponse } from 'next/server'
import { generateToken, setAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    // Create a demo user session without requiring actual authentication
    const demoUserPayload = {
      userId: 'demo-user-id',
      email: 'demo@crmprodemp.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin'
    }

    // Generate a token for the demo user
    const token = generateToken(demoUserPayload)

    // Create response with redirect to dashboard
    const response = NextResponse.json({ 
      success: true, 
      message: 'Demo session started',
      redirectTo: '/dashboard'
    })

    // Set the auth cookie
    response.headers.set('Set-Cookie', setAuthCookie(token))

    return response
  } catch (error) {
    console.error('Demo session creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to start demo session' },
      { status: 500 }
    )
  }
}