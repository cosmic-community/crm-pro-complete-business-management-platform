'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Calendar, Download, User, TrendingUp } from 'lucide-react'
import Loading from './Loading'

interface Report {
  id: string
  title: string
  slug: string
  metadata: {
    report_name: string
    report_type: {
      key: string
      value: string
    }
    period: {
      key: string
      value: string
    }
    date_range?: {
      start_date: string
      end_date: string
    }
    metrics?: {
      [key: string]: number | string
    }
    summary?: string
    generated_by?: {
      id: string
      title: string
      metadata: {
        first_name: string
        last_name: string
        job_title: string
      }
    }
    status: {
      key: string
      value: string
    }
    report_file?: {
      url: string
      imgix_url: string
    }
  }
}

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }
      const data = await response.json()
      setReports(data.reports || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
      setError('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'sales': 'bg-blue-100 text-blue-800',
      'financial': 'bg-green-100 text-green-800',
      'operational': 'bg-orange-100 text-orange-800',
      'hr': 'bg-purple-100 text-purple-800',
      'customer': 'bg-pink-100 text-pink-800'
    }
    return colors[type.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDateRange = (dateRange?: { start_date: string; end_date: string }) => {
    if (!dateRange) return ''
    const start = new Date(dateRange.start_date).toLocaleDateString()
    const end = new Date(dateRange.end_date).toLocaleDateString()
    return `${start} - ${end}`
  }

  const formatMetricValue = (value: number | string) => {
    if (typeof value === 'number') {
      // If it's a large number, format with commas
      if (value >= 1000) {
        return value.toLocaleString()
      }
      return value.toString()
    }
    return value
  }

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true
    return report.metadata.report_type.key === filter
  })

  const reportTypes = Array.from(new Set(reports.map(report => report.metadata.report_type.key)))

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReports}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {reportTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
                filter === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' ? 'No reports have been generated yet.' : `No ${filter} reports available.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{report.metadata.report_name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(report.metadata.status.value)}`}>
                  {report.metadata.status.value}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.metadata.report_type.value)}`}>
                  {report.metadata.report_type.value}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {report.metadata.period.value}
                </span>
              </div>

              {report.metadata.date_range && (
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDateRange(report.metadata.date_range)}</span>
                </div>
              )}

              {report.metadata.generated_by && (
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <User className="h-4 w-4 mr-2" />
                  <span>
                    {report.metadata.generated_by.metadata.first_name} {report.metadata.generated_by.metadata.last_name}
                    <span className="text-gray-400 ml-1">
                      ({report.metadata.generated_by.metadata.job_title})
                    </span>
                  </span>
                </div>
              )}

              {report.metadata.metrics && Object.keys(report.metadata.metrics).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Key Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(report.metadata.metrics).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600 text-xs capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div className="font-medium text-gray-900">
                          {formatMetricValue(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.metadata.summary && (
                <div 
                  className="text-sm text-gray-600 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: report.metadata.summary }}
                />
              )}

              {report.metadata.report_file && (
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={report.metadata.report_file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-primary-600 hover:text-primary-800"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}