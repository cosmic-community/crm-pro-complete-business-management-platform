// app/api/reports/[id]/route.ts
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

    return NextResponse.json({ report: object })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const reportData = {
      title: data.report_name,
      metadata: {
        report_name: data.report_name,
        report_type: data.report_type,
        period: data.period,
        date_range: data.date_range || {},
        metrics: data.metrics || {},
        summary: data.summary || '',
        status: data.status
      }
    }

    const { object } = await cosmic.objects.updateOne(id, reportData)
    return NextResponse.json({ report: object })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
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
    console.error('Error deleting report:', error)
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 })
  }
}