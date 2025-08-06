import { z } from 'zod'

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales_manager', 'sales_rep', 'marketing']).default('sales_rep'),
})

// Contact validation schema
export const contactSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
  lead_source: z.string().optional(),
  status: z.enum(['lead', 'prospect', 'customer', 'lost']),
  notes: z.string().optional(),
  tags: z.string().optional(),
})

// Customer validation schema
export const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

// Company validation schema
export const companySchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  annual_revenue: z.number().positive().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }).optional(),
  description: z.string().optional(),
  account_status: z.enum(['active', 'inactive', 'prospect']),
})

// Deal validation schema
export const dealSchema = z.object({
  deal_name: z.string().min(1, 'Deal name is required'),
  contact: z.string().min(1, 'Contact is required'),
  company: z.string().optional(),
  deal_value: z.number().positive().optional(),
  stage: z.enum(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
  probability: z.number().min(0).max(100).optional(),
  expected_close_date: z.string().optional(),
  deal_source: z.string().optional(),
  assigned_to: z.string().optional(),
  notes: z.string().optional(),
  next_action: z.string().optional(),
})

// Task validation schema
export const taskSchema = z.object({
  task_title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']),
  assigned_to: z.string().optional(),
  related_contact: z.string().optional(),
  related_company: z.string().optional(),
  related_deal: z.string().optional(),
  due_date: z.string().optional(),
  category: z.enum(['follow_up', 'demo', 'proposal', 'contract']).optional(),
})

// Activity validation schema
export const activitySchema = z.object({
  activity_type: z.enum(['call', 'email', 'meeting', 'demo', 'follow_up']),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  contact: z.string().optional(),
  company: z.string().optional(),
  deal: z.string().optional(),
  activity_date: z.string().min(1, 'Activity date is required'),
  duration: z.number().positive().optional(),
  outcome: z.string().optional(),
  assigned_to: z.string().optional(),
  follow_up_required: z.boolean().default(false),
  next_follow_up_date: z.string().optional(),
})

// Appointment validation schema
export const appointmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
})

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors = result.error.errors.map((err: z.ZodIssue) => {
    return err.message
  })
  return { success: false, errors }
}

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type CustomerFormData = z.infer<typeof customerSchema>
export type CompanyFormData = z.infer<typeof companySchema>
export type DealFormData = z.infer<typeof dealSchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type ActivityFormData = z.infer<typeof activitySchema>
export type AppointmentFormData = z.infer<typeof appointmentSchema>