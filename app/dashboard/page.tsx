'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardStats from '@/components/DashboardStats'
import RecentAppointments from '@/components/RecentAppointments'
import TaskOverview from '@/components/TaskOverview'
import Loading from '@/components/Loading'
import type { AuthUser } from '@/types'

interface DashboardData {
  user: AuthUser
  stats: {
    totalCustomers: number
    totalTasks: number
    totalAppointments: number
    revenue: number
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const dashboardData = await response.json()
        
        if (!dashboardData.user || !dashboardData.stats) {
          throw new Error('Invalid dashboard data structure')
        }
        
        setData(dashboardData)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(errorMessage)
        
        if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/login')}
                className="block w-full text-red-600 hover:text-red-800 text-sm"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-4">Unable to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {data.user.firstName ? `${data.user.firstName}` : 'User'}!
            </h1>
            <p className="text-gray-600">
              Easily manage your upcoming sessions and track client progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {data.user.firstName ? data.user.firstName[0] : 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {data.user.firstName ? `${data.user.firstName} ${data.user.lastName}` : data.user.email}
              </p>
              <p className="text-sm text-gray-500 capitalize">{data.user.role}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={data.stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentAppointments />
        </div>
        <div className="space-y-6">
          <TaskOverview />
        </div>
      </div>
    </div>
  )
}