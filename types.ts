export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface JWTPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  iat: number
  exp: number
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
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
  notes?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  status: AppointmentStatus
  customer: Customer
  employee: User
  service?: Service
  location?: Location
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  dueDate?: Date
  completedAt?: Date
  assignee: User
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  category?: ServiceCategory
  location?: Location
  createdAt: Date
  updatedAt: Date
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  price: number
  cost: number
  stockQty: number
  category?: ProductCategory
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone?: string
  email?: string
  createdAt: Date
  updatedAt: Date
}

export interface CompanySettings {
  id: string
  companyName: string
  email: string
  phone?: string
  address?: string
  timezone: string
  currency: string
  createdAt: Date
  updatedAt: Date
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface DashboardStats {
  totalCustomers: number
  totalAppointments: number
  totalRevenue: number
  completedTasks: number
  upcomingAppointments: number
  pendingTasks: number
}

export interface RevenueData {
  month: string
  revenue: number
}

export interface CustomerFilters {
  search: string
  city: string
  state: string
  tags: string[]
}

export interface TaskFilters {
  status: TaskStatus[]
  priority: Priority[]
  assigneeId: string
  search: string
}