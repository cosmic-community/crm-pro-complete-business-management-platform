// app/api/services-products/[id]/route.ts
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

    return NextResponse.json({ serviceProduct: object })
  } catch (error) {
    console.error('Error fetching service/product:', error)
    return NextResponse.json({ error: 'Service/Product not found' }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const serviceProductData = {
      title: data.name,
      metadata: {
        name: data.name,
        type: data.type,
        category: data.category || '',
        description: data.description || '',
        price: data.price || 0,
        currency: data.currency || '',
        status: data.status,
        features: data.features || []
      }
    }

    const { object } = await cosmic.objects.updateOne(id, serviceProductData)
    return NextResponse.json({ serviceProduct: object })
  } catch (error) {
    console.error('Error updating service/product:', error)
    return NextResponse.json({ error: 'Failed to update service/product' }, { status: 500 })
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
    console.error('Error deleting service/product:', error)
    return NextResponse.json({ error: 'Failed to delete service/product' }, { status: 500 })
  }
}