'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select, SelectOption } from '@/components/ui/Select'
import Loading from '@/components/Loading'

interface PipelineData {
  stage: string
  count: number
  value: number
  color: string
}

const chartTypeOptions: SelectOption[] = [
  { value: 'pie', label: 'Pie Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'funnel', label: 'Funnel Chart' }
]

const COLORS = {
  'Prospecting': '#3b82f6',
  'Qualification': '#8b5cf6', 
  'Proposal': '#f59e0b',
  'Negotiation': '#ef4444',
  'Closed Won': '#10b981',
  'Closed Lost': '#6b7280'
}

export default function PipelineChart() {
  const [data, setData] = useState<PipelineData[]>([])
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState('pie')

  useEffect(() => {
    fetchPipelineData()
  }, [])

  const fetchPipelineData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reports/pipeline')
      if (response.ok) {
        const result = await response.json()
        const pipelineData = result.data || []
        
        // Add colors to the data
        const dataWithColors = pipelineData.map((item: any) => ({
          ...item,
          color: COLORS[item.stage as keyof typeof COLORS] || '#6b7280'
        }))
        
        setData(dataWithColors)
      }
    } catch (error) {
      console.error('Error fetching pipeline data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        )
      
      case 'funnel':
        return (
          <FunnelChart data={data}>
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive
            >
              <LabelList position="center" fill="#fff" stroke="none" />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Funnel>
          </FunnelChart>
        )
      
      default: // pie
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ stage, percent }) => `${stage} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
          </PieChart>
        )
    }
  }

  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  const totalDeals = data.reduce((sum, item) => sum + item.count, 0)
  const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sales Pipeline</CardTitle>
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            options={chartTypeOptions}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loading />
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-600">Total Pipeline</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalValue)}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-600">Total Deals</p>
                <p className="text-2xl font-bold text-green-900">{totalDeals}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(averageDealSize)}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.map((item) => (
                <div key={item.stage} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.stage} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}