import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

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

    // Get revenue data for the last 12 months
    const months = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const appointments = await prisma.appointment.findMany({
        where: {
          status: 'COMPLETED',
          startTime: {
            gte: date,
            lt: nextMonth,
          },
        },
        include: {
          service: true,
        },
      })

      const revenue = appointments.reduce((sum, apt) => {
        return sum + (apt.service?.price ? Number(apt.service.price) : 0)
      }, 0)

      months.push({
        name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue,
      })
    }

    return NextResponse.json({
      data: months,
    })

  } catch (error) {
    console.error('Get revenue data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}