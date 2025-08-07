'use client'

import { useState, useEffect } from 'react'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select, SelectOption } from '@/components/ui/Select'
import Loading from '@/components/Loading'

interface PerformanceData {
  name: string
  revenue: number
  target: number
  deals: number
  conversion: number
  performance: number
}

const metricOptions: SelectOption[] = [
  { value: 'revenue', label: 'Revenue vs Target' },
  { value: 'conversion', label: 'Conversion Rates' },
  { value: 'performance', label: 'Team Performance' }
]

const periodOptions: SelectOption[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
]

export default function PerformanceChart() {
  const [data, setData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState('revenue')
  const [period, setPeriod] = useState('monthly')

  useEffect(() => {
    fetchPerformanceData()
  }, [metric, period])

  const fetchPerformanceData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports/performance?metric=${metric}&period=${period}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value}%`

  const renderChart = () => {
    if (metric === 'conversion') {
      return (
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={data}>
          <RadialBar
            minAngle={15}
            label={{ position: 'insideStart', fill: '#fff' }}
            background
            clockWise
            dataKey="conversion"
            fill="#2563eb"
          />
          <Legend iconSize={18} wrapperStyle={{ top: '50%', right: '0%', transform: 'translate(0, -50%)', lineHeight: '24px' }} />
          <Tooltip formatter={(value: number) => [formatPercentage(value), 'Conversion Rate']} />
        </RadialBarChart>
      )
    }

    return (
      <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis 
          yAxisId="left" 
          tickFormatter={metric === 'revenue' ? formatCurrency : formatPercentage} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          tickFormatter={(value) => value.toString()}
        />
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'Revenue' || name === 'Target') return [formatCurrency(value), name]
            if (name === 'Conversion' || name === 'Performance') return [formatPercentage(value), name]
            return [value, name]
          }}
        />
        <Legend />
        
        {metric === 'revenue' && (
          <>
            <Bar yAxisId="left" dataKey="revenue" fill="#2563eb" name="Revenue" />
            <Line yAxisId="left" type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} name="Target" />
            <Bar yAxisId="right" dataKey="deals" fill="#10b981" name="Deals" opacity={0.7} />
          </>
        )}
        
        {metric === 'performance' && (
          <>
            <Bar yAxisId="left" dataKey="performance" fill="#8b5cf6" name="Performance" />
            <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#f59e0b" strokeWidth={2} name="Deals" />
          </>
        )}
      </ComposedChart>
    )
  }

  const getMetricSummary = () => {
    if (data.length === 0) return null

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
    const totalTarget = data.reduce((sum, item) => sum + item.target, 0)
    const avgConversion = data.reduce((sum, item) => sum + item.conversion, 0) / data.length
    const avgPerformance = data.reduce((sum, item) => sum + item.performance, 0) / data.length

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-600">Total Revenue</p>
          <p className="text-xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-sm font-medium text-red-600">Total Target</p>
          <p className="text-xl font-bold text-red-900">{formatCurrency(totalTarget)}</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-600">Avg Conversion</p>
          <p className="text-xl font-bold text-green-900">{formatPercentage(avgConversion)}</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-600">Avg Performance</p>
          <p className="text-xl font-bold text-purple-900">{formatPercentage(avgPerformance)}</p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Performance Analytics</CardTitle>
          <div className="flex space-x-2">
            <Select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              options={metricOptions}
            />
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={periodOptions}
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
            {getMetricSummary()}
            
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