'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, Building, Tag } from 'lucide-react'
import type { CosmicContact } from '@/lib/cosmic'

const statusOptions = [
  { key: 'lead', label: 'Lead', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'prospect', label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
  { key: 'customer', label: 'Customer', color: 'bg-green-100 text-green-800' },
  { key: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
]

export default function ContactList() {
  const [contacts, setContacts] = useState<CosmicContact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      if (response.ok) {
        const result = await response.json()
        setContacts(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredContacts = selectedStatus === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.metadata.status?.key === selectedStatus)

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
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1 text-sm rounded-full font-medium ${
              selectedStatus === 'all'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Contacts ({contacts.length})
          </button>
          {statusOptions.map(status => {
            const count = contacts.filter(contact => contact.metadata.status?.key === status.key).length
            return (
              <button
                key={status.key}
                onClick={() => setSelectedStatus(status.key)}
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  selectedStatus === status.key
                    ? status.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Contacts List */}
      <div className="card">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <User className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500 mb-4">
              {contacts.length === 0 
                ? "Start by adding your first contact" 
                : `No contacts in ${statusOptions.find(s => s.key === selectedStatus)?.label || selectedStatus} status`
              }
            </p>
            <button className="btn-primary">
              Add Contact
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContacts.map((contact) => {
              const status = statusOptions.find(s => s.key === contact.metadata.status?.key)
              
              return (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      {contact.metadata.profile_photo?.imgix_url ? (
                        <img 
                          src={`${contact.metadata.profile_photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                          alt={`${contact.metadata.first_name} ${contact.metadata.last_name}`}
                          className="h-12 w-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {contact.metadata.first_name} {contact.metadata.last_name}
                          </h3>
                          {status && (
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <a 
                              href={`mailto:${contact.metadata.email}`}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              {contact.metadata.email}
                            </a>
                          </div>

                          {contact.metadata.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <a 
                                href={`tel:${contact.metadata.phone}`}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                {contact.metadata.phone}
                              </a>
                            </div>
                          )}

                          {contact.metadata.job_title && (
                            <div className="text-sm text-gray-600">
                              <strong>Title:</strong> {contact.metadata.job_title}
                            </div>
                          )}

                          {contact.metadata.company && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="h-4 w-4 mr-2" />
                              {contact.metadata.company.metadata.company_name}
                              {contact.metadata.company.metadata.industry && (
                                <span className="ml-2 text-gray-500">
                                  ({contact.metadata.company.metadata.industry.value})
                                </span>
                              )}
                            </div>
                          )}

                          {contact.metadata.lead_source && (
                            <div className="text-sm text-gray-600">
                              <strong>Source:</strong> {contact.metadata.lead_source.value}
                            </div>
                          )}

                          {contact.metadata.tags && (
                            <div className="flex items-center flex-wrap gap-1">
                              <Tag className="h-4 w-4 text-gray-400" />
                              {contact.metadata.tags.split(',').map((tag, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {contact.metadata.notes && (
                            <div 
                              className="text-sm text-gray-600 line-clamp-2 mt-2 p-2 bg-gray-50 rounded"
                              dangerouslySetInnerHTML={{ __html: contact.metadata.notes }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}