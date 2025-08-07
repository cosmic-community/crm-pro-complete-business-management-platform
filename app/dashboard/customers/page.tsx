import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import CustomerList from '@/components/CustomerList'
import CustomerFilters from '@/components/CustomerFilters'
import Loading from '@/components/Loading'
import NewCustomerModal from '@/components/NewCustomerModal'

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
        <NewCustomerModal />
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