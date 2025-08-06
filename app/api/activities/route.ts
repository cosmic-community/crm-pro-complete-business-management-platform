import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cosmicOperations } from '@/lib/cosmic'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')

    try {
      let activities = await cosmicOperations.getActivities({
        limit,
        skip: (page - 1) * limit
      })

      // Filter by activity type if specified
      if (type) {
        activities = activities.filter(activity => 
          activity.metadata.activity_type?.key === type
        )
      }

      return NextResponse.json({
        data: activities,
        pagination: {
          page,
          limit,
          total: activities.length,
        },
      })

    } catch (error) {
      console.error('Error fetching activities from Cosmic:', error)
      return NextResponse.json(
        { error: 'Failed to fetch activities' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Get activities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}