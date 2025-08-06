import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { taskSchema, validateInput } from '@/lib/validations'
import { sendEmail, emailTemplates } from '@/lib/email'
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
    const status = searchParams.get('status')
    const assigneeId = searchParams.get('assigneeId')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({
      data: tasks,
    })

  } catch (error) {
    console.error('Get tasks error:', error)
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
    
    const validation = validateInput(taskSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      )
    }

    const taskData = validation.data

    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        assigneeId: taskData.assigneeId,
        category: taskData.category,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      },
      include: {
        assignee: true,
      },
    })

    // Send assignment email if assignee is provided and email service is configured
    if (task.assignee?.email && process.env.RESEND_API_KEY) {
      try {
        const assigneeName = task.assignee.firstName && task.assignee.lastName 
          ? `${task.assignee.firstName} ${task.assignee.lastName}`
          : task.assignee.email;
        
        const assignmentEmail = emailTemplates.taskAssigned(
          assigneeName,
          task.title,
          task.dueDate?.toLocaleDateString()
        )
        
        await sendEmail({
          to: task.assignee.email,
          ...assignmentEmail,
        })
      } catch (emailError) {
        console.warn('Failed to send task assignment email:', emailError)
        // Don't fail the task creation if email fails
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'task',
        resourceId: task.id,
        userId: payload.userId,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent'),
      },
    })

    return NextResponse.json({
      message: 'Task created successfully',
      data: task,
    })

  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}