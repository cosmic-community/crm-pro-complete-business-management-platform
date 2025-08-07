import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const { objects } = await cosmic.objects
      .find({ type: 'reports' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
      .skip(skip)

    return NextResponse.json({ reports: objects || [] })
  } catch (error) {
    if (error.status === 404) {
      return NextResponse.json({ reports: [] })
    }
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const reportData = {
      title: data.report_name,
      type: 'reports',
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

    const { object } = await cosmic.objects.insertOne(reportData)
    return NextResponse.json({ report: object })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}