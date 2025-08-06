'use client'

import { useState, useEffect } from 'react'
import { Building, Globe, MapPin, Users, DollarSign } from 'lucide-react'
import type { CosmicCompany } from '@/lib/cosmic'

const industryOptions = [
  { key: 'technology', label: 'Technology' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'finance', label: 'Finance' },
  { key: 'retail', label: 'Retail' },
  { key: 'manufacturing', label: 'Manufacturing' },
  { key: 'consulting', label: 'Consulting' },
]

const statusOptions = [
  { key: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { key: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { key: 'prospect', label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
]

export default function CompanyList() {
  const [companies, setCompanies] = useState<CosmicCompany[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

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
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company => {
    if (selectedIndustry !== 'all' && company.metadata.industry?.key !== selectedIndustry) {
      return false
    }
    if (selectedStatus !== 'all' && company.metadata.account_status?.key !== selectedStatus) {
      return false
    }
    return true
  })

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
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="input"
            >
              <option value="all">All Industries</option>
              {industryOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="card">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Building className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">
              {companies.length === 0 
                ? "Start by adding your first company" 
                : "Try adjusting your filters"
              }
            </p>
            <button className="btn-primary">
              Add Company
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCompanies.map((company) => {
              const status = statusOptions.find(s => s.key === company.metadata.account_status?.key)
              
              return (
                <div key={company.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {company.metadata.logo?.imgix_url ? (
                            <img 
                              src={`${company.metadata.logo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                              alt={company.metadata.company_name}
                              className="h-12 w-12 rounded-lg object-cover mr-3"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                              <Building className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {company.metadata.company_name}
                            </h3>
                            {company.metadata.industry && (
                              <span className="text-sm text-gray-600">
                                {company.metadata.industry.value}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {status && (
                          <span className={`px-3 py-1 text-sm rounded-full font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {company.metadata.website && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Globe className="h-4 w-4 mr-2" />
                            <a 
                              href={company.metadata.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700"
                            >
                              Website
                            </a>
                          </div>
                        )}
                        
                        {company.metadata.address && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {company.metadata.address.city}, {company.metadata.address.state}
                          </div>
                        )}
                        
                        {company.metadata.company_size && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {company.metadata.company_size.value} employees
                          </div>
                        )}
                        
                        {company.metadata.annual_revenue && (
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            ${(company.metadata.annual_revenue / 1000000).toFixed(1)}M revenue
                          </div>
                        )}
                      </div>

                      {company.metadata.description && (
                        <div 
                          className="text-sm text-gray-600 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: company.metadata.description }}
                        />
                      )}

                      {company.metadata.address && (
                        <div className="mt-2 text-sm text-gray-500">
                          <strong>Address:</strong> {company.metadata.address.street}, {company.metadata.address.city}, {company.metadata.address.state} {company.metadata.address.zip}
                        </div>
                      )}
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