import { PrismaClient, UserRole, AppointmentStatus, TaskStatus, Priority } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.service.deleteMany()
  await prisma.serviceCategory.deleteMany()
  await prisma.product.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.location.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.user.deleteMany()
  await prisma.companySettings.deleteMany()

  // Create company settings
  await prisma.companySettings.create({
    data: {
      companyName: 'CRM Pro Demo',
      email: 'admin@crmprodemp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business St, Suite 100, City, ST 12345',
      timezone: 'America/New_York',
      currency: 'USD',
    },
  })

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@crmprodemp.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  })

  const manager = await prisma.user.create({
    data: {
      email: 'manager@crmprodemp.com',
      password: hashedPassword,
      firstName: 'Manager',
      lastName: 'Smith',
      role: UserRole.MANAGER,
    },
  })

  const staff = await prisma.user.create({
    data: {
      email: 'staff@crmprodemp.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.STAFF,
    },
  })

  // Create locations
  const location1 = await prisma.location.create({
    data: {
      name: 'Main Office',
      address: '123 Business St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 (555) 123-4567',
      email: 'main@crmprodemp.com',
    },
  })

  const location2 = await prisma.location.create({
    data: {
      name: 'Branch Office',
      address: '456 Commerce Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      phone: '+1 (555) 987-6543',
      email: 'branch@crmprodemp.com',
    },
  })

  // Create service categories
  const serviceCategory1 = await prisma.serviceCategory.create({
    data: {
      name: 'Consulting',
      description: 'Business consulting services',
    },
  })

  const serviceCategory2 = await prisma.serviceCategory.create({
    data: {
      name: 'Support',
      description: 'Customer support services',
    },
  })

  // Create services
  await prisma.service.createMany({
    data: [
      {
        name: 'Business Consultation',
        description: 'Strategic business planning and consultation',
        duration: 60,
        price: 150.00,
        categoryId: serviceCategory1.id,
        locationId: location1.id,
      },
      {
        name: 'Technical Support',
        description: 'Technical support and troubleshooting',
        duration: 30,
        price: 75.00,
        categoryId: serviceCategory2.id,
        locationId: location1.id,
      },
      {
        name: 'Project Management',
        description: 'End-to-end project management services',
        duration: 120,
        price: 250.00,
        categoryId: serviceCategory1.id,
        locationId: location2.id,
      },
    ],
  })

  // Create product categories
  const productCategory1 = await prisma.productCategory.create({
    data: {
      name: 'Software',
      description: 'Software products and licenses',
    },
  })

  const productCategory2 = await prisma.productCategory.create({
    data: {
      name: 'Hardware',
      description: 'Hardware products and accessories',
    },
  })

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'CRM Pro License',
        description: 'Annual CRM Pro software license',
        sku: 'CRM-PRO-001',
        price: 99.99,
        cost: 30.00,
        stockQty: 1000,
        categoryId: productCategory1.id,
      },
      {
        name: 'Business Phone System',
        description: 'Complete business phone system setup',
        sku: 'PHONE-SYS-001',
        price: 299.99,
        cost: 150.00,
        stockQty: 50,
        categoryId: productCategory2.id,
      },
      {
        name: 'Training Package',
        description: 'Comprehensive CRM training for teams',
        sku: 'TRAIN-PKG-001',
        price: 199.99,
        cost: 50.00,
        stockQty: 100,
        categoryId: productCategory1.id,
      },
    ],
  })

  // Create customers
  const customers = await prisma.customer.createMany({
    data: [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1 (555) 111-1111',
        address: '789 Customer Lane',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        notes: 'VIP customer, prefers morning appointments',
        tags: ['VIP', 'Consulting'],
      },
      {
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob.williams@email.com',
        phone: '+1 (555) 222-2222',
        address: '321 Client Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90211',
        notes: 'Interested in project management services',
        tags: ['Project Management'],
      },
      {
        firstName: 'Carol',
        lastName: 'Brown',
        email: 'carol.brown@email.com',
        phone: '+1 (555) 333-3333',
        address: '654 Business Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        notes: 'Regular support customer',
        tags: ['Support', 'Regular'],
      },
      {
        firstName: 'David',
        lastName: 'Davis',
        email: 'david.davis@email.com',
        phone: '+1 (555) 444-4444',
        address: '987 Corporate Way',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        notes: 'Potential enterprise client',
        tags: ['Enterprise', 'Lead'],
      },
      {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@email.com',
        phone: '+1 (555) 555-5555',
        address: '147 Professional Ave',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        notes: 'Interested in training programs',
        tags: ['Training', 'New'],
      },
    ],
  })

  const customerList = await prisma.customer.findMany()
  const serviceList = await prisma.service.findMany()

  // Create appointments
  const now = new Date()
  const appointments = []

  for (let i = 0; i < 15; i++) {
    const appointmentDate = new Date(now)
    appointmentDate.setDate(now.getDate() + Math.floor(Math.random() * 30) - 15) // -15 to +15 days
    appointmentDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0) // 9 AM to 5 PM
    
    const customer = customerList[Math.floor(Math.random() * customerList.length)]
    const service = serviceList[Math.floor(Math.random() * serviceList.length)]
    const employee = [admin, manager, staff][Math.floor(Math.random() * 3)]
    
    const endTime = new Date(appointmentDate)
    endTime.setMinutes(appointmentDate.getMinutes() + service.duration)

    appointments.push({
      title: `${service.name} - ${customer.firstName} ${customer.lastName}`,
      description: `Appointment for ${service.name}`,
      startTime: appointmentDate,
      endTime,
      status: Math.random() > 0.8 ? AppointmentStatus.CANCELLED : 
              Math.random() > 0.6 ? AppointmentStatus.COMPLETED :
              AppointmentStatus.SCHEDULED,
      customerId: customer.id,
      employeeId: employee.id,
      serviceId: service.id,
      locationId: service.locationId,
    })
  }

  await prisma.appointment.createMany({
    data: appointments,
  })

  // Create tasks
  const tasks = [
    {
      title: 'Follow up with Alice Johnson',
      description: 'Schedule follow-up consultation meeting',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      assigneeId: manager.id,
    },
    {
      title: 'Prepare quarterly report',
      description: 'Compile and analyze Q4 performance data',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      assigneeId: admin.id,
    },
    {
      title: 'Update customer database',
      description: 'Clean and update customer contact information',
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      assigneeId: staff.id,
    },
    {
      title: 'Setup new location',
      description: 'Configure systems for new branch office',
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      assigneeId: manager.id,
    },
    {
      title: 'Customer satisfaction survey',
      description: 'Send out quarterly customer satisfaction survey',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      assigneeId: staff.id,
    },
  ]

  await prisma.task.createMany({
    data: tasks,
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })