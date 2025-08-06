'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'

interface ChartData {
  name: string
  revenue: number
}

export default function RevenueChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/reports/revenue')
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number | string) => [`$${value}`, 'Revenue']} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}