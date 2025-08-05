'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Customer } from '@/types'

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const result = await response.json()
        setCustomers(result.data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return
    }

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCustomers(customers.filter(c => c.id !== id))
        toast.success('Customer deleted successfully')
      } else {
        toast.error('Error deleting customer')
      }
    } catch (error) {
      toast.error('Network error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </div>
                </td>
                <td>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`mailto:${customer.email}`} className="text-primary-600 hover:text-primary-700">
                      {customer.email}
                    </a>
                  </div>
                </td>
                <td>
                  {customer.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`tel:${customer.phone}`} className="text-gray-900">
                        {customer.phone}
                      </a>
                    </div>
                  )}
                </td>
                <td>
                  <div className="text-sm text-gray-500">
                    {customer.city && customer.state && `${customer.city}, ${customer.state}`}
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map((tag, index) => (
                      <span key={index} className="badge-info">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/dashboard/customers/${customer.id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {customers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No customers found</p>
          <Link href="/dashboard/customers/new" className="btn-primary mt-4 inline-flex">
            Add your first customer
          </Link>
        </div>
      )}
    </div>
  )
}