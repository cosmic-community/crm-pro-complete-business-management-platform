'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import TaskBoard from '@/components/TaskBoard'
import Loading from '@/components/Loading'
import { Task, User } from '@/types'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/users')
      ])

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json()
        setTasks(tasksData.tasks || [])
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        )
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleCreateTask = async (task: Omit<Task, 'id'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks(prevTasks => [...prevTasks, newTask.task])
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your team's tasks and projects
          </p>
        </div>
        <Link href="/dashboard/tasks/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Link>
      </div>

      <TaskBoard 
        tasks={tasks}
        users={users}
        onUpdateTask={handleUpdateTask}
        onCreateTask={handleCreateTask}
      />
    </div>
  )
}