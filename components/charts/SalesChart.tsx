'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select, SelectOption } from '@/components/ui/Select'
import Loading from '@/components/Loading'

interface SalesData {
  month: string
  revenue: number
  deals: number
  target: number
}

const timeRangeOptions: SelectOption[] = [
  { value: '6months', label: 'Last 6 Months' },
  { value: '12months', label: 'Last 12 Months' },
  { value: 'ytd', label: 'Year to Date' }
]

const chartTypeOptions: SelectOption[] = [
  { value: 'line', label: 'Line Chart' },
  { value: 'area', label: 'Area Chart' },
  { value: 'bar', label: 'Bar Chart' }
]

export default function SalesChart() {
  const [data, setData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')
  const [chartType, setChartType] = useState('line')

  useEffect(() => {
    fetchSalesData()
  }, [timeRange])

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports/sales?range=${timeRange}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    }

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563eb" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        )
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
            <Bar dataKey="revenue" fill="#2563eb" />
            <Bar dataKey="target" fill="#ef4444" opacity={0.7} />
          </BarChart>
        )
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )
    }
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalDeals = data.reduce((sum, item) => sum + item.deals, 0)
  const averageRevenue = data.length > 0 ? totalRevenue / data.length : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sales Performance</CardTitle>
          <div className="flex space-x-2">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={timeRangeOptions}
            />
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              options={chartTypeOptions}
            />
          </div>
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
                <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-600">Total Deals</p>
                <p className="text-2xl font-bold text-green-900">{totalDeals}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-600">Avg Monthly</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(averageRevenue)}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}