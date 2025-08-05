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
  status: AppointmentStatus
  notes?: string
  customerId: string
  customer?: Customer
  employeeId: string
  employee?: User
  serviceId?: string
  service?: Service
  locationId?: string
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
  assigneeId?: string
  assignee?: User
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
  country: string
  phone?: string
  email?: string
  isActive: boolean
  mapUrl?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
  categoryId?: string
  category?: ServiceCategory
  locationId?: string
  location?: Location
  createdAt: Date
  updatedAt: Date
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
  services?: Service[]
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description?: string
  sku?: string
  price: number
  cost?: number
  stockQty: number
  isActive: boolean
  categoryId?: string
  category?: ProductCategory
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
  products?: Product[]
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
  logoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  action: AuditAction
  resource: string
  resourceId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
  userId: string
  user?: User
  createdAt: Date
}

// Enums
export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF'

export type AppointmentStatus = 
  | 'SCHEDULED' 
  | 'CONFIRMED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface DashboardStats {
  totalCustomers: number
  totalAppointments: number
  completedTasks: number
  totalRevenue: number
  newCustomersThisMonth: number
  upcomingAppointments: number
  overdueTasks: number
  monthlyRevenue: number
}

export interface ChartData {
  name: string
  value: number
  date?: string
}

// Form Types
export interface CreateCustomerData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  dateOfBirth?: string
  notes?: string
  tags?: string[]
}

export interface CreateAppointmentData {
  title: string
  description?: string
  startTime: string
  endTime: string
  customerId: string
  employeeId: string
  serviceId?: string
  locationId?: string
  notes?: string
}

export interface CreateTaskData {
  title: string
  description?: string
  priority: Priority
  dueDate?: string
  assigneeId?: string
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: UserRole
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
  role: UserRole
  iat?: number
  exp?: number
}