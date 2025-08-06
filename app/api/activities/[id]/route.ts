// app/api/activities/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cosmicOperations } from '@/lib/cosmic'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    try {
      const activity = await cosmicOperations.getActivity(id)

      if (!activity) {
        return NextResponse.json(
          { error: 'Activity not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        data: activity,
      })

    } catch (error) {
      console.error('Error fetching activity from Cosmic:', error)
      return NextResponse.json(
        { error: 'Failed to fetch activity' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Get activity error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}