import { createBucketClient } from '@cosmicjs/sdk'

// Validate required environment variables
if (!process.env.COSMIC_BUCKET_SLUG) {
  throw new Error('COSMIC_BUCKET_SLUG environment variable is required')
}

if (!process.env.COSMIC_READ_KEY) {
  throw new Error('COSMIC_READ_KEY environment variable is required')
}

// Create the Cosmic client
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY, // Optional for read-only operations
})

// TypeScript interfaces for Cosmic CRM data
export interface CosmicContact {
  id: string
  slug: string
  title: string
  metadata: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    company?: {
      id: string
      slug: string
      title: string
      metadata: {
        company_name: string
        website?: string
        industry?: { key: string; value: string }
        company_size?: { key: string; value: string }
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
        account_status: { key: string; value: string }
      }
    }
    job_title?: string
    lead_source?: { key: string; value: string }
    status: { key: string; value: string }
    profile_photo?: {
      url: string
      imgix_url: string
    }
    notes?: string
    tags?: string
  }
}

export interface CosmicCompany {
  id: string
  slug: string
  title: string
  metadata: {
    company_name: string
    website?: string
    industry?: { key: string; value: string }
    company_size?: { key: string; value: string }
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
    account_status: { key: string; value: string }
  }
}

export interface CosmicDeal {
  id: string
  slug: string
  title: string
  metadata: {
    deal_name: string
    contact: {
      id: string
      slug: string
      title: string
      metadata: {
        first_name: string
        last_name: string
        email: string
        phone?: string
        job_title?: string
        status: { key: string; value: string }
      }
    }
    company?: {
      id: string
      slug: string
      title: string
      metadata: {
        company_name: string
        industry?: { key: string; value: string }
      }
    }
    deal_value?: number
    stage: { key: string; value: string }
    probability?: number
    expected_close_date?: string
    actual_close_date?: string | null
    deal_source?: { key: string; value: string }
    assigned_to?: {
      id: string
      slug: string
      title: string
      metadata: {
        first_name: string
        last_name: string
        email: string
        role: { key: string; value: string }
      }
    }
    notes?: string
    next_action?: string
  }
}

export interface CosmicTask {
  id: string
  slug: string
  title: string
  metadata: {
    task_title: string
    description?: string
    priority: { key: string; value: string }
    status: { key: string; value: string }
    assigned_to?: {
      id: string
      slug: string
      title: string
      metadata: {
        first_name: string
        last_name: string
        email: string
        role: { key: string; value: string }
      }
    }
    related_contact?: CosmicContact
    related_company?: CosmicCompany
    related_deal?: CosmicDeal
    due_date?: string
    completed_date?: string | null
    category?: { key: string; value: string }
  }
}

