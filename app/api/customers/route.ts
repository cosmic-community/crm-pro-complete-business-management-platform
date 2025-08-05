import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { customerSchema, validateInput } from '@/lib/validations'
import { cookies } from 'next/headers'

// Force this route to use Node.js runtime instead of Edge Runtime
export const runtime = 'nodejs'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''

    const where: any = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (tag) {
      where.tags = { has: tag }
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.customer.count({ where })

    return NextResponse.json({
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get customers error:', error)
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
    
    const validation = validateInput(customerSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      )
    }

    const customerData = validation.data!

    // Check if customer already exists with this email
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: customerData.email },
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer already exists with this email' },
        { status: 409 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        dateOfBirth: customerData.dateOfBirth 
          ? new Date(customerData.dateOfBirth)
          : undefined,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'customer',
        resourceId: customer.id,
        userId: payload.userId,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent'),
      },
    })

    return NextResponse.json({
      message: 'Customer created successfully',
      data: customer,
    })

  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}