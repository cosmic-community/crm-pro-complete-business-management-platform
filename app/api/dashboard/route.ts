import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { cosmic } from '@/lib/cosmic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get stats from Cosmic CMS
    const [contacts, deals, tasks, activities] = await Promise.allSettled([
      cosmic.objects.find({ type: 'contacts' }).props(['id']),
      cosmic.objects.find({ type: 'deals' }).props(['id', 'metadata']),
      cosmic.objects.find({ type: 'tasks' }).props(['id']),
      cosmic.objects.find({ type: 'activities' }).props(['id'])
    ])

    // Calculate stats with fallback values
    const totalCustomers = contacts.status === 'fulfilled' ? (contacts.value?.objects?.length || 0) : 0
    const totalTasks = tasks.status === 'fulfilled' ? (tasks.value?.objects?.length || 0) : 0
    const totalAppointments = activities.status === 'fulfilled' ? (activities.value?.objects?.length || 0) : 0
    
    // Calculate revenue from deals
    let revenue = 0
    if (deals.status === 'fulfilled' && deals.value?.objects) {
      revenue = deals.value.objects.reduce((total: number, deal: any) => {
        const dealValue = deal.metadata?.deal_value || 0
        return total + (typeof dealValue === 'number' ? dealValue : 0)
      }, 0)
    }

    const stats = {
      totalCustomers,
      totalTasks,
      totalAppointments,
      revenue
    }

    return NextResponse.json({
      user,
      stats
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}