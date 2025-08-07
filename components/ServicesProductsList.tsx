'use client'

import { useState, useEffect } from 'react'
import { Package, DollarSign, Tag, CheckCircle, XCircle } from 'lucide-react'
import Loading from './Loading'

interface ServiceProduct {
  id: string
  title: string
  slug: string
  metadata: {
    name: string
    type: {
      key: string
      value: string
    }
    category?: {
      key: string
      value: string
    }
    description?: string
    price?: number
    currency?: {
      key: string
      value: string
    }
    status: {
      key: string
      value: string
    }
    features?: string[]
    image?: {
      url: string
      imgix_url: string
    }
  }
}

export default function ServicesProductsList() {
  const [servicesProducts, setServicesProducts] = useState<ServiceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    fetchServicesProducts()
  }, [])

  const fetchServicesProducts = async () => {
    try {
      const response = await fetch('/api/services-products')
      if (!response.ok) {
        throw new Error('Failed to fetch services & products')
      }
      const data = await response.json()
      setServicesProducts(data.servicesProducts || [])
    } catch (error) {
      console.error('Error fetching services & products:', error)
      setError('Failed to load services & products')
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
      case 'discontinued':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type.toLowerCase() === 'service' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800'
  }

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency
    return `${symbol}${price.toLocaleString()}`
  }

  const filteredItems = servicesProducts.filter(item => {
    const categoryMatch = filter === 'all' || item.metadata.category?.key === filter
    const typeMatch = typeFilter === 'all' || item.metadata.type.key === typeFilter
    return categoryMatch && typeMatch
  })

  const categories = Array.from(new Set(servicesProducts.map(item => item.metadata.category?.key).filter(Boolean)))
  const types = Array.from(new Set(servicesProducts.map(item => item.metadata.type.key)))

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchServicesProducts}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                typeFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
                  typeFilter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {categories.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
                    filter === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services or products</h3>
          <p className="mt-1 text-sm text-gray-500">No items match your current filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              {item.metadata.image && (
                <img
                  src={`${item.metadata.image.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                  alt={item.metadata.name}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.metadata.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(item.metadata.status.value)}`}>
                  {item.metadata.status.value === 'active' ? (
                    <CheckCircle className="inline w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="inline w-3 h-3 mr-1" />
                  )}
                  {item.metadata.status.value}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.metadata.type.value)}`}>
                  {item.metadata.type.value}
                </span>
                {item.metadata.category && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    <Tag className="inline w-3 h-3 mr-1" />
                    {item.metadata.category.value}
                  </span>
                )}
              </div>

              {item.metadata.price && item.metadata.currency && (
                <div className="flex items-center mb-4">
                  <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-lg font-semibold text-green-600">
                    {formatPrice(item.metadata.price, item.metadata.currency.value)}
                  </span>
                  {item.metadata.type.value === 'Service' && (
                    <span className="text-sm text-gray-500 ml-1">/hour</span>
                  )}
                </div>
              )}

              {item.metadata.description && (
                <div 
                  className="text-sm text-gray-600 mb-4"
                  dangerouslySetInnerHTML={{ __html: item.metadata.description }}
                />
              )}

              {item.metadata.features && Array.isArray(item.metadata.features) && item.metadata.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item.metadata.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {item.metadata.features.length > 3 && (
                      <li className="text-xs text-gray-400">
                        +{item.metadata.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}