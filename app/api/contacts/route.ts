import { NextRequest, NextResponse } from 'next/server'
import { cosmicOperations } from '@/lib/cosmic'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')
    
    const contacts = await cosmicOperations.getContacts({ limit, skip })
    
    return NextResponse.json({
      success: true,
      data: contacts
    })
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email, and status are required' },
        { status: 400 }
      )
    }

    // Create the contact object for Cosmic CMS with proper metadata structure
    const contactData = {
      title: `${body.first_name} ${body.last_name}`,
      type: 'contacts',
      status: 'published',
      metadata: {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone || '',
        job_title: body.job_title || '',
        lead_source: body.lead_source || 'website',
        status: body.status,
        notes: body.notes ? `<p>${body.notes}</p>` : '',
        tags: body.tags || ''
      }
    }

    // Create the contact in Cosmic CMS
    const { object } = await cosmic.objects.insertOne(contactData)
    
    return NextResponse.json({
      success: true,
      message: 'Contact created successfully',
      data: object
    })
  } catch (error: any) {
    console.error('Failed to create contact:', error)
    
    // Provide more specific error messages
    if (error.message?.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid data provided. Please check all required fields.' },
        { status: 400 }
      )
    }
    
    if (error.message?.includes('duplicate')) {
      return NextResponse.json(
        { error: 'A contact with this email already exists.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create contact. Please try again.' },
      { status: 500 }
    )
  }
}