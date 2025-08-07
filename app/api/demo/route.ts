import { NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'
import { cosmic } from '@/lib/cosmic'

export async function POST() {
  try {
    // First, try to get an existing active user from Cosmic to use as demo user
    let demoUser = null
    
    try {
      const result = await cosmic.objects
        .find({ 
          type: 'users', 
          'metadata.is_active': true 
        })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
        .limit(1)

      if (result?.objects && result.objects.length > 0) {
        demoUser = result.objects[0]
      }
    } catch (cosmicError) {
      console.log('Could not fetch demo user from Cosmic, using fallback user')
    }

    // Create demo user payload - use actual user data if available, otherwise fallback
    const demoUserPayload = demoUser ? {
      userId: demoUser.id,
      email: demoUser.metadata?.email || 'demo@crmprodemp.com',
      firstName: demoUser.metadata?.first_name || 'Demo',
      lastName: demoUser.metadata?.last_name || 'User',
      role: demoUser.metadata?.role?.value || demoUser.metadata?.role?.key || 'admin'
    } : {
      userId: '6893a71754b8038efaf57a58', // Sarah Johnson's ID from the provided data
      email: 'sarah.johnson@company.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'sales_manager'
    }

    // Generate a token for the demo user
    const token = generateToken(demoUserPayload)

    // Create response with success message
    const response = NextResponse.json({ 
      success: true, 
      message: 'Demo session started successfully',
      redirectTo: '/dashboard'
    })

    const isProduction = process.env.NODE_ENV === 'production'
    const maxAge = 60 * 60 * 24 // 24 hours in seconds

    // Set both auth token and demo mode cookies
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: maxAge,
      path: '/'
    })

    response.cookies.set('demo-mode', 'true', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: maxAge,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Demo session creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to start demo session. Please try again.' },
      { status: 500 }
    )
  }
}