import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { cosmic } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch dashboard data from Cosmic CMS
    try {
      const [contactsResult, tasksResult, activitiesResult, dealsResult] = await Promise.allSettled([
        cosmic.objects.find({ type: 'contacts' }).props(['id', 'title']).limit(100),
        cosmic.objects.find({ type: 'tasks' }).props(['id', 'title', 'metadata']).limit(100),
        cosmic.objects.find({ type: 'activities' }).props(['id', 'title']).limit(100),
        cosmic.objects.find({ type: 'deals' }).props(['id', 'title', 'metadata']).limit(100)
      ])

      // Extract data with fallbacks
      const contacts = contactsResult.status === 'fulfilled' ? contactsResult.value.objects : []
      const tasks = tasksResult.status === 'fulfilled' ? tasksResult.value.objects : []
      const activities = activitiesResult.status === 'fulfilled' ? activitiesResult.value.objects : []
      const deals = dealsResult.status === 'fulfilled' ? dealsResult.value.objects : []

      // Calculate stats
      const totalCustomers = contacts?.length || 0
      const totalTasks = tasks?.filter(task => 
        task.metadata?.status?.key !== 'completed' && task.metadata?.status?.key !== 'cancelled'
      ).length || 0
      const totalAppointments = activities?.filter(activity => 
        activity.metadata?.activity_type?.key === 'meeting' || activity.metadata?.activity_type?.key === 'demo'
      ).length || 0
      
      // Calculate revenue from deals
      const revenue = deals?.reduce((sum, deal) => {
        const dealValue = deal.metadata?.deal_value || 0
        const stage = deal.metadata?.stage?.key
        if (stage === 'closed_won') {
          return sum + dealValue
        }
        return sum
      }, 0) || 0

      const dashboardData = {
        user,
        stats: {
          totalCustomers,
          totalTasks,
          totalAppointments,
          revenue
        }
      }

      return NextResponse.json(dashboardData)
    } catch (cosmicError) {
      console.error('Cosmic CMS error:', cosmicError)
      
      // Return fallback data if Cosmic fails
      const fallbackData = {
        user,
        stats: {
          totalCustomers: 0,
          totalTasks: 0,
          totalAppointments: 0,
          revenue: 0
        }
      }

      return NextResponse.json(fallbackData)
    }
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}