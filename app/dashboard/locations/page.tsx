import { Metadata } from 'next'
import LocationList from '@/components/LocationList'

export const metadata: Metadata = {
  title: 'Locations - CRM Pro',
  description: 'Manage your business locations',
}

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600 mt-1">Manage your business locations and offices</p>
        </div>
      </div>

      <LocationList />
    </div>
  )
}