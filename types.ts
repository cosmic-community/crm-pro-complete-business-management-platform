export interface JWTPayload {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  iat: number
  exp: number
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country: string
  dateOfBirth?: Date
  notes?: string
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes?: string
  customerId: string
  employeeId: string
  serviceId?: string
  locationId?: string
  createdAt: Date
  updatedAt: Date
  customer?: Customer
  employee?: User
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
  completedAt?: Date
  assigneeId?: string
  assignee?: User
  createdAt: Date
  updatedAt: Date
}