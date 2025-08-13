interface DashboardStatsProps {
  stats: {
    totalCustomers: number
    totalTasks: number
    totalAppointments: number
    revenue: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      title: 'Unpaid invoices',
      value: '$150',
      color: 'bg-yellow-100',
      icon: '💰',
    },
    {
      title: 'Account balance',
      value: '$250',
      color: 'bg-blue-100',
      icon: '💳',
    },
    {
      title: 'Pending',
      value: '$500',
      color: 'bg-purple-100',
      icon: '⏳',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <div key={index} className={`${item.color} rounded-2xl p-6 relative overflow-hidden`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{item.title}</p>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className="text-2xl opacity-60">
              {item.icon}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}