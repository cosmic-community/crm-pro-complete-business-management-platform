'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select, SelectOption } from '@/components/ui/Select'

interface DateRange {
  startDate: string
  endDate: string
}

interface DateRangeFilterProps {
  value: DateRange
  onChange: (range: DateRange) => void
  presets?: boolean
}

const presetOptions: SelectOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'last30days', label: 'Last 30 days' },
  { value: 'thisMonth', label: 'This month' },
  { value: 'lastMonth', label: 'Last month' },
  { value: 'thisQuarter', label: 'This quarter' },
  { value: 'thisYear', label: 'This year' },
  { value: 'custom', label: 'Custom range' }
]

export default function DateRangeFilter({ value, onChange, presets = true }: DateRangeFilterProps) {
  const [selectedPreset, setSelectedPreset] = useState('custom')

  const getDateRange = (preset: string): DateRange => {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    switch (preset) {
      case 'today':
        return {
          startDate: startOfDay.toISOString().split('T')[0],
          endDate: startOfDay.toISOString().split('T')[0]
        }
        
      case 'yesterday': {
        const yesterday = new Date(startOfDay)
        yesterday.setDate(yesterday.getDate() - 1)
        return {
          startDate: yesterday.toISOString().split('T')[0],
          endDate: yesterday.toISOString().split('T')[0]
        }
      }
        
      case 'last7days': {
        const weekAgo = new Date(startOfDay)
        weekAgo.setDate(weekAgo.getDate() - 6)
        return {
          startDate: weekAgo.toISOString().split('T')[0],
          endDate: startOfDay.toISOString().split('T')[0]
        }
      }
        
      case 'last30days': {
        const monthAgo = new Date(startOfDay)
        monthAgo.setDate(monthAgo.getDate() - 29)
        return {
          startDate: monthAgo.toISOString().split('T')[0],
          endDate: startOfDay.toISOString().split('T')[0]
        }
      }
        
      case 'thisMonth': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        return {
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: startOfDay.toISOString().split('T')[0]
        }
      }
        
      case 'lastMonth': {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        return {
          startDate: startOfLastMonth.toISOString().split('T')[0],
          endDate: endOfLastMonth.toISOString().split('T')[0]
        }
      }
        
      case 'thisQuarter': {
        const quarter = Math.floor(today.getMonth() / 3)
        const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1)
        return {
          startDate: startOfQuarter.toISOString().split('T')[0],
          endDate: startOfDay.toISOString().split('T')[0]
        }
      }
        
      case 'thisYear': {
        const startOfYear = new Date(today.getFullYear(), 0, 1)
        return {
          startDate: startOfYear.toISOString().split('T')[0],
          endDate: startOfDay.toISOString().split('T')[0]
        }
      }
        
      default:
        return value
    }
  }

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)
    if (preset !== 'custom') {
      onChange(getDateRange(preset))
    }
  }

  const handleDateChange = (field: 'startDate' | 'endDate', newValue: string) => {
    onChange({
      ...value,
      [field]: newValue
    })
    setSelectedPreset('custom')
  }

  const clearDates = () => {
    onChange({ startDate: '', endDate: '' })
    setSelectedPreset('custom')
  }

  return (
    <div className="space-y-4">
      {presets && (
        <Select
          label="Date Range"
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          options={presetOptions}
        />
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={value.startDate}
          onChange={(e) => handleDateChange('startDate', e.target.value)}
        />
        <Input
          label="End Date"
          type="date"
          value={value.endDate}
          onChange={(e) => handleDateChange('endDate', e.target.value)}
          min={value.startDate}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {value.startDate && value.endDate ? (
            <span>
              {new Date(value.startDate).toLocaleDateString()} - {new Date(value.endDate).toLocaleDateString()}
            </span>
          ) : (
            <span>Select date range</span>
          )}
        </div>
        
        {(value.startDate || value.endDate) && (
          <Button variant="outline" size="sm" onClick={clearDates}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}