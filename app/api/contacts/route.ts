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

    // Create the contact object for Cosmic CMS
    const contactData = {
      title: `${body.first_name} ${body.last_name}`,
      type: 'contacts',
      status: 'published',
      metafields: [
        {
          title: 'First Name',
          key: 'first_name',
          type: 'text',
          required: true,
          id: 'a317888a-d776-431e-8256-1ef57df1477d',
          value: body.first_name
        },
        {
          title: 'Last Name',
          key: 'last_name',
          type: 'text',
          required: true,
          id: 'c0bbd89a-2edc-41bf-ad11-2611ffab8b0c',
          value: body.last_name
        },
        {
          title: 'Email',
          key: 'email',
          type: 'text',
          required: true,
          regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          regex_message: 'Please enter a valid email address',
          id: 'bd149674-abd8-4237-bf31-613cf0efbfc9',
          value: body.email
        },
        {
          title: 'Phone',
          key: 'phone',
          type: 'text',
          required: false,
          id: 'ca696c47-b6bb-46ce-94c4-17cfe5e934ca',
          value: body.phone || ''
        },
        {
          title: 'Job Title',
          key: 'job_title',
          type: 'text',
          required: false,
          id: '513be0ab-52ea-4e2e-a4ed-bf43af5bab75',
          value: body.job_title || ''
        },
        {
          title: 'Lead Source',
          key: 'lead_source',
          type: 'select-dropdown',
          required: false,
          options: [
            { key: 'website', value: 'Website' },
            { key: 'referral', value: 'Referral' },
            { key: 'cold_outreach', value: 'Cold Outreach' },
            { key: 'event', value: 'Event' },
            { key: 'social_media', value: 'Social Media' }
          ],
          id: '70a03e90-14bd-41bc-8228-ef17456ad03c',
          value: body.lead_source || 'website'
        },
        {
          title: 'Status',
          key: 'status',
          type: 'select-dropdown',
          required: true,
          options: [
            { key: 'lead', value: 'Lead' },
            { key: 'prospect', value: 'Prospect' },
            { key: 'customer', value: 'Customer' },
            { key: 'lost', value: 'Lost' }
          ],
          id: 'db3002d1-9cea-46fc-8632-224a6763cc31',
          value: body.status
        },
        {
          title: 'Notes',
          key: 'notes',
          type: 'html-textarea',
          required: false,
          id: 'd2a95304-3d13-4da5-a058-ca1f8b5d6d9a',
          value: body.notes ? `<p>${body.notes}</p>` : ''
        },
        {
          title: 'Tags',
          key: 'tags',
          type: 'text',
          required: false,
          helptext: 'Comma-separated tags',
          id: '7125891a-86f9-477b-bb24-498214d7bf7c',
          value: body.tags || ''
        }
      ]
    }

    // Create the contact in Cosmic CMS
    const { object } = await cosmic.objects.insertOne(contactData)
    
    return NextResponse.json({
      success: true,
      message: 'Contact created successfully',
      data: object
    })
  } catch (error) {
    console.error('Failed to create contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}