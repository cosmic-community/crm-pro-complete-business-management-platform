import { Metadata } from 'next'
import ReportsList from '@/components/ReportsList'

export const metadata: Metadata = {
  title: 'Reports - CRM Pro',
  description: 'View and manage business reports',
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">View analytics and generated business reports</p>
        </div>
      </div>

      <ReportsList />
    </div>
  )
}