import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clearAuthCookie, verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

// Helper function to extract IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        // Create audit log
        await prisma.auditLog.create({
          data: {
            action: 'LOGOUT',
            resource: 'user',
            resourceId: payload.userId,
            userId: payload.userId,
            ipAddress: getClientIP(request),
            userAgent: request.headers.get('user-agent'),
          },
        })
      }
    }

    // Clear cookie and return success
    const response = NextResponse.json({
      message: 'Logout successful',
    })

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