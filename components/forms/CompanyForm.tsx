'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'

interface CompanyFormProps {
  company?: any
  onSuccess: () => void
  onCancel: () => void
}

const industryOptions: SelectOption[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' }
]

const companySizeOptions: SelectOption[] = [
  { value: '1_10', label: '1-10' },
  { value: '11_50', label: '11-50' },
  { value: '51_200', label: '51-200' },
  { value: '200_plus', label: '200+' }
]

const statusOptions: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospect', label: 'Prospect' }
]

export default function CompanyForm({ company, onSuccess, onCancel }: CompanyFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company_name: company?.metadata?.company_name || '',
    website: company?.metadata?.website || '',
    industry: company?.metadata?.industry?.key || '',
    company_size: company?.metadata?.company_size?.key || '',
    annual_revenue: company?.metadata?.annual_revenue || '',
    street: company?.metadata?.address?.street || '',
    city: company?.metadata?.address?.city || '',
    state: company?.metadata?.address?.state || '',
    zip: company?.metadata?.address?.zip || '',
    description: company?.metadata?.description || '',
    account_status: company?.metadata?.account_status?.key || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = company ? `/api/companies/${company.id}` : '/api/companies'
      const method = company ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.company_name,
          metadata: {
            company_name: formData.company_name,
            website: formData.website,
            industry: formData.industry ? { key: formData.industry, value: industryOptions.find(o => o.value === formData.industry)?.label } : null,
            company_size: formData.company_size ? { key: formData.company_size, value: companySizeOptions.find(o => o.value === formData.company_size)?.label } : null,
            annual_revenue: formData.annual_revenue ? parseFloat(formData.annual_revenue) : null,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zip: formData.zip
            },
            description: formData.description,
            account_status: formData.account_status ? { key: formData.account_status, value: statusOptions.find(o => o.value === formData.account_status)?.label } : null
          }
        }),
      })

      if (response.ok) {
        toast.success(company ? 'Company updated successfully' : 'Company created successfully')
        onSuccess()
      } else {
        throw new Error('Failed to save company')
      }
    } catch (error) {
      toast.error('Error saving company')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{company ? 'Edit Company' : 'Add New Company'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            value={formData.company_name}
            onChange={(e) => handleInputChange('company_name', e.target.value)}
            required
          />

          <Input
            label="Website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://example.com"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              options={industryOptions}
              placeholder="Select industry"
            />
            <Select
              label="Company Size"
              value={formData.company_size}
              onChange={(e) => handleInputChange('company_size', e.target.value)}
              options={companySizeOptions}
              placeholder="Select size"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Annual Revenue"
              type="number"
              value={formData.annual_revenue}
              onChange={(e) => handleInputChange('annual_revenue', e.target.value)}
              placeholder="0"
            />
            <Select
              label="Account Status"
              value={formData.account_status}
              onChange={(e) => handleInputChange('account_status', e.target.value)}
              options={statusOptions}
              placeholder="Select status"
              required
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Address</h4>
            <Input
              label="Street Address"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
              <Input
                label="ZIP Code"
                value={formData.zip}
                onChange={(e) => handleInputChange('zip', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Company description..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {company ? 'Update Company' : 'Create Company'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}