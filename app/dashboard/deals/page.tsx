import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, DollarSign, TrendingUp } from 'lucide-react'
import DealsOverview from '@/components/DealsOverview'
import Loading from '@/components/Loading'

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your sales pipeline and manage opportunities
          </p>
        </div>
        <div className="flex space-x-2">
          <Link 
            href="/dashboard/reports/sales" 
            className="btn-secondary flex items-center"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Sales Report
          </Link>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">$0</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">💼</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Close Rate</p>
              <p className="text-2xl font-bold text-gray-900">0%</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">📊</span>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <DealsOverview />
      </Suspense>
    </div>
  )
}