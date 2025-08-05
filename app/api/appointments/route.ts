import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { appointmentSchema, validateInput } from '@/lib/validations'
import { sendEmail, emailTemplates } from '@/lib/email'
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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: true,
        employee: true,
        service: true,
        location: true,
      },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json({
      data: appointments,
    })

  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    
    const validation = validateInput(appointmentSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      )
    }

    const appointmentData = validation.data!

    // Check for scheduling conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        employeeId: appointmentData.employeeId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            startTime: {
              lt: new Date(appointmentData.endTime),
            },
            endTime: {
              gt: new Date(appointmentData.startTime),
            },
          },
        ],
      },
    })

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Employee has a conflicting appointment at this time' },
        { status: 409 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        ...appointmentData,
        startTime: new Date(appointmentData.startTime),
        endTime: new Date(appointmentData.endTime),
      },
      include: {
        customer: true,
        employee: true,
        service: true,
      },
    })

    // Send confirmation email to customer
    if (appointment.customer.email) {
      const confirmationEmail = emailTemplates.appointmentReminder(
        `${appointment.customer.firstName} ${appointment.customer.lastName}`,
        appointment.title,
        appointment.startTime.toLocaleDateString()
      )
      
      await sendEmail({
        to: appointment.customer.email,
        ...confirmationEmail,
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'appointment',
        resourceId: appointment.id,
        userId: payload.userId,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent'),
      },
    })

    return NextResponse.json({
      message: 'Appointment created successfully',
      data: appointment,
    })

  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}