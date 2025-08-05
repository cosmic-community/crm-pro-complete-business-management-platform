declare module 'react-big-calendar' {
  import { ComponentType } from 'react'

  export interface Event {
    title: string
    start: Date
    end: Date
    resource?: any
    allDay?: boolean
  }

  export interface CalendarProps {
    localizer: any
    events: Event[]
    startAccessor?: string | ((event: Event) => Date)
    endAccessor?: string | ((event: Event) => Date)
    titleAccessor?: string | ((event: Event) => string)
    allDayAccessor?: string | ((event: Event) => boolean)
    resourceAccessor?: string | ((event: Event) => any)
    onSelectEvent?: (event: Event) => void
    onSelectSlot?: (slotInfo: any) => void
    selectable?: boolean
    views?: string[] | Record<string, ComponentType>
    defaultView?: string
    view?: string
    onView?: (view: string) => void
    step?: number
    timeslots?: number
    showMultiDayTimes?: boolean
    eventPropGetter?: (event: Event) => { style?: React.CSSProperties; className?: string }
    slotPropGetter?: (date: Date) => { style?: React.CSSProperties; className?: string }
    dayPropGetter?: (date: Date) => { style?: React.CSSProperties; className?: string }
    formats?: any
    components?: any
    popup?: boolean
    popupOffset?: number | { x: number; y: number }
    culture?: string
    messages?: any
    min?: Date
    max?: Date
    scrollToTime?: Date
    onNavigate?: (date: Date, view: string, action: string) => void
    onRangeChange?: (range: Date[] | { start: Date; end: Date }) => void
    toolbar?: boolean
    date?: Date
    getNow?: () => Date
    length?: number
    drilldownView?: string
    onDrillDown?: (date: Date, view: string) => void
    doShowMoreDrillDown?: boolean
    resizable?: boolean
    onEventDrop?: (args: any) => void
    onEventResize?: (args: any) => void
    dragFromOutsideItem?: () => any
    onDropFromOutside?: (args: any) => void
    draggableAccessor?: string | ((event: Event) => boolean)
    resizableAccessor?: string | ((event: Event) => boolean)
  }

  export const Calendar: ComponentType<CalendarProps>
  export function momentLocalizer(moment: any): any
  export const Views: {
    MONTH: string
    WEEK: string
    WORK_WEEK: string
    DAY: string
    AGENDA: string
  }
}