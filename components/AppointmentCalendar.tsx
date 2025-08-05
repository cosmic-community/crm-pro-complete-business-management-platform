'use client'

import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { Appointment } from '@/types'

const localizer = momentLocalizer(moment)

interface CalendarEvent extends Event {
  id: string
  title: string
  start: Date
  end: Date
  resource: Appointment
}

interface SlotInfo {
  start: Date
  end: Date
  slots: Date[]
}

export default function AppointmentCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const result = await response.json()
        const calendarEvents = result.data.map((appointment: Appointment) => ({
          id: appointment.id,
          title: appointment.title,
          start: new Date(appointment.startTime),
          end: new Date(appointment.endTime),
          resource: appointment,
        }))
        setEvents(calendarEvents)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    // Handle appointment click - could open modal or navigate to detail view
    console.log('Selected appointment:', event.resource)
  }

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Handle empty slot click - could create new appointment
    console.log('Selected slot:', slotInfo)
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-96">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="h-96">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          views={['month', 'week', 'day']}
          defaultView="week"
          step={30}
          showMultiDayTimes
          eventPropGetter={(event: CalendarEvent) => ({
            style: {
              backgroundColor: '#2563eb',
              borderColor: '#1d4ed8',
            },
          })}
        />
      </div>
    </div>
  )
}