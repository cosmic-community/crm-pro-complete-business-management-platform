import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const { objects } = await cosmic.objects
      .find({ type: 'locations' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
      .skip(skip)

    return NextResponse.json({ locations: objects || [] })
  } catch (error: any) {
    if (error.status === 404) {
      return NextResponse.json({ locations: [] })
    }
    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const locationData = {
      title: data.location_name,
      type: 'locations',
      metadata: {
        location_name: data.location_name,
        address: data.address,
        phone: data.phone || '',
        email: data.email || '',
        status: data.status,
        opening_hours: data.opening_hours || {},
        description: data.description || ''
      }
    }

    const { object } = await cosmic.objects.insertOne(locationData)
    return NextResponse.json({ location: object })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}