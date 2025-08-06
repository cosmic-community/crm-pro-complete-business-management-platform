import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cosmicOperations } from '@/lib/cosmic'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    const payload = verifyToken(token!)
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only allow admins and managers to view all users
    if (payload.role !== 'admin' && payload.role !== 'manager') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const role = searchParams.get('role')

    try {
      let users = await cosmicOperations.getCosmicUsers({
        limit,
        skip: (page - 1) * limit
      })

      // Filter by role if specified
      if (role) {
        users = users.filter(user => 
          user.metadata.role?.key === role
        )
      }

      // Filter out inactive users
      users = users.filter(user => user.metadata.is_active)

      return NextResponse.json({
        data: users,
        pagination: {
          page,
          limit,
          total: users.length,
        },
      })

    } catch (error) {
      console.error('Error fetching users from Cosmic:', error)
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}