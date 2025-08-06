import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, comparePassword, generateToken, setAuthCookie } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Login attempt for email:', body.email)
    
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      console.error('Validation failed:', validation.error.flatten())
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      console.error('User not found for email:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('User found:', { id: user.id, email: user.email, role: user.role })

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      console.error('Invalid password for user:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    })

    console.log('Login successful for user:', email)

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })

    // Set HTTP-only cookie
    response.headers.set('Set-Cookie', setAuthCookie(token))

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}