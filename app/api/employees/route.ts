import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const { objects } = await cosmic.objects
      .find({ type: 'employees' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
      .skip(skip)

    return NextResponse.json({ employees: objects || [] })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return NextResponse.json({ employees: [] })
    }
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const employeeData = {
      title: `${data.first_name} ${data.last_name}`,
      type: 'employees',
      metadata: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        job_title: data.job_title,
        department: data.department,
        employment_status: data.employment_status,
        start_date: data.start_date || '',
        emergency_contact: data.emergency_contact || {}
      }
    }

    const { object } = await cosmic.objects.insertOne(employeeData)
    return NextResponse.json({ employee: object })
  } catch (error: unknown) {
    console.error('Error creating employee:', error)
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 })
  }
}