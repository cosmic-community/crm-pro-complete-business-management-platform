import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import AppointmentCalendar from '@/components/AppointmentCalendar'
import Loading from '@/components/Loading'

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage customer appointments
          </p>
        </div>
        <Link href="/dashboard/appointments/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Link>
      </div>

      <Suspense fallback={<Loading />}>
        <AppointmentCalendar />
      </Suspense>
    </div>
  )
}