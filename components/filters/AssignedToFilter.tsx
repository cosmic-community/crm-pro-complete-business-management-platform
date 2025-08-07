'use client'

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'

interface User {
  id: string
  title: string
  metadata: {
    first_name: string
    last_name: string
    profile_photo?: {
      imgix_url: string
    }
  }
}

interface AssignedToFilterProps {
  selected: string[]
  onChange: (selected: string[]) => void
  multiSelect?: boolean
  label?: string
}

export default function AssignedToFilter({ 
  selected, 
  onChange, 
  multiSelect = true,
  label = 'Assigned To'
}: AssignedToFilterProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const result = await response.json()
        setUsers(result.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = (userId: string) => {
    if (multiSelect) {
      if (selected.includes(userId)) {
        onChange(selected.filter(s => s !== userId))
      } else {
        onChange([...selected, userId])
      }
    } else {
      onChange(selected.includes(userId) ? [] : [userId])
    }
  }

  const handleSelectAll = () => {
    if (selected.length === filteredUsers.length) {
      onChange([])
    } else {
      onChange(filteredUsers.map(user => user.id))
    }
  }

  const filteredUsers = users.filter(user => {
    const fullName = `${user.metadata.first_name} ${user.metadata.last_name}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {multiSelect && filteredUsers.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            {selected.length === filteredUsers.length ? 'Clear All' : 'Select All'}
          </button>
        )}
      </div>

      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {/* Unassigned option */}
        <button
          onClick={() => onChange(selected.includes('unassigned') ? selected.filter(s => s !== 'unassigned') : [...selected, 'unassigned'])}
          className={`w-full text-left p-3 rounded-lg transition-colors ${
            selected.includes('unassigned') 
              ? 'bg-primary-50 border border-primary-200' 
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar size="sm" />
              <span className="text-sm font-medium text-gray-700">Unassigned</span>
              {multiSelect && (
                <input
                  type="checkbox"
                  checked={selected.includes('unassigned')}
                  onChange={() => {}} // Handled by button click
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              )}
            </div>
          </div>
        </button>

        {/* User options */}
        {filteredUsers.map((user) => {
          const isSelected = selected.includes(user.id)
          const avatarSrc = user.metadata.profile_photo?.imgix_url
            ? `${user.metadata.profile_photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`
            : undefined

          return (
            <button
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                isSelected 
                  ? 'bg-primary-50 border border-primary-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    size="sm" 
                    src={avatarSrc}
                    fallback={`${user.metadata.first_name[0]}${user.metadata.last_name[0]}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {user.metadata.first_name} {user.metadata.last_name}
                    </p>
                  </div>
                  {multiSelect && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by button click
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                  )}
                </div>
              </div>
            </button>
          )
        })}

        {filteredUsers.length === 0 && searchTerm && (
          <div className="text-center py-4 text-gray-500">
            <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No users found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {selected.length} selected
          </p>
        </div>
      )}
    </div>
  )
}