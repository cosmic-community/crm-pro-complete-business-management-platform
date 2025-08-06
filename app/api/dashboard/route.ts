import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user details from database
    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!userDetails) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get dashboard stats based on user role
    let stats = {
      totalCustomers: 0,
      totalTasks: 0,
      totalAppointments: 0,
      revenue: 0,
    }

    if (user.role === 'admin' || user.role === 'manager') {
      // Admin and managers can see all data
      const [customers, tasks, appointments] = await Promise.all([
        prisma.customer.count(),
        prisma.task.count(),
        prisma.appointment.count(),
      ])

      stats = {
        totalCustomers: customers,
        totalTasks: tasks,
        totalAppointments: appointments,
        revenue: 0, // You can calculate this based on your business logic
      }
    } else {
      // Staff can only see their own data
      const [tasks, appointments] = await Promise.all([
        prisma.task.count({
          where: { assignedToId: user.id },
        }),
        prisma.appointment.count({
          where: { assignedToId: user.id },
        }),
      ])

      stats = {
        totalCustomers: 0,
        totalTasks: tasks,
        totalAppointments: appointments,
        revenue: 0,
      }
    }

    return NextResponse.json({
      user: userDetails,
      stats,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}