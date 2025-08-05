import { z } from 'zod'
import type { UserRole, Priority, AppointmentStatus, TaskStatus } from '@/types'

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']).optional(),
})

// Customer validations
export const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default('US'),
  dateOfBirth: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Appointment validations
export const appointmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  customerId: z.string().min(1, 'Customer is required'),
  employeeId: z.string().min(1, 'Employee is required'),
  serviceId: z.string().optional(),
  locationId: z.string().optional(),
  notes: z.string().optional(),
})

// Task validations
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
})

// Service validations
export const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  price: z.number().min(0, 'Price must be non-negative'),
  categoryId: z.string().optional(),
  locationId: z.string().optional(),
})

// Location validations
export const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().default('US'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  mapUrl: z.string().optional(),
  description: z.string().optional(),
})

// Product validations
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  cost: z.number().min(0, 'Cost must be non-negative').optional(),
  stockQty: z.number().min(0, 'Stock quantity must be non-negative'),
  categoryId: z.string().optional(),
})

// Company settings validations
export const companySettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  timezone: z.string().default('UTC'),
  currency: z.string().default('USD'),
  logoUrl: z.string().optional(),
})

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean
  data?: T
  errors?: string[]
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => err.message) 
      }
    }
    return { 
      success: false, 
      errors: ['Validation failed'] 
    }
  }
}