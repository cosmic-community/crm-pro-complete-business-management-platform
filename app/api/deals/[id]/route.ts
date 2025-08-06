// app/api/deals/[id]/route.ts
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
      const deal = await cosmicOperations.getDeal(id)

      if (!deal) {
        return NextResponse.json(
          { error: 'Deal not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        data: deal,
      })

    } catch (error) {
      console.error('Error fetching deal from Cosmic:', error)
      return NextResponse.json(
        { error: 'Failed to fetch deal' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Get deal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}