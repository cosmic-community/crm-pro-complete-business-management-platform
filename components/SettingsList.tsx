'use client'

import { useState, useEffect } from 'react'
import { Settings, ToggleLeft, ToggleRight, User, Save } from 'lucide-react'
import Loading from './Loading'

interface Setting {
  id: string
  title: string
  slug: string
  metadata: {
    setting_name: string
    category: {
      key: string
      value: string
    }
    setting_type: {
      key: string
      value: string
    }
    value: any
    default_value: any
    description?: string
    is_active: boolean
    last_modified_by?: {
      id: string
      title: string
      metadata: {
        first_name: string
        last_name: string
        job_title: string
      }
    }
  }
}

export default function SettingsList() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [editingValues, setEditingValues] = useState<Record<string, any>>({})
  const [savingSettings, setSavingSettings] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      setSettings(data.settings || [])
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (id: string, newValue: any) => {
    setSavingSettings(prev => new Set(prev).add(id))
    try {
      const setting = settings.find(s => s.id === id)
      if (!setting) return

      const response = await fetch(`/api/settings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...setting.metadata,
          value: newValue
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update setting')
      }

      const { setting: updatedSetting } = await response.json()
      
      setSettings(prev => prev.map(s => s.id === id ? updatedSetting : s))
      setEditingValues(prev => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })
    } catch (error) {
      console.error('Error updating setting:', error)
    } finally {
      setSavingSettings(prev => {
        const updated = new Set(prev)
        updated.delete(id)
        return updated
      })
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'general': 'bg-blue-100 text-blue-800',
      'security': 'bg-red-100 text-red-800',
      'notifications': 'bg-yellow-100 text-yellow-800',
      'integrations': 'bg-purple-100 text-purple-800',
      'appearance': 'bg-green-100 text-green-800'
    }
    return colors[category.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const renderSettingInput = (setting: Setting) => {
    const currentValue = editingValues[setting.id] !== undefined 
      ? editingValues[setting.id] 
      : setting.metadata.value

    const isSaving = savingSettings.has(setting.id)

    switch (setting.metadata.setting_type.key) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <button
              onClick={() => updateSetting(setting.id, !currentValue)}
              disabled={isSaving}
              className="flex items-center"
            >
              {currentValue ? (
                <ToggleRight className="h-6 w-6 text-green-500" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-400" />
              )}
              <span className="ml-2 text-sm">
                {currentValue ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          </div>
        )

      case 'text':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentValue || ''}
              onChange={(e) => setEditingValues(prev => ({
                ...prev,
                [setting.id]: e.target.value
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isSaving}
            />
            {editingValues[setting.id] !== undefined && (
              <button
                onClick={() => updateSetting(setting.id, editingValues[setting.id])}
                disabled={isSaving}
                className="px-3 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 disabled:opacity-50 flex items-center"
              >
                <Save className="h-4 w-4" />
              </button>
            )}
          </div>
        )

      case 'number':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={currentValue || ''}
              onChange={(e) => setEditingValues(prev => ({
                ...prev,
                [setting.id]: parseFloat(e.target.value) || 0
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isSaving}
            />
            {editingValues[setting.id] !== undefined && (
              <button
                onClick={() => updateSetting(setting.id, editingValues[setting.id])}
                disabled={isSaving}
                className="px-3 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 disabled:opacity-50 flex items-center"
              >
                <Save className="h-4 w-4" />
              </button>
            )}
          </div>
        )

      case 'dropdown':
        return (
          <div className="text-sm text-gray-600">
            Current: <span className="font-medium">{currentValue}</span>
          </div>
        )

      default:
        return (
          <div className="text-sm text-gray-500">
            {typeof currentValue === 'object' ? JSON.stringify(currentValue) : String(currentValue)}
          </div>
        )
    }
  }

  const filteredSettings = settings.filter(setting => {
    if (filter === 'all') return true
    return setting.metadata.category.key === filter
  })

  const categories = [...new Set(settings.map(setting => setting.metadata.category.key))]

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchSettings}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-6">
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

      {filteredSettings.length === 0 ? (
        <div className="text-center py-8">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' ? 'No settings have been configured yet.' : `No ${filter} settings available.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSettings.map((setting) => (
            <div key={setting.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{setting.metadata.setting_name}</h3>
                  {setting.metadata.description && (
                    <p className="text-sm text-gray-600 mt-1">{setting.metadata.description}</p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(setting.metadata.category.value)}`}>
                  {setting.metadata.category.value}
                </span>
              </div>

              <div className="mb-4">
                {renderSettingInput(setting)}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-200">
                <span>Type: {setting.metadata.setting_type.value}</span>
                {setting.metadata.last_modified_by && (
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Last modified by {setting.metadata.last_modified_by.metadata.first_name} {setting.metadata.last_modified_by.metadata.last_name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}