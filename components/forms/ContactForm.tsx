'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'

interface Company {
  id: string
  title: string
  metadata: {
    company_name: string
  }
}

interface ContactFormProps {
  contact?: any
  onSuccess: () => void
  onCancel: () => void
}

const leadSourceOptions: SelectOption[] = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'event', label: 'Event' },
  { value: 'social_media', label: 'Social Media' }
]

const statusOptions: SelectOption[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' },
  { value: 'lost', label: 'Lost' }
]

export default function ContactForm({ contact, onSuccess, onCancel }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [formData, setFormData] = useState({
    first_name: contact?.metadata?.first_name || '',
    last_name: contact?.metadata?.last_name || '',
    email: contact?.metadata?.email || '',
    phone: contact?.metadata?.phone || '',
    job_title: contact?.metadata?.job_title || '',
    company: contact?.metadata?.company?.id || '',
    lead_source: contact?.metadata?.lead_source?.key || '',
    status: contact?.metadata?.status?.key || '',
    tags: contact?.metadata?.tags || '',
    notes: contact?.metadata?.notes || ''
  })

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (response.ok) {
        const result = await response.json()
        setCompanies(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = contact ? `/api/contacts/${contact.id}` : '/api/contacts'
      const method = contact ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${formData.first_name} ${formData.last_name}`,
          metadata: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            job_title: formData.job_title,
            company: formData.company || null,
            lead_source: formData.lead_source ? { key: formData.lead_source, value: leadSourceOptions.find(o => o.value === formData.lead_source)?.label } : null,
            status: formData.status ? { key: formData.status, value: statusOptions.find(o => o.value === formData.status)?.label } : null,
            tags: formData.tags,
            notes: formData.notes
          }
        }),
      })

      if (response.ok) {
        toast.success(contact ? 'Contact updated successfully' : 'Contact created successfully')
        onSuccess()
      } else {
        throw new Error('Failed to save contact')
      }
    } catch (error) {
      toast.error('Error saving contact')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const companyOptions: SelectOption[] = companies.map(company => ({
    value: company.id,
    label: company.metadata.company_name
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Job Title"
              value={formData.job_title}
              onChange={(e) => handleInputChange('job_title', e.target.value)}
            />
            <Select
              label="Company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              options={companyOptions}
              placeholder="Select a company"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Lead Source"
              value={formData.lead_source}
              onChange={(e) => handleInputChange('lead_source', e.target.value)}
              options={leadSourceOptions}
              placeholder="Select lead source"
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={statusOptions}
              placeholder="Select status"
              required
            />
          </div>

          <Input
            label="Tags"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            helpText="Comma-separated tags"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional notes about this contact..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {contact ? 'Update Contact' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}