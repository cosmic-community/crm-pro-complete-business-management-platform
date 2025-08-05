import { Users, Calendar, CheckSquare, DollarSign } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const totalCustomers = await prisma.customer.count({
    where: { isActive: true }
  })

  const totalAppointments = await prisma.appointment.count({
    where: {
      startTime: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }
  })

  const completedTasks = await prisma.task.count({
    where: { status: 'COMPLETED' }
  })

  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'COMPLETED',
      startTime: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    },
    include: { service: true }
  })

  const totalRevenue = appointments.reduce((sum, apt) => {
    return sum + (apt.service?.price ? Number(apt.service.price) : 0)
  }, 0)

  return {
    totalCustomers,
    totalAppointments,
    completedTasks,
    totalRevenue
  }
}

export default async function DashboardStats() {
  const stats = await getStats()

  const statCards = [
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Appointments This Month',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Completed Tasks',
      value: stats.completedTasks,
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Revenue This Month',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.name} className="card">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}