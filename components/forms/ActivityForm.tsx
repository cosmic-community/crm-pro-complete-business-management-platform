'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'

interface Contact {
  id: string
  title: string
  metadata: {
    first_name: string
    last_name: string
  }
}

interface Company {
  id: string
  title: string
  metadata: {
    company_name: string
  }
}

interface Deal {
  id: string
  title: string
  metadata: {
    deal_name: string
  }
}

interface User {
  id: string
  title: string
  metadata: {
    first_name: string
    last_name: string
  }
}

interface ActivityFormProps {
  activity?: any
  onSuccess: () => void
  onCancel: () => void
}

const activityTypeOptions: SelectOption[] = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'demo', label: 'Demo' },
  { value: 'follow_up', label: 'Follow-up' }
]

const outcomeOptions: SelectOption[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'cancelled', label: 'Cancelled' }
]

export default function ActivityForm({ activity, onSuccess, onCancel }: ActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    activity_type: activity?.metadata?.activity_type?.key || '',
    subject: activity?.metadata?.subject || '',
    description: activity?.metadata?.description || '',
    contact: activity?.metadata?.contact?.id || '',
    company: activity?.metadata?.company?.id || '',
    deal: activity?.metadata?.deal?.id || '',
    activity_date: activity?.metadata?.activity_date || '',
    duration: activity?.metadata?.duration || '',
    outcome: activity?.metadata?.outcome?.key || '',
    assigned_to: activity?.metadata?.assigned_to?.id || '',
    follow_up_required: activity?.metadata?.follow_up_required || false,
    next_follow_up_date: activity?.metadata?.next_follow_up_date || ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [contactsRes, companiesRes, dealsRes, usersRes] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/companies'),
        fetch('/api/deals'),
        fetch('/api/users')
      ])

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json()
        setContacts(contactsData.data || [])
      }

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json()
        setCompanies(companiesData.data || [])
      }

      if (dealsRes.ok) {
        const dealsData = await dealsRes.json()
        setDeals(dealsData.data || [])
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = activity ? `/api/activities/${activity.id}` : '/api/activities'
      const method = activity ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.subject,
          metadata: {
            activity_type: formData.activity_type ? { key: formData.activity_type, value: activityTypeOptions.find(o => o.value === formData.activity_type)?.label } : null,
            subject: formData.subject,
            description: formData.description,
            contact: formData.contact || null,
            company: formData.company || null,
            deal: formData.deal || null,
            activity_date: formData.activity_date,
            duration: formData.duration ? parseInt(formData.duration) : null,
            outcome: formData.outcome ? { key: formData.outcome, value: outcomeOptions.find(o => o.value === formData.outcome)?.label } : null,
            assigned_to: formData.assigned_to || null,
            follow_up_required: formData.follow_up_required,
            next_follow_up_date: formData.next_follow_up_date || null
          }
        }),
      })

      if (response.ok) {
        toast.success(activity ? 'Activity updated successfully' : 'Activity created successfully')
        onSuccess()
      } else {
        throw new Error('Failed to save activity')
      }
    } catch (error) {
      toast.error('Error saving activity')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contactOptions: SelectOption[] = contacts.map(contact => ({
    value: contact.id,
    label: `${contact.metadata.first_name} ${contact.metadata.last_name}`
  }))

  const companyOptions: SelectOption[] = companies.map(company => ({
    value: company.id,
    label: company.metadata.company_name
  }))

  const dealOptions: SelectOption[] = deals.map(deal => ({
    value: deal.id,
    label: deal.metadata.deal_name
  }))

  const userOptions: SelectOption[] = users.map(user => ({
    value: user.id,
    label: `${user.metadata.first_name} ${user.metadata.last_name}`
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity ? 'Edit Activity' : 'Add New Activity'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Activity Type"
              value={formData.activity_type}
              onChange={(e) => handleInputChange('activity_type', e.target.value)}
              options={activityTypeOptions}
              placeholder="Select activity type"
              required
            />
            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Activity description..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Contact"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              options={contactOptions}
              placeholder="Select contact"
            />
            <Select
              label="Company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              options={companyOptions}
              placeholder="Select company"
            />
            <Select
              label="Deal"
              value={formData.deal}
              onChange={(e) => handleInputChange('deal', e.target.value)}
              options={dealOptions}
              placeholder="Select deal"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Activity Date"
              type="date"
              value={formData.activity_date}
              onChange={(e) => handleInputChange('activity_date', e.target.value)}
              required
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="0"
            />
            <Select
              label="Outcome"
              value={formData.outcome}
              onChange={(e) => handleInputChange('outcome', e.target.value)}
              options={outcomeOptions}
              placeholder="Select outcome"
            />
          </div>

          <Select
            label="Assigned To"
            value={formData.assigned_to}
            onChange={(e) => handleInputChange('assigned_to', e.target.value)}
            options={userOptions}
            placeholder="Select user"
          />

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.follow_up_required}
                onChange={(e) => handleInputChange('follow_up_required', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Follow-up required</span>
            </label>

            {formData.follow_up_required && (
              <Input
                label="Next Follow-up Date"
                type="date"
                value={formData.next_follow_up_date}
                onChange={(e) => handleInputChange('next_follow_up_date', e.target.value)}
              />
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {activity ? 'Update Activity' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}