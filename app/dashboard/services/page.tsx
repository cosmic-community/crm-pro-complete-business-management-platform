import { Metadata } from 'next'
import ServicesProductsList from '@/components/ServicesProductsList'

export const metadata: Metadata = {
  title: 'Services & Products - CRM Pro',
  description: 'Manage your services and products',
}

export default function ServicesProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services & Products</h1>
          <p className="text-gray-600 mt-1">Manage your service offerings and product catalog</p>
        </div>
      </div>

      <ServicesProductsList />
    </div>
  )
}