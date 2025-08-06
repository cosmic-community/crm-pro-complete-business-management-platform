'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Badge } from 'lucide-react'
import type { CosmicUser } from '@/lib/cosmic'

export default function UserProfile({ userId }: { userId?: string }) {
  const [user, setUser] = useState<CosmicUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchUser(userId)
    } else {
      fetchCurrentUser()
    }
  }, [userId])

  const fetchUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`)
      if (response.ok) {
        const result = await response.json()
        setUser(result.data)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const result = await response.json()
        // This would need to be adapted to work with your auth system
        // For now, we'll just fetch the first user from Cosmic
        const usersResponse = await fetch('/api/users')
        if (usersResponse.ok) {
          const usersResult = await usersResponse.json()
          if (usersResult.data && usersResult.data.length > 0) {
            setUser(usersResult.data[0])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-32">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'sales_manager':
        return 'bg-blue-100 text-blue-800'
      case 'sales_rep':
        return 'bg-green-100 text-green-800'
      case 'marketing':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card">
      <div className="flex items-start space-x-4">
        {user.metadata.profile_photo?.imgix_url ? (
          <img 
            src={`${user.metadata.profile_photo.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
            alt={`${user.metadata.first_name} ${user.metadata.last_name}`}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-gray-600" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.metadata.first_name} {user.metadata.last_name}
            </h2>
            <div className="flex items-center space-x-2">
              {user.metadata.role && (
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${getRoleColor(user.metadata.role.key)}`}>
                  {user.metadata.role.value}
                </span>
              )}
              {user.metadata.is_active && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-3" />
              <a 
                href={`mailto:${user.metadata.email}`}
                className="text-primary-600 hover:text-primary-700"
              >
                {user.metadata.email}
              </a>
            </div>

            {user.metadata.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-3" />
                <a 
                  href={`tel:${user.metadata.phone}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {user.metadata.phone}
                </a>
              </div>
            )}

            {user.metadata.department && (
              <div className="flex items-center text-gray-600">
                <Badge className="h-4 w-4 mr-3" />
                {user.metadata.department}
              </div>
            )}

            {user.metadata.territory && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-3" />
                {user.metadata.territory}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}