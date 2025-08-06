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
    const industry = searchParams.get('industry')
    const status = searchParams.get('status')

    try {
      let companies = await cosmicOperations.getCompanies({
        limit,
        skip: (page - 1) * limit
      })

      // Filter by industry if specified
      if (industry) {
        companies = companies.filter(company => 
          company.metadata.industry?.key === industry
        )
      }

      // Filter by account status if specified
      if (status) {
        companies = companies.filter(company => 
          company.metadata.account_status?.key === status
        )
      }

      return NextResponse.json({
        data: companies,
        pagination: {
          page,
          limit,
          total: companies.length,
        },
      })

    } catch (error) {
      console.error('Error fetching companies from Cosmic:', error)
      return NextResponse.json(
        { error: 'Failed to fetch companies' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Get companies error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}