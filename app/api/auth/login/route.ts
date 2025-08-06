import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, comparePassword, generateToken, setAuthCookie } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Login attempt for email:', body.email)
    
    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      console.error('Validation failed:', validation.error.flatten())
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Enhanced database connection test with specific error messages
    try {
      console.log('Testing database connection...')
      await prisma.$queryRaw`SELECT 1 as test`
      console.log('Database connection test passed')
    } catch (dbError: any) {
      console.error('Database connection test failed:', dbError)
      
      // Provide specific error messages based on the error
      let errorMessage = 'Database connection failed'
      
      if (dbError?.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to database. Please ensure PostgreSQL is running.'
      } else if (dbError?.code === 'ENOTFOUND') {
        errorMessage = 'Database host not found. Please check your DATABASE_URL.'
      } else if (dbError?.code === 'P1001') {
        errorMessage = 'Cannot reach database server. Check connection settings.'
      } else if (dbError?.code === 'P1002') {
        errorMessage = 'Database server timed out. Check if database is accessible.'
      } else if (dbError?.code === 'P1003') {
        errorMessage = 'Database does not exist. Please create the database first.'
      } else if (dbError?.code === 'P1008') {
        errorMessage = 'Database connection timeout. Check network connectivity.'
      } else if (dbError?.code === 'P1009') {
        errorMessage = 'Database does not exist on the server.'
      } else if (dbError?.code === 'P1010') {
        errorMessage = 'Access denied to database. Check username and password.'
      } else if (dbError?.code === 'P1011') {
        errorMessage = 'TLS connection error. Check SSL configuration.'
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? {
            code: dbError?.code,
            message: dbError?.message,
            suggestion: 'Check if PostgreSQL is running and DATABASE_URL is correct'
          } : undefined
        },
        { status: 500 }
      )
    }

    // Test if the users table exists
    try {
      await prisma.user.findFirst({ take: 1 })
    } catch (tableError: any) {
      console.error('Users table access failed:', tableError)
      
      if (tableError?.code === 'P2021') {
        return NextResponse.json(
          { 
            error: 'Database schema not initialized',
            details: process.env.NODE_ENV === 'development' ? 'Run: npx prisma migrate dev' : undefined
          },
          { status: 500 }
        )
      }
      
      throw tableError // Re-throw if it's not a schema issue
    }

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
    
    // More specific error handling
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? {
          message: String(error),
          stack: error instanceof Error ? error.stack : undefined
        } : undefined 
      },
      { status: 500 }
    )
  }
}