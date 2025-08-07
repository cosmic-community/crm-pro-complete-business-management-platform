'use client'

import { Badge } from '@/components/ui/Badge'

interface StatusOption {
  key: string
  label: string
  count?: number
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

interface StatusFilterProps {
  options: StatusOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  multiSelect?: boolean
  label?: string
}

const colorMap = {
  default: 'default',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info'
} as const

export default function StatusFilter({ 
  options, 
  selected, 
  onChange, 
  multiSelect = true,
  label = 'Status'
}: StatusFilterProps) {
  
  const handleStatusClick = (statusKey: string) => {
    if (multiSelect) {
      if (selected.includes(statusKey)) {
        onChange(selected.filter(s => s !== statusKey))
      } else {
        onChange([...selected, statusKey])
      }
    } else {
      onChange(selected.includes(statusKey) ? [] : [statusKey])
    }
  }

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([])
    } else {
      onChange(options.map(option => option.key))
    }
  }

  const totalCount = options.reduce((sum, option) => sum + (option.count || 0), 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {multiSelect && (
          <button
            onClick={handleSelectAll}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            {selected.length === options.length ? 'Clear All' : 'Select All'}
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {/* All option */}
        <button
          onClick={() => onChange([])}
          className={`w-full text-left p-2 rounded-lg transition-colors ${
            selected.length === 0 
              ? 'bg-primary-50 border border-primary-200' 
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant={selected.length === 0 ? 'info' : 'outline'}>
                All {label.toLowerCase()}
              </Badge>
            </div>
            <span className="text-sm text-gray-500">
              {totalCount}
            </span>
          </div>
        </button>

        {/* Individual status options */}
        {options.map((option) => {
          const isSelected = selected.includes(option.key)
          
          return (
            <button
              key={option.key}
              onClick={() => handleStatusClick(option.key)}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                isSelected 
                  ? 'bg-primary-50 border border-primary-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={isSelected ? (option.color ? colorMap[option.color] : 'info') : 'outline'}
                  >
                    {option.label}
                  </Badge>
                  {multiSelect && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by button click
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                  )}
                </div>
                {typeof option.count !== 'undefined' && (
                  <span className="text-sm text-gray-500">
                    {option.count}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {selected.length} of {options.length} selected
          </p>
        </div>
      )}
    </div>
  )
}