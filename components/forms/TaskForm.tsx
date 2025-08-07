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

interface TaskFormProps {
  task?: any
  onSuccess: () => void
  onCancel: () => void
}

const priorityOptions: SelectOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

const statusOptions: SelectOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const categoryOptions: SelectOption[] = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'demo', label: 'Demo' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'contract', label: 'Contract' }
]

export default function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    task_title: task?.metadata?.task_title || '',
    description: task?.metadata?.description || '',
    priority: task?.metadata?.priority?.key || '',
    status: task?.metadata?.status?.key || '',
    assigned_to: task?.metadata?.assigned_to?.id || '',
    related_contact: task?.metadata?.related_contact?.id || '',
    related_company: task?.metadata?.related_company?.id || '',
    related_deal: task?.metadata?.related_deal?.id || '',
    due_date: task?.metadata?.due_date || '',
    completed_date: task?.metadata?.completed_date || '',
    category: task?.metadata?.category?.key || ''
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
      const url = task ? `/api/tasks/${task.id}` : '/api/tasks'
      const method = task ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.task_title,
          metadata: {
            task_title: formData.task_title,
            description: formData.description,
            priority: formData.priority ? { key: formData.priority, value: priorityOptions.find(o => o.value === formData.priority)?.label } : null,
            status: formData.status ? { key: formData.status, value: statusOptions.find(o => o.value === formData.status)?.label } : null,
            assigned_to: formData.assigned_to || null,
            related_contact: formData.related_contact || null,
            related_company: formData.related_company || null,
            related_deal: formData.related_deal || null,
            due_date: formData.due_date || null,
            completed_date: formData.completed_date || null,
            category: formData.category ? { key: formData.category, value: categoryOptions.find(o => o.value === formData.category)?.label } : null
          }
        }),
      })

      if (response.ok) {
        toast.success(task ? 'Task updated successfully' : 'Task created successfully')
        onSuccess()
      } else {
        throw new Error('Failed to save task')
      }
    } catch (error) {
      toast.error('Error saving task')
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
        <CardTitle>{task ? 'Edit Task' : 'Add New Task'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            value={formData.task_title}
            onChange={(e) => handleInputChange('task_title', e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Task description..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              options={priorityOptions}
              placeholder="Select priority"
              required
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={statusOptions}
              placeholder="Select status"
              required
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned To"
              value={formData.assigned_to}
              onChange={(e) => handleInputChange('assigned_to', e.target.value)}
              options={userOptions}
              placeholder="Select user"
            />
            <Select
              label="Related Contact"
              value={formData.related_contact}
              onChange={(e) => handleInputChange('related_contact', e.target.value)}
              options={contactOptions}
              placeholder="Select contact"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Related Company"
              value={formData.related_company}
              onChange={(e) => handleInputChange('related_company', e.target.value)}
              options={companyOptions}
              placeholder="Select company"
            />
            <Select
              label="Related Deal"
              value={formData.related_deal}
              onChange={(e) => handleInputChange('related_deal', e.target.value)}
              options={dealOptions}
              placeholder="Select deal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
            />
            <Input
              label="Completed Date"
              type="date"
              value={formData.completed_date}
              onChange={(e) => handleInputChange('completed_date', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}