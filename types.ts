// Authentication Types
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface JWTPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: string
  iat?: number
  exp?: number
}

// Application Types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
  dueDate?: string
  createdAt: string
  updatedAt: string
  assignee?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  metadata?: {
    task_title: string
    description?: string
    priority: {
      key: string
      value: string
    }
    status: {
      key: string
      value: string
    }
    assigned_to?: {
      id: string
      first_name?: string
      last_name?: string
      metadata?: {
        first_name: string
        last_name: string
      }
    }
    related_contact?: any
    related_company?: any
    related_deal?: any
    due_date?: string
    completed_date?: string
    category?: {
      key: string
      value: string
    }
  }
}

export interface User {
  id: string
  first_name?: string
  last_name?: string
  email: string
  metadata?: {
    first_name: string
    last_name: string
    email: string
    role: {
      key: string
      value: string
    }
    department?: string
    phone?: string
    profile_photo?: {
      url: string
      imgix_url: string
    }
    territory?: string
    is_active: boolean
  }
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  city?: string
  state?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface Appointment {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

// Cosmic CMS Types
export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  status: string
  created_at: string
  modified_at: string
  published_at?: string
  type: string
  metadata?: Record<string, any>
  thumbnail?: string
}

export interface CosmicUser extends CosmicObject {
  metadata: {
    first_name: string
    last_name: string
    email: string
    role: {
      key: string
      value: string
    }
    department?: string
    phone?: string
    profile_photo?: {
      url: string
      imgix_url: string
    }
    territory?: string
    is_active: boolean
  }
}

export interface CosmicContact extends CosmicObject {
  metadata: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    company?: CosmicCompany | string
    job_title?: string
    lead_source?: {
      key: string
      value: string
    }
    status: {
      key: string
      value: string
    }
    profile_photo?: {
      url: string
      imgix_url: string
    }
    notes?: string
    tags?: string
  }
}

export interface CosmicCompany extends CosmicObject {
  metadata: {
    company_name: string
    website?: string
    industry?: {
      key: string
      value: string
    }
    company_size?: {
      key: string
      value: string
    }
    annual_revenue?: number
    address?: {
      street: string
      city: string
      state: string
      zip: string
    }
    logo?: {
      url: string
      imgix_url: string
    }
    description?: string
    account_status: {
      key: string
      value: string
    }
  }
}

export interface CosmicDeal extends CosmicObject {
  metadata: {
    deal_name: string
    contact: CosmicContact | string
    company?: CosmicCompany | string
    deal_value?: number
    stage: {
      key: string
      value: string
    }
    probability?: number
    expected_close_date?: string
    actual_close_date?: string
    deal_source?: {
      key: string
      value: string
    }
    assigned_to?: CosmicUser | string
    notes?: string
    next_action?: string
  }
}

export interface CosmicTask extends CosmicObject {
  metadata: {
    task_title: string
    description?: string
    priority: {
      key: string
      value: string
    }
    status: {
      key: string
      value: string
    }
    assigned_to?: CosmicUser | string
    related_contact?: CosmicContact | string
    related_company?: CosmicCompany | string
    related_deal?: CosmicDeal | string
    due_date?: string
    completed_date?: string
    category?: {
      key: string
      value: string
    }
  }
}

export interface CosmicActivity extends CosmicObject {
  metadata: {
    activity_type: {
      key: string
      value: string
    }
    subject: string
    description?: string
    contact?: CosmicContact | string
    company?: CosmicCompany | string
    deal?: CosmicDeal | string
    activity_date: string
    duration?: number
    outcome?: {
      key: string
      value: string
    }
    assigned_to?: CosmicUser | string
    follow_up_required: boolean
    next_follow_up_date?: string
  }
}

// Dashboard Types
export interface DashboardStats {
  totalContacts: number
  totalDeals: number
  totalRevenue: number
  activeTasks: number
  dealsWon: number
  dealsLost: number
  avgDealValue: number
  conversionRate: number
}

// Form Types
export interface ContactForm {
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  job_title?: string
  lead_source?: string
  status: string
  notes?: string
  tags?: string
}

export interface CompanyForm {
  company_name: string
  website?: string
  industry?: string
  company_size?: string
  annual_revenue?: number
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  description?: string
  account_status: string
}

export interface DealForm {
  deal_name: string
  contact: string
  company?: string
  deal_value?: number
  stage: string
  probability?: number
  expected_close_date?: string
  deal_source?: string
  assigned_to?: string
  notes?: string
  next_action?: string
}

export interface TaskForm {
  task_title: string
  description?: string
  priority: string
  status: string
  assigned_to?: string
  related_contact?: string
  related_company?: string
  related_deal?: string
  due_date?: string
  category?: string
}

export interface ActivityForm {
  activity_type: string
  subject: string
  description?: string
  contact?: string
  company?: string
  deal?: string
  activity_date: string
  duration?: number
  outcome?: string
  assigned_to?: string
  follow_up_required: boolean
  next_follow_up_date?: string
}