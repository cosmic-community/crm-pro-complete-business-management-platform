'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users } from 'lucide-react'
import Loading from './Loading'

interface Task {
  id: string
  title: string
  metadata?: {
    priority?: {
      key: string
      value: string
    }
    status?: {
      key: string
      value: string
    }
    due_date?: string
    assigned_to?: {
      title: string
    }
  }
}

export default function TaskOverview() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }

        const data = await response.json()
        setTasks(data.tasks || [])
      } catch (err) {
        console.error('Error fetching tasks:', err)
        setError(err instanceof Error ? err.message : 'Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My agenda</h2>
        <div className="flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My agenda</h2>
        <div className="text-center text-gray-500">
          <p>Unable to load agenda</p>
        </div>
      </div>
    )
  }

  // Mock calendar data
  const currentDate = new Date()
  const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const currentDay = currentDate.getDate()

  const calendarDays = Array.from({length: 7}, (_, i) => {
    const day = currentDay - 3 + i
    const isToday = day === currentDay
    return { day: day > 0 ? day : '', isToday }
  })

  // Mock appointments
  const appointments = [
    {
      id: '1',
      title: 'Calm & Focus Group',
      time: '12:30-13:30',
      avatars: ['https://images.unsplash.com/photo-1494790108755-2616b62413d0?w=40&h=40&fit=crop&crop=face'],
      color: 'bg-blue-50 text-blue-700'
    },
    {
      id: '2',
      title: '1:1 with T. Morgan',
      time: '14:30-15:15',
      avatars: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'],
      color: 'bg-gray-50 text-gray-700'
    },
    {
      id: '3',
      title: '1:1 with S. Green',
      time: '16:30-17:00',
      avatars: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'],
      color: 'bg-gray-50 text-gray-700'
    },
    {
      id: '4',
      title: '1:1 with M. Carter',
      time: '18:00-19:00',
      avatars: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'],
      color: 'bg-gray-50 text-gray-700'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My agenda</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all</button>
      </div>

      {/* Mini Calendar */}
      <div className="mb-8">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => (
            <div 
              key={index} 
              className={`text-center py-2 text-sm rounded-lg ${
                date.isToday 
                  ? 'bg-gray-900 text-white font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {date.day}
            </div>
          ))}
        </div>
      </div>

      {/* Appointments */}
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div key={appointment.id} className={`${appointment.color} p-4 rounded-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">{appointment.title}</div>
                  <div className="text-xs opacity-75">{appointment.time}</div>
                </div>
              </div>
              <div className="flex -space-x-1">
                {appointment.avatars.map((avatar, index) => (
                  <img 
                    key={index}
                    src={`${avatar}&w=32&h=32&fit=crop&crop=face`}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 py-2">
          All upcoming events
        </button>
      </div>
    </div>
  )
}