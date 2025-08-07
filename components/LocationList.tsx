'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Loading from './Loading'

interface Location {
  id: string
  title: string
  slug: string
  metadata: {
    location_name: string
    address: {
      street: string
      city: string
      state: string
      zip: string
      country?: string
    }
    phone?: string
    email?: string
    status: {
      key: string
      value: string
    }
    opening_hours?: {
      [key: string]: string
    }
    description?: string
    location_photo?: {
      url: string
      imgix_url: string
    }
  }
}

export default function LocationList() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      if (!response.ok) {
        throw new Error('Failed to fetch locations')
      }
      const data = await response.json()
      setLocations(data.locations || [])
    } catch (error) {
      console.error('Error fetching locations:', error)
      setError('Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'under construction':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchLocations}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No locations</h3>
        <p className="mt-1 text-sm text-gray-500">No locations have been added yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <div key={location.id} className="bg-white rounded-lg shadow-md p-6">
          {location.metadata.location_photo && (
            <img
              src={`${location.metadata.location_photo.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
              alt={location.metadata.location_name}
              className="w-full h-32 object-cover rounded-md mb-4"
            />
          )}
          
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {location.metadata.location_name}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(location.metadata.status.value)}`}>
              {location.metadata.status.value}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                {location.metadata.address.street}<br />
                {location.metadata.address.city}, {location.metadata.address.state} {location.metadata.address.zip}
              </div>
            </div>

            {location.metadata.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href={`tel:${location.metadata.phone}`} className="hover:text-primary-600">
                  {location.metadata.phone}
                </a>
              </div>
            )}

            {location.metadata.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href={`mailto:${location.metadata.email}`} className="hover:text-primary-600">
                  {location.metadata.email}
                </a>
              </div>
            )}
          </div>

          {location.metadata.opening_hours && (
            <div className="mb-4">
              <div className="flex items-center text-sm font-medium text-gray-900 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                Hours
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {Object.entries(location.metadata.opening_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}:</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {location.metadata.description && (
            <p className="text-sm text-gray-600">
              {location.metadata.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}