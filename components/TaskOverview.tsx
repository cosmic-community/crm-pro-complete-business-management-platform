'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Clock, AlertTriangle } from 'lucide-react'
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h2>
        <div className="flex justify-center">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h2>
        <div className="text-center text-gray-500">
          <p>Unable to load tasks</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Filter tasks by status
  const activeTasks = tasks.filter(task => 
    task.metadata?.status?.key === 'open' || task.metadata?.status?.key === 'in_progress'
  )

  const highPriorityTasks = activeTasks.filter(task => 
    task.metadata?.priority?.key === 'high'
  )

  const overdueTasks = activeTasks.filter(task => {
    if (!task.metadata?.due_date) return false
    const dueDate = new Date(task.metadata.due_date)
    return dueDate < new Date()
  })

  const taskStats = [
    {
      title: 'Active Tasks',
      value: activeTasks.length,
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'High Priority',
      value: highPriorityTasks.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Overdue',
      value: overdueTasks.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const recentTasks = activeTasks.slice(0, 5)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h2>
      
      {/* Task Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {taskStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Tasks</h3>
        {recentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active tasks</p>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.metadata?.priority?.key === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.metadata?.priority?.key === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {task.metadata?.priority?.value || 'Low'}
                    </span>
                    {task.metadata?.assigned_to?.title && (
                      <span className="text-xs text-gray-500">
                        Assigned to {task.metadata.assigned_to.title}
                      </span>
                    )}
                  </div>
                </div>
                {task.metadata?.due_date && (
                  <div className="text-xs text-gray-500">
                    Due: {new Date(task.metadata.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}