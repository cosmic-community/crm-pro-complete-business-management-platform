import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName, role } = validation.data

    try {
      // Check if user already exists in Cosmic CMS
      const existingUsers = await cosmic.objects
        .find({ type: 'users', 'metadata.email': email.toLowerCase().trim() })
        .props(['id', 'metadata'])

      if (existingUsers?.objects && existingUsers.objects.length > 0) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        )
      }

      // Hash password (for future use when storing in separate auth system)
      const hashedPassword = await hashPassword(password)

      // Create user in Cosmic CMS
      const newUser = await cosmic.objects.insertOne({
        title: `${firstName} ${lastName}`,
        type: 'users',
        status: 'published',
        metadata: {
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase().trim(),
          role: {
            key: role,
            value: role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')
          },
          department: role === 'sales_manager' || role === 'sales_rep' ? 'Sales' : 'General',
          is_active: true,
          // Note: We don't store the actual password in Cosmic CMS for security
          // This would typically be stored in a separate secure authentication system
        }
      })

      // Generate JWT token
      const token = generateToken({
        userId: newUser.object.id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role
      })

      // Create response with user data
      const response = NextResponse.json({
        success: true,
        user: {
          id: newUser.object.id,
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: role
        }
      })

      // Set HTTP-only cookie
      response.headers.set('Set-Cookie', setAuthCookie(token))

      return response
    } catch (cosmicError: any) {
      console.error('Cosmic CMS error during registration:', cosmicError)
      return NextResponse.json(
        { error: 'Registration service error. Please try again.' },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}