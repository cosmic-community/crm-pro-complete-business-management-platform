import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import TaskBoard from '@/components/TaskBoard'
import Loading from '@/components/Loading'

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your team's tasks and projects
          </p>
        </div>
        <Link href="/dashboard/tasks/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Link>
      </div>

      <Suspense fallback={<Loading />}>
        <TaskBoard />
      </Suspense>
    </div>
  )
}