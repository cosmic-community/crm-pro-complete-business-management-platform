'use client'

import { useState, useEffect } from 'react'
import { Calendar, Phone, Mail, Users, FileText, CheckCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { CosmicActivity } from '@/lib/cosmic'

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Users,
  demo: FileText,
  follow_up: CheckCircle,
}

const activityColors = {
  call: 'bg-green-100 text-green-600',
  email: 'bg-blue-100 text-blue-600',
  meeting: 'bg-purple-100 text-purple-600',
  demo: 'bg-orange-100 text-orange-600',
  follow_up: 'bg-gray-100 text-gray-600',
}

export default function ActivityTimeline() {
  const [activities, setActivities] = useState<CosmicActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      if (response.ok) {
        const result = await response.json()
        // Sort activities by date (most recent first)
        const sortedActivities = (result.data || []).sort((a: CosmicActivity, b: CosmicActivity) => 
          new Date(b.metadata.activity_date).getTime() - new Date(a.metadata.activity_date).getTime()
        )
        setActivities(sortedActivities)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredActivities = selectedType === 'all' 
    ? activities 
    : activities.filter(activity => activity.metadata.activity_type?.key === selectedType)

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Activity Type Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 text-sm rounded-full font-medium ${
              selectedType === 'all'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Activities ({activities.length})
          </button>
          {Object.entries(activityIcons).map(([type, Icon]) => {
            const count = activities.filter(activity => activity.metadata.activity_type?.key === type).length
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 text-sm rounded-full font-medium flex items-center ${
                  selectedType === type
                    ? activityColors[type as keyof typeof activityColors]
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="card">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500 mb-4">
              {activities.length === 0 
                ? "Start by logging your first activity" 
                : "No activities of this type"
              }
            </p>
            <button className="btn-primary">
              Log Activity
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const ActivityIcon = activityIcons[activity.metadata.activity_type?.key as keyof typeof activityIcons] || Calendar
              const iconColor = activityColors[activity.metadata.activity_type?.key as keyof typeof activityColors] || 'bg-gray-100 text-gray-600'
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                    <ActivityIcon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {activity.metadata.subject}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(parseISO(activity.metadata.activity_date), 'MMM d, yyyy')}
                          {activity.metadata.duration && (
                            <span className="ml-2">• {activity.metadata.duration} minutes</span>
                          )}
                        </div>
                      </div>
                      
                      {activity.metadata.outcome && (
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
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

                    {activity.metadata.description && (
                      <div 
                        className="mt-2 text-sm text-gray-600"
                        dangerouslySetInnerHTML={{ __html: activity.metadata.description }}
                      />
                    )}

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {activity.metadata.contact && (
                        <div>
                          <strong className="text-gray-700">Contact:</strong>
                          <div className="text-gray-600">
                            {activity.metadata.contact.metadata.first_name} {activity.metadata.contact.metadata.last_name}
                          </div>
                          {activity.metadata.contact.metadata.email && (
                            <div className="text-gray-500 text-xs">
                              {activity.metadata.contact.metadata.email}
                            </div>
                          )}
                        </div>
                      )}

                      {activity.metadata.company && (
                        <div>
                          <strong className="text-gray-700">Company:</strong>
                          <div className="text-gray-600">
                            {activity.metadata.company.metadata.company_name}
                          </div>
                        </div>
                      )}

                      {activity.metadata.assigned_to && (
                        <div>
                          <strong className="text-gray-700">Assigned to:</strong>
                          <div className="text-gray-600">
                            {activity.metadata.assigned_to.metadata.first_name} {activity.metadata.assigned_to.metadata.last_name}
                          </div>
                        </div>
                      )}

                      {activity.metadata.deal && (
                        <div>
                          <strong className="text-gray-700">Related Deal:</strong>
                          <div className="text-gray-600">
                            {activity.metadata.deal.metadata.deal_name}
                          </div>
                        </div>
                      )}
                    </div>

                    {activity.metadata.follow_up_required && activity.metadata.next_follow_up_date && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                        <div className="flex items-center text-yellow-800">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <strong>Follow-up required:</strong>
                          <span className="ml-2">
                            {format(parseISO(activity.metadata.next_follow_up_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}