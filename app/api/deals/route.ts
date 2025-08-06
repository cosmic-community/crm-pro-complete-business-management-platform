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
    const stage = searchParams.get('stage')

    try {
      let deals = await cosmicOperations.getDeals({
        limit,
        skip: (page - 1) * limit
      })

      // Filter by stage if specified
      if (stage) {
        deals = deals.filter(deal => deal.metadata.stage?.key === stage)
      }

      return NextResponse.json({
        data: deals,
        pagination: {
          page,
          limit,
          total: deals.length, // Note: Cosmic doesn't provide total count directly
        },
      })

    } catch (error) {
      console.error('Error fetching deals from Cosmic:', error)
      return NextResponse.json(
        { error: 'Failed to fetch deals' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Get deals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}