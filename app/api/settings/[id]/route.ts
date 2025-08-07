// app/api/settings/[id]/route.ts
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

    return NextResponse.json({ setting: object })
  } catch (error) {
    console.error('Error fetching setting:', error)
    return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const settingData = {
      title: data.setting_name,
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

    const { object } = await cosmic.objects.updateOne(id, settingData)
    return NextResponse.json({ setting: object })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
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
    console.error('Error deleting setting:', error)
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 })
  }
}