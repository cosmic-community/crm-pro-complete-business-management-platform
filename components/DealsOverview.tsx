'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import type { CosmicDeal } from '@/lib/cosmic'

const dealStages = [
  { key: 'prospecting', label: 'Prospecting', color: 'bg-gray-100 text-gray-800' },
  { key: 'qualification', label: 'Qualification', color: 'bg-blue-100 text-blue-800' },
  { key: 'proposal', label: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { key: 'closed_won', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { key: 'closed_lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' },
]

export default function DealsOverview() {
  const [deals, setDeals] = useState<CosmicDeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStage, setSelectedStage] = useState<string>('all')

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals')
      if (response.ok) {
        const result = await response.json()
        setDeals(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDeals = selectedStage === 'all' 
    ? deals 
    : deals.filter(deal => deal.metadata.stage?.key === selectedStage)

  const totalValue = filteredDeals.reduce((sum, deal) => 
    sum + (deal.metadata.deal_value || 0), 0
  )

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
      {/* Stage Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-3 py-1 text-sm rounded-full font-medium ${
              selectedStage === 'all'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Deals ({deals.length})
          </button>
          {dealStages.map(stage => {
            const count = deals.filter(deal => deal.metadata.stage?.key === stage.key).length
            return (
              <button
                key={stage.key}
                onClick={() => setSelectedStage(stage.key)}
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  selectedStage === stage.key
                    ? stage.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {stage.label} ({count})
              </button>
            )
          })}
        </div>

        {filteredDeals.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Total Value ({filteredDeals.length} deals)
              </span>
              <span className="text-xl font-bold text-gray-900">
                ${totalValue.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Deals List */}
      <div className="card">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <DollarSign className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-500 mb-4">
              {selectedStage === 'all' 
                ? "Start by adding your first deal" 
                : `No deals in ${dealStages.find(s => s.key === selectedStage)?.label || selectedStage} stage`
              }
            </p>
            <button className="btn-primary">
              Add Deal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeals.map((deal) => {
              const stage = dealStages.find(s => s.key === deal.metadata.stage?.key)
              
              return (
                <div key={deal.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {deal.metadata.deal_name}
                        </h3>
                        {stage && (
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${stage.color}`}>
                            {stage.label}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          ${(deal.metadata.deal_value || 0).toLocaleString()}
                        </div>
                        
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          {deal.metadata.probability || 0}% probability
                        </div>
                        
                        {deal.metadata.expected_close_date && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(deal.metadata.expected_close_date), 'MMM d, yyyy')}
                          </div>
                        )}
                        
                        {deal.metadata.assigned_to && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {deal.metadata.assigned_to.metadata.first_name} {deal.metadata.assigned_to.metadata.last_name}
                          </div>
                        )}
                      </div>

                      {deal.metadata.contact && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Contact:</strong> {deal.metadata.contact.metadata.first_name} {deal.metadata.contact.metadata.last_name}
                          {deal.metadata.contact.metadata.email && (
                            <span className="ml-2">({deal.metadata.contact.metadata.email})</span>
                          )}
                        </div>
                      )}

                      {deal.metadata.company && (
                        <div className="mt-1 text-sm text-gray-600">
                          <strong>Company:</strong> {deal.metadata.company.metadata.company_name}
                        </div>
                      )}

                      {deal.metadata.notes && (
                        <div className="mt-2">
                          <div 
                            className="text-sm text-gray-600 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: deal.metadata.notes }}
                          />
                        </div>
                      )}

                      {deal.metadata.next_action && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <strong className="text-blue-800">Next Action:</strong>
                          <span className="text-blue-700 ml-2">{deal.metadata.next_action}</span>
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