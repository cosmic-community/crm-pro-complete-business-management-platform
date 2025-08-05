import { CheckSquare, Clock, AlertTriangle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getTaskStats() {
  const totalTasks = await prisma.task.count()
  const completedTasks = await prisma.task.count({
    where: { status: 'COMPLETED' }
  })
  const inProgressTasks = await prisma.task.count({
    where: { status: 'IN_PROGRESS' }
  })
  const overdueTasks = await prisma.task.count({
    where: {
      status: { not: 'COMPLETED' },
      dueDate: { lt: new Date() }
    }
  })

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks
  }
}

export default async function TaskOverview() {
  const stats = await getTaskStats()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Task Overview</h3>
        <Link href="/dashboard/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all tasks
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-green-900">{stats.completedTasks}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-blue-900">{stats.inProgressTasks}</div>
            <div className="text-sm text-blue-700">In Progress</div>
          </div>
        </div>

        {stats.overdueTasks > 0 && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-red-900">
                  {stats.overdueTasks} overdue task{stats.overdueTasks > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-red-700">
                  Requires immediate attention
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          {stats.totalTasks} total tasks
        </div>
      </div>
    </div>
  )
}