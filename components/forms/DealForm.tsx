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

interface User {
  id: string
  title: string
  metadata: {
    first_name: string
    last_name: string
  }
}

interface DealFormProps {
  deal?: any
  onSuccess: () => void
  onCancel: () => void
}

const stageOptions: SelectOption[] = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' }
]

const sourceOptions: SelectOption[] = [
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'referral', label: 'Referral' }
]

export default function DealForm({ deal, onSuccess, onCancel }: DealFormProps) {
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    deal_name: deal?.metadata?.deal_name || '',
    contact: deal?.metadata?.contact?.id || '',
    company: deal?.metadata?.company?.id || '',
    deal_value: deal?.metadata?.deal_value || '',
    stage: deal?.metadata?.stage?.key || '',
    probability: deal?.metadata?.probability || '',
    expected_close_date: deal?.metadata?.expected_close_date || '',
    actual_close_date: deal?.metadata?.actual_close_date || '',
    deal_source: deal?.metadata?.deal_source?.key || '',
    assigned_to: deal?.metadata?.assigned_to?.id || '',
    notes: deal?.metadata?.notes || '',
    next_action: deal?.metadata?.next_action || ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [contactsRes, companiesRes, usersRes] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/companies'),
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
      const url = deal ? `/api/deals/${deal.id}` : '/api/deals'
      const method = deal ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.deal_name,
          metadata: {
            deal_name: formData.deal_name,
            contact: formData.contact || null,
            company: formData.company || null,
            deal_value: formData.deal_value ? parseFloat(formData.deal_value) : null,
            stage: formData.stage ? { key: formData.stage, value: stageOptions.find(o => o.value === formData.stage)?.label } : null,
            probability: formData.probability ? parseInt(formData.probability) : null,
            expected_close_date: formData.expected_close_date || null,
            actual_close_date: formData.actual_close_date || null,
            deal_source: formData.deal_source ? { key: formData.deal_source, value: sourceOptions.find(o => o.value === formData.deal_source)?.label } : null,
            assigned_to: formData.assigned_to || null,
            notes: formData.notes,
            next_action: formData.next_action
          }
        }),
      })

      if (response.ok) {
        toast.success(deal ? 'Deal updated successfully' : 'Deal created successfully')
        onSuccess()
      } else {
        throw new Error('Failed to save deal')
      }
    } catch (error) {
      toast.error('Error saving deal')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
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

  const userOptions: SelectOption[] = users.map(user => ({
    value: user.id,
    label: `${user.metadata.first_name} ${user.metadata.last_name}`
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{deal ? 'Edit Deal' : 'Add New Deal'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Deal Name"
            value={formData.deal_name}
            onChange={(e) => handleInputChange('deal_name', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Contact"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              options={contactOptions}
              placeholder="Select contact"
              required
            />
            <Select
              label="Company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              options={companyOptions}
              placeholder="Select company"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deal Value"
              type="number"
              value={formData.deal_value}
              onChange={(e) => handleInputChange('deal_value', e.target.value)}
              placeholder="0"
            />
            <Input
              label="Probability (%)"
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => handleInputChange('probability', e.target.value)}
              placeholder="0-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Stage"
              value={formData.stage}
              onChange={(e) => handleInputChange('stage', e.target.value)}
              options={stageOptions}
              placeholder="Select stage"
              required
            />
            <Select
              label="Deal Source"
              value={formData.deal_source}
              onChange={(e) => handleInputChange('deal_source', e.target.value)}
              options={sourceOptions}
              placeholder="Select source"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expected Close Date"
              type="date"
              value={formData.expected_close_date}
              onChange={(e) => handleInputChange('expected_close_date', e.target.value)}
            />
            <Input
              label="Actual Close Date"
              type="date"
              value={formData.actual_close_date}
              onChange={(e) => handleInputChange('actual_close_date', e.target.value)}
            />
          </div>

          <Select
            label="Assigned To"
            value={formData.assigned_to}
            onChange={(e) => handleInputChange('assigned_to', e.target.value)}
            options={userOptions}
            placeholder="Select user"
          />

          <Input
            label="Next Action"
            value={formData.next_action}
            onChange={(e) => handleInputChange('next_action', e.target.value)}
            placeholder="What's the next step?"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Deal notes and details..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}