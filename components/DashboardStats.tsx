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
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Tasks',
      value: stats.totalTasks.toLocaleString(),
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      title: 'Appointments',
      value: stats.totalAppointments.toLocaleString(),
      icon: '📅',
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{item.title}</p>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`${item.color} p-3 rounded-full text-white text-2xl`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}