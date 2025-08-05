import { Calendar, Clock, User } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

async function getRecentAppointments() {
  const appointments = await prisma.appointment.findMany({
    include: {
      customer: true,
      employee: true,
      service: true,
    },
    orderBy: { startTime: 'asc' },
    where: {
      startTime: {
        gte: new Date(),
      },
    },
    take: 5,
  })

  return appointments
}

export default async function RecentAppointments() {
  const appointments = await getRecentAppointments()

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{appointment.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {appointment.customer.firstName} {appointment.customer.lastName}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {format(new Date(appointment.startTime), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="badge-info">
                  {appointment.status.replace('_', ' ').toLowerCase()}
                </span>
                {appointment.service && (
                  <span className="text-sm font-medium text-green-600">
                    ${Number(appointment.service.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}