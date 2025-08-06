import { PrismaClient, UserRole, AppointmentStatus, TaskStatus, Priority } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data (optional - uncomment if needed)
  // console.log('🧹 Cleaning existing data...')
  // await prisma.auditLog.deleteMany({})
  // await prisma.appointment.deleteMany({})
  // await prisma.task.deleteMany({})
  // await prisma.product.deleteMany({})
  // await prisma.service.deleteMany({})
  // await prisma.customer.deleteMany({})
  // await prisma.user.deleteMany({})
  // await prisma.location.deleteMany({})
  // await prisma.serviceCategory.deleteMany({})
  // await prisma.productCategory.deleteMany({})
  // await prisma.companySettings.deleteMany({})

  // Create Company Settings
  console.log('🏢 Creating company settings...')
  await prisma.companySettings.upsert({
    where: { id: 'company-1' },
    update: {},
    create: {
      id: 'company-1',
      companyName: 'CRM Pro Business Solutions',
      email: 'admin@crmprodemp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Suite 100, New York, NY 10001',
      timezone: 'America/New_York',
      currency: 'USD',
      logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&auto=format,compress',
    },
  })

  // Create Users
  console.log('👥 Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@crmprodemp.com' },
    update: {},
    create: {
      email: 'admin@crmprodemp.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@crmprodemp.com' },
    update: {},
    create: {
      email: 'manager@crmprodemp.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Manager',
      role: UserRole.MANAGER,
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: 'staff@crmprodemp.com' },
    update: {},
    create: {
      email: 'staff@crmprodemp.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Staff',
      role: UserRole.STAFF,
    },
  })

  // Create Locations
  console.log('📍 Creating locations...')
  const mainLocation = await prisma.location.upsert({
    where: { id: 'location-1' },
    update: {},
    create: {
      id: 'location-1',
      name: 'Main Office',
      address: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 (555) 123-4567',
      email: 'main@crmprodemp.com',
      description: 'Our primary business location',
      mapUrl: 'https://maps.google.com',
    },
  })

  const branchLocation = await prisma.location.upsert({
    where: { id: 'location-2' },
    update: {},
    create: {
      id: 'location-2',
      name: 'Branch Office',
      address: '456 Commerce St',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      phone: '+1 (555) 987-6543',
      email: 'branch@crmprodemp.com',
      description: 'Secondary business location',
      mapUrl: 'https://maps.google.com',
    },
  })

  // Create Service Categories
  console.log('🏷️ Creating service categories...')
  const consultingCategory = await prisma.serviceCategory.upsert({
    where: { id: 'service-cat-1' },
    update: {},
    create: {
      id: 'service-cat-1',
      name: 'Business Consulting',
      description: 'Professional business advisory services',
    },
  })

  const supportCategory = await prisma.serviceCategory.upsert({
    where: { id: 'service-cat-2' },
    update: {},
    create: {
      id: 'service-cat-2',
      name: 'Technical Support',
      description: 'IT and technical assistance services',
    },
  })

  // Create Services
  console.log('🛠️ Creating services...')
  await prisma.service.upsert({
    where: { id: 'service-1' },
    update: {},
    create: {
      id: 'service-1',
      name: 'Business Strategy Consultation',
      description: 'Comprehensive business strategy and planning session',
      duration: 120, // 2 hours
      price: 299.99,
      categoryId: consultingCategory.id,
      locationId: mainLocation.id,
    },
  })

  await prisma.service.upsert({
    where: { id: 'service-2' },
    update: {},
    create: {
      id: 'service-2',
      name: 'Technical Setup & Support',
      description: 'Complete technical system setup and ongoing support',
      duration: 60, // 1 hour
      price: 149.99,
      categoryId: supportCategory.id,
      locationId: mainLocation.id,
    },
  })

  // Create Product Categories
  console.log('📦 Creating product categories...')
  const softwareCategory = await prisma.productCategory.upsert({
    where: { id: 'product-cat-1' },
    update: {},
    create: {
      id: 'product-cat-1',
      name: 'Software Solutions',
      description: 'Business software and digital products',
    },
  })

  // Create Products
  console.log('💼 Creating products...')
  await prisma.product.upsert({
    where: { id: 'product-1' },
    update: {},
    create: {
      id: 'product-1',
      name: 'CRM Pro License',
      description: 'Annual license for CRM Pro software',
      sku: 'CRM-PRO-001',
      price: 999.99,
      cost: 299.99,
      stockQty: 100,
      categoryId: softwareCategory.id,
    },
  })

  await prisma.product.upsert({
    where: { id: 'product-2' },
    update: {},
    create: {
      id: 'product-2',
      name: 'Business Analytics Module',
      description: 'Advanced analytics and reporting add-on',
      sku: 'CRM-ANA-001',
      price: 499.99,
      cost: 149.99,
      stockQty: 50,
      categoryId: softwareCategory.id,
    },
  })

  // Create Customers
  console.log('👤 Creating customers...')
  const customer1 = await prisma.customer.upsert({
    where: { id: 'customer-1' },
    update: {},
    create: {
      id: 'customer-1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1 (555) 111-2222',
      address: '789 Customer Lane',
      city: 'Manhattan',
      state: 'NY',
      zipCode: '10003',
      dateOfBirth: new Date('1985-06-15'),
      notes: 'VIP customer, prefers morning appointments',
      tags: ['VIP', 'Consulting'],
    },
  })

  const customer2 = await prisma.customer.upsert({
    where: { id: 'customer-2' },
    update: {},
    create: {
      id: 'customer-2',
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@example.com',
      phone: '+1 (555) 333-4444',
      address: '456 Client Street',
      city: 'Queens',
      state: 'NY',
      zipCode: '11375',
      dateOfBirth: new Date('1978-09-22'),
      notes: 'Interested in technical services',
      tags: ['Technical', 'Support'],
    },
  })

  const customer3 = await prisma.customer.upsert({
    where: { id: 'customer-3' },
    update: {},
    create: {
      id: 'customer-3',
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@example.com',
      phone: '+1 (555) 555-6666',
      address: '321 Business Blvd',
      city: 'Bronx',
      state: 'NY',
      zipCode: '10458',
      dateOfBirth: new Date('1990-03-10'),
      notes: 'Startup founder, needs comprehensive business consulting',
      tags: ['Startup', 'Consulting', 'Priority'],
    },
  })

  // Create Appointments
  console.log('📅 Creating appointments...')
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  await prisma.appointment.upsert({
    where: { id: 'appointment-1' },
    update: {},
    create: {
      id: 'appointment-1',
      title: 'Business Strategy Session',
      description: 'Initial consultation for business strategy development',
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
      status: AppointmentStatus.SCHEDULED,
      customerId: customer1.id,
      employeeId: manager.id,
      serviceId: 'service-1',
      locationId: mainLocation.id,
      notes: 'Prepare business analysis documents',
    },
  })

  const dayAfterTomorrow = new Date(now)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  await prisma.appointment.upsert({
    where: { id: 'appointment-2' },
    update: {},
    create: {
      id: 'appointment-2',
      title: 'Technical Support Session',
      description: 'System setup and technical configuration',
      startTime: new Date(dayAfterTomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(dayAfterTomorrow.setHours(15, 0, 0, 0)),
      status: AppointmentStatus.CONFIRMED,
      customerId: customer2.id,
      employeeId: staff.id,
      serviceId: 'service-2',
      locationId: mainLocation.id,
      notes: 'Bring technical requirements document',
    },
  })

  // Create Tasks
  console.log('✅ Creating tasks...')
  await prisma.task.upsert({
    where: { id: 'task-1' },
    update: {},
    create: {
      id: 'task-1',
      title: 'Prepare quarterly business report',
      description: 'Compile Q4 business performance metrics and analysis',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      assigneeId: manager.id,
    },
  })

  await prisma.task.upsert({
    where: { id: 'task-2' },
    update: {},
    create: {
      id: 'task-2',
      title: 'Update customer database',
      description: 'Clean and update customer contact information',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      assigneeId: staff.id,
    },
  })

  await prisma.task.upsert({
    where: { id: 'task-3' },
    update: {},
    create: {
      id: 'task-3',
      title: 'System backup verification',
      description: 'Verify all system backups are working correctly',
      status: TaskStatus.COMPLETED,
      priority: Priority.URGENT,
      dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      completedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      assigneeId: admin.id,
    },
  })

  console.log('✨ Database seeding completed successfully!')
  console.log('')
  console.log('Demo Login Credentials:')
  console.log('👑 Admin: admin@crmprodemp.com / password123')
  console.log('👤 Manager: manager@crmprodemp.com / password123')
  console.log('🧑‍💼 Staff: staff@crmprodemp.com / password123')
  console.log('')
  console.log('Created:')
  console.log('• 3 Users (Admin, Manager, Staff)')
  console.log('• 3 Customers with contact details')
  console.log('• 2 Business locations')
  console.log('• 2 Service categories with services')
  console.log('• 1 Product category with products')
  console.log('• 2 Scheduled appointments')
  console.log('• 3 Tasks (various statuses)')
  console.log('• Company settings configured')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during database seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })