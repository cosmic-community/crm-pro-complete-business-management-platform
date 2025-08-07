import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const { objects } = await cosmic.objects
      .find({ type: 'services-products' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
      .skip(skip)

    return NextResponse.json({ servicesProducts: objects || [] })
  } catch (error: any) {
    if (error.status === 404) {
      return NextResponse.json({ servicesProducts: [] })
    }
    console.error('Error fetching services & products:', error)
    return NextResponse.json({ error: 'Failed to fetch services & products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const serviceProductData = {
      title: data.name,
      type: 'services-products',
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

    const { object } = await cosmic.objects.insertOne(serviceProductData)
    return NextResponse.json({ serviceProduct: object })
  } catch (error) {
    console.error('Error creating service/product:', error)
    return NextResponse.json({ error: 'Failed to create service/product' }, { status: 500 })
  }
}