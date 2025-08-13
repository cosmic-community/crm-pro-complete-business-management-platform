'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, Mail, Video } from 'lucide-react'
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
      metadata?: {
        first_name?: string
        last_name?: string
        email?: string
        profile_photo?: {
          imgix_url?: string
        }
      }
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
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Messages</h2>
        <div className="flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Messages</h2>
        <div className="text-center text-gray-500">
          <p>Unable to load activities</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Mock messages data to match the design
  const recentMessages = [
    {
      id: '1',
      name: 'Alice Brown',
      time: '11:01',
      message: 'Can we try breathing exercises...',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b62413d0?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Emily Carter',
      time: '09:18',
      message: 'Yes, I\'ll add them.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Michael Lee',
      time: '09:18',
      message: 'Thank you for your help!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Messages</h2>
      
      <div className="space-y-4">
        {recentMessages.map((message) => (
          <div key={message.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <img 
              src={`${message.avatar}?w=80&h=80&fit=crop&crop=face`}
              alt={message.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900">{message.name}</h3>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My clients section */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My clients</h3>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">18</div>
            <div className="text-sm text-gray-600">sessions this week</div>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
              +{activities.length > 2 ? activities.length - 2 : 5}
            </div>
          </div>
        </div>
      </div>

      {/* Session Requests */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Requests</h3>
        <div className="space-y-3">
          {[
            { name: 'James Patel', time: 'Today, 15:00', type: 'Gestalt Therapy', status: 'approved' },
            { name: 'Hannah Collins', time: 'Tomorrow, 16:30', type: 'CBT', status: 'pending' },
            { name: 'Sara Kim', time: 'Fri, 10:00', type: 'ACT Session', status: 'declined' }
          ].map((request, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.name}</div>
                  <div className="text-xs text-gray-500">{request.time}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">{request.type}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}