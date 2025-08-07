'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, Briefcase, MapPin, Calendar } from 'lucide-react'
import Loading from './Loading'

interface Employee {
  id: string
  title: string
  slug: string
  metadata: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    job_title: string
    department: {
      key: string
      value: string
    }
    location?: {
      id: string
      title: string
      metadata: {
        location_name: string
      }
    }
    employment_status: {
      key: string
      value: string
    }
    start_date?: string
    profile_photo?: {
      url: string
      imgix_url: string
    }
    emergency_contact?: {
      name: string
      relationship: string
      phone: string
    }
  }
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (!response.ok) {
        throw new Error('Failed to fetch employees')
      }
      const data = await response.json()
      setEmployees(data.employees || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      setError('Failed to load employees')
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
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartmentColor = (department: string) => {
    const colors = {
      'sales': 'bg-blue-100 text-blue-800',
      'operations': 'bg-green-100 text-green-800',
      'management': 'bg-purple-100 text-purple-800',
      'hr': 'bg-pink-100 text-pink-800',
      'it': 'bg-indigo-100 text-indigo-800',
      'customer service': 'bg-orange-100 text-orange-800'
    }
    return colors[department.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredEmployees = employees.filter(employee => {
    if (filter === 'all') return true
    return employee.metadata.department.key === filter
  })

  const departments = [...new Set(employees.map(emp => emp.metadata.department.key))]

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchEmployees}
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
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
                filter === dept
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dept.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' ? 'No employees have been added yet.' : `No employees in ${filter} department.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {employee.metadata.profile_photo ? (
                  <img
                    src={`${employee.metadata.profile_photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={`${employee.metadata.first_name} ${employee.metadata.last_name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {employee.metadata.first_name} {employee.metadata.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{employee.metadata.job_title}</p>
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(employee.metadata.department.value)}`}>
                  {employee.metadata.department.value}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(employee.metadata.employment_status.value)}`}>
                  {employee.metadata.employment_status.value}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <a href={`mailto:${employee.metadata.email}`} className="hover:text-primary-600 truncate">
                    {employee.metadata.email}
                  </a>
                </div>

                {employee.metadata.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <a href={`tel:${employee.metadata.phone}`} className="hover:text-primary-600">
                      {employee.metadata.phone}
                    </a>
                  </div>
                )}

                {employee.metadata.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{employee.metadata.location.metadata.location_name}</span>
                  </div>
                )}

                {employee.metadata.start_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Started {new Date(employee.metadata.start_date).toLocaleDateString()}</span>
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