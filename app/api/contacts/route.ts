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
    const status = searchParams.get('status')

    try {
      let contacts = await cosmicOperations.getContacts({
        limit,
        skip: (page - 1) * limit
      })

      // Filter by status if specified
      if (status) {
        contacts = contacts.filter(contact => 
          contact.metadata.status?.key === status
        )
      }

      return NextResponse.json({
        data: contacts,
        pagination: {
          page,
          limit,
          total: contacts.length,
        },
      })

    } catch (error) {
      console.error('Error fetching contacts from Cosmic:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}