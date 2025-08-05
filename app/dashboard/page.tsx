import { Suspense } from 'react'
import DashboardStats from '@/components/DashboardStats'
import RecentAppointments from '@/components/RecentAppointments'
import TaskOverview from '@/components/TaskOverview'
import RevenueChart from '@/components/RevenueChart'
import Loading from '@/components/Loading'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      <Suspense fallback={<Loading />}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Loading />}>
          <RevenueChart />
        </Suspense>
        
        <Suspense fallback={<Loading />}>
          <TaskOverview />
        </Suspense>
      </div>

      <Suspense fallback={<Loading />}>
        <RecentAppointments />
      </Suspense>
    </div>
  )
}