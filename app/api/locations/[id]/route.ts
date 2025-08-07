// app/api/locations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { object } = await cosmic.objects
      .findOne({ id })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return NextResponse.json({ location: object })
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json({ error: 'Location not found' }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const locationData = {
      title: data.location_name,
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

    const { object } = await cosmic.objects.updateOne(id, locationData)
    return NextResponse.json({ location: object })
  } catch (error) {
    console.error('Error updating location:', error)
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await cosmic.objects.deleteOne(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting location:', error)
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}