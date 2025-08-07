import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const { objects } = await cosmic.objects
      .find({ type: 'settings' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
      .skip(skip)

    return NextResponse.json({ settings: objects || [] })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return NextResponse.json({ settings: [] })
    }
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const settingData = {
      title: data.setting_name,
      type: 'settings',
      metadata: {
        setting_name: data.setting_name,
        category: data.category,
        setting_type: data.setting_type,
        value: data.value,
        default_value: data.default_value,
        description: data.description || '',
        is_active: data.is_active || false
      }
    }

    const { object } = await cosmic.objects.insertOne(settingData)
    return NextResponse.json({ setting: object })
  } catch (error: unknown) {
    console.error('Error creating setting:', error)
    return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 })
  }
}