export interface CosmicUser {
  id: string
  slug: string
  title: string
  metadata: {
    first_name: string
    last_name: string
    email: string
    role: { key: string; value: string }
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

export interface CosmicActivity {
  id: string
  slug: string
  title: string
  metadata: {
    activity_type: { key: string; value: string }
    subject: string
    description?: string
    contact?: CosmicContact
    company?: CosmicCompany
    deal?: CosmicDeal
    activity_date: string
    duration?: number
    outcome?: { key: string; value: string }
    assigned_to?: CosmicUser
    follow_up_required: boolean
    next_follow_up_date?: string
  }
}

// Helper functions for Cosmic CMS operations
export const cosmicOperations = {
  // Contacts
  async getContacts(params?: { limit?: number; skip?: number }) {
    try {
      const { objects } = await cosmic.objects
        .find({ type: 'contacts' })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
        .limit(params?.limit || 50)
        .skip(params?.skip || 0)
      
      return objects as CosmicContact[]
    } catch (error: any) {
      if (error.status === 404) {
        return []
      }
      throw error
    }
  },

  async getContact(slug: string) {
    try {
      const { object } = await cosmic.objects
        .findOne({ type: 'contacts', slug })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
      
      return object as CosmicContact
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  // Companies
  async getCompanies(params?: { limit?: number; skip?: number }) {
    try {
      const { objects } = await cosmic.objects
        .find({ type: 'companies' })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
        .limit(params?.limit || 50)
        .skip(params?.skip || 0)
      
      return objects as CosmicCompany[]
    } catch (error: any) {
      if (error.status === 404) {
        return []
      }
      throw error
    }
  },

  async getCompany(slug: string) {
    try {
      const { object } = await cosmic.objects
        .findOne({ type: 'companies', slug })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
      
      return object as CosmicCompany
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  // Deals
  async getDeals(params?: { limit?: number; skip?: number }) {
    try {
      const { objects } = await cosmic.objects
        .find({ type: 'deals' })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
        .limit(params?.limit || 50)
        .skip(params?.skip || 0)
      
      return objects as CosmicDeal[]
    } catch (error: any) {
      if (error.status === 404) {
        return []
      }
      throw error
    }
  },

  async getDeal(slug: string) {
    try {
      const { object } = await cosmic.objects
        .findOne({ type: 'deals', slug })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
      
      return object as CosmicDeal
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  // Tasks (from Cosmic CMS)
  async getCosmicTasks(params?: { limit?: number; skip?: number }) {
    try {
      const { objects } = await cosmic.objects
        .find({ type: 'tasks' })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
        .limit(params?.limit || 50)
        .skip(params?.skip || 0)
      
      return objects as CosmicTask[]
    } catch (error: any) {
      if (error.status === 404) {
        return []
      }
      throw error
    }
  },

  async getCosmicTask(slug: string) {
    try {
      const { object } = await cosmic.objects
        .findOne({ type: 'tasks', slug })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
      
      return object as CosmicTask
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  // Users (from Cosmic CMS)
  async getCosmicUsers(params?: { limit?: number; skip?: number }) {
    try {
      const { objects } = await cosmic.objects
        .find({ type: 'users' })
        .props(['id', 'title', 'slug', 'metadata'])
        .limit(params?.limit || 50)
        .skip(params?.skip || 0)
      
      return objects as CosmicUser[]
    } catch (error: any) {
      if (error.status === 404) {
        return []
      }
      throw error
    }
  },

  async getCosmicUser(slug: string) {
    try {
      const { object } = await cosmic.objects
        .findOne({ type: 'users', slug })
        .props(['id', 'title', 'slug', 'metadata'])
      
      return object as CosmicUser
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  // Activities
  async getActivities(params?: { limit?: number; skip?: number }) {
    try {
      const { objects } = await cosmic.objects
        .find({ type: 'activities' })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
        .limit(params?.limit || 50)
        .skip(params?.skip || 0)
      
      return objects as CosmicActivity[]
    } catch (error: any) {
      if (error.status === 404) {
        return []
      }
      throw error
    }
  },

  async getActivity(slug: string) {
    try {
      const { object } = await cosmic.objects
        .findOne({ type: 'activities', slug })
        .props(['id', 'title', 'slug', 'metadata'])
        .depth(1)
      
      return object as CosmicActivity
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  // General search across all types - removed .search() as it's not available in current SDK
  async searchContent(query: string, types: string[] = ['contacts', 'companies', 'deals']) {
    const results: any[] = []
    
    // Instead of using .search(), we'll use basic filtering
    // This is a workaround until the search method is available in the SDK
    for (const type of types) {
      try {
        const { objects } = await cosmic.objects
          .find({ type })
          .props(['id', 'title', 'slug', 'metadata', 'type'])
          .limit(10)
        
        // Filter results on the client side for now
        const filtered = objects.filter((obj: any) => 
          obj.title?.toLowerCase().includes(query.toLowerCase()) ||
          JSON.stringify(obj.metadata).toLowerCase().includes(query.toLowerCase())
        )
        
        results.push(...filtered)
      } catch (error) {
        // Continue searching other types even if one fails
        console.warn(`Search failed for type ${type}:`, error)
      }
    }
    
    return results
  }
}

// Export the cosmic client and operations
export default cosmic