import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import CustomerList from '@/components/CustomerList'
import CustomerFilters from '@/components/CustomerFilters'
import Loading from '@/components/Loading'

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer database and relationships
          </p>
        </div>
        <Link href="/dashboard/customers/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Link>
      </div>

      <Suspense fallback={<Loading />}>
        <CustomerFilters />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <CustomerList />
      </Suspense>
    </div>
  )
}