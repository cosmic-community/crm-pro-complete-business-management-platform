'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User } from 'lucide-react'
import Loading from './Loading'

interface Activity {
  id: string
  title: string
  metadata?: {
    activity_type?: {
      key: string
      value: string
    }
    activity_date?: string
    duration?: number
    contact?: {
      title: string
    }
    company?: {
      title: string
    }
    outcome?: {
      key: string
      value: string
    }
  }
}

export default function RecentAppointments() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities')
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }

        const data = await response.json()
        setActivities(data.activities || [])
      } catch (err) {
        console.error('Error fetching activities:', err)
        setError(err instanceof Error ? err.message : 'Failed to load activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
        <div className="flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
        <div className="text-center text-gray-500">
          <p>Unable to load activities</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Filter for appointment-type activities and sort by date
  const appointments = activities
    .filter(activity => 
      activity.metadata?.activity_type?.key === 'meeting' || 
      activity.metadata?.activity_type?.key === 'demo' ||
      activity.metadata?.activity_type?.key === 'call'
    )
    .sort((a, b) => {
      const dateA = new Date(a.metadata?.activity_date || 0)
      const dateB = new Date(b.metadata?.activity_date || 0)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return Calendar
      case 'demo':
        return User
      case 'call':
        return Clock
      default:
        return Calendar
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-600'
      case 'demo':
        return 'bg-purple-100 text-purple-600'
      case 'call':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>

      {appointments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p>No recent activities</p>
          <p className="text-sm mt-1">Activities will appear here when scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.metadata?.activity_type?.key || '')
            const activityDate = activity.metadata?.activity_date 
              ? new Date(activity.metadata.activity_date)
              : null

            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-full ${getActivityColor(activity.metadata?.activity_type?.key || '')}`}>
                  <ActivityIcon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {activity.metadata?.activity_type?.value || 'Activity'}
                    </span>
                    
                    {activity.metadata?.outcome && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.metadata.outcome.key === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : activity.metadata.outcome.key === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.metadata.outcome.value}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                    {activityDate && (
                      <span>
                        {activityDate.toLocaleDateString()}
                      </span>
                    )}
                    
                    {activity.metadata?.duration && (
                      <span>
                        {activity.metadata.duration} min
                      </span>
                    )}
                    
                    {activity.metadata?.contact?.title && (
                      <span>
                        with {activity.metadata.contact.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}