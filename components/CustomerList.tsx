'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Mail, Phone, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Contact {
  id: string
  title: string
  slug: string
  metadata: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    job_title?: string
    lead_source?: {
      key: string
      value: string
    }
    status: {
      key: string
      value: string
    }
    company?: {
      id: string
      title: string
      metadata?: {
        company_name: string
      }
    }
    notes?: string
    tags?: string
  }
}

export default function CustomerList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      if (response.ok) {
        const result = await response.json()
        setContacts(result.data || [])
      } else {
        console.error('Failed to fetch contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return
    }

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== id))
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
              <th>Company</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <div className="font-medium text-gray-900">
                    {contact.metadata.first_name} {contact.metadata.last_name}
                  </div>
                  {contact.metadata.job_title && (
                    <div className="text-sm text-gray-500">{contact.metadata.job_title}</div>
                  )}
                </td>
                <td>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`mailto:${contact.metadata.email}`} className="text-primary-600 hover:text-primary-700">
                      {contact.metadata.email}
                    </a>
                  </div>
                </td>
                <td>
                  {contact.metadata.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`tel:${contact.metadata.phone}`} className="text-gray-900">
                        {contact.metadata.phone}
                      </a>
                    </div>
                  )}
                </td>
                <td>
                  {contact.metadata.company && (
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {contact.metadata.company.metadata?.company_name || contact.metadata.company.title}
                      </span>
                    </div>
                  )}
                </td>
                <td>
                  <span className={`badge ${
                    contact.metadata.status.key === 'customer' ? 'badge-success' :
                    contact.metadata.status.key === 'prospect' ? 'badge-warning' :
                    contact.metadata.status.key === 'lead' ? 'badge-info' : 'badge-error'
                  }`}>
                    {contact.metadata.status.value}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {contact.metadata.tags && contact.metadata.tags.split(',').map((tag: string, index: number) => (
                      <span key={index} className="badge-info">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/dashboard/contacts/${contact.id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(contact.id)}
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

      {contacts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  )
}