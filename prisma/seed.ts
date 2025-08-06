import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Hash password for demo accounts
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@crmprodemp.com' },
    update: {},
    create: {
      email: 'admin@crmprodemp.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    },
  })

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@crmprodemp.com' },
    update: {},
    create: {
      email: 'manager@crmprodemp.com',
      password: hashedPassword,
      firstName: 'Manager',
      lastName: 'User',
      role: UserRole.MANAGER,
      isActive: true,
    },
  })

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@crmprodemp.com' },
    update: {},
    create: {
      email: 'staff@crmprodemp.com',
      password: hashedPassword,
      firstName: 'Staff',
      lastName: 'User',
      role: UserRole.STAFF,
      isActive: true,
    },
  })

  // Create demo customers
  const customer1 = await prisma.customer.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      notes: 'VIP customer',
      tags: ['vip', 'regular'],
      isActive: true,
    },
  })

  const customer2 = await prisma.customer.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'US',
      notes: 'New customer',
      tags: ['new'],
      isActive: true,
    },
  })

  // Create demo company settings
  await prisma.companySettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'CRM Pro Demo Company',
      email: 'contact@crmprodemp.com',
      phone: '+1 (555) 000-0000',
      address: '789 Business Blvd, Suite 100',
      timezone: 'America/New_York',
      currency: 'USD',
    },
  })

  // Create demo locations
  const location1 = await prisma.location.create({
    data: {
      name: 'Main Office',
      address: '789 Business Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      phone: '+1 (555) 000-0000',
      email: 'main@crmprodemp.com',
      isActive: true,
    },
  })

  // Create demo service categories
  const serviceCategory1 = await prisma.serviceCategory.create({
    data: {
      name: 'Consultation',
      description: 'Professional consultation services',
      isActive: true,
    },
  })

  // Create demo services
  const service1 = await prisma.service.create({
    data: {
      name: 'Business Consultation',
      description: '1-hour business consultation session',
      duration: 60,
      price: 150.00,
      isActive: true,
      categoryId: serviceCategory1.id,
      locationId: location1.id,
    },
  })

  // Create demo product categories
  const productCategory1 = await prisma.productCategory.create({
    data: {
      name: 'Software',
      description: 'Software products and licenses',
      isActive: true,
    },
  })

  // Create demo products
  await prisma.product.create({
    data: {
      name: 'CRM Pro License',
      description: 'Annual CRM Pro software license',
      sku: 'CRM-PRO-001',
      price: 99.99,
      cost: 50.00,
      stockQty: 100,
      isActive: true,
      categoryId: productCategory1.id,
    },
  })

  // Create demo appointments
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)

  const appointmentEnd = new Date(tomorrow)
  appointmentEnd.setHours(11, 0, 0, 0)

  await prisma.appointment.create({
    data: {
      title: 'Business Consultation',
      description: 'Initial consultation with John Doe',
      startTime: tomorrow,
      endTime: appointmentEnd,
      status: 'SCHEDULED',
      customerId: customer1.id,
      employeeId: managerUser.id,
      serviceId: service1.id,
      locationId: location1.id,
    },
  })

  // Create demo tasks
  const taskDueDate = new Date()
  taskDueDate.setDate(taskDueDate.getDate() + 3)

  await prisma.task.create({
    data: {
      title: 'Follow up with John Doe',
      description: 'Call John Doe to discuss consultation outcomes',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: taskDueDate,
      assigneeId: staffUser.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Prepare monthly report',
      description: 'Compile and prepare the monthly business report',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: taskDueDate,
      assigneeId: managerUser.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📝 Demo Accounts Created:')
  console.log('👤 Admin: admin@crmprodemp.com / password123')
  console.log('👤 Manager: manager@crmprodemp.com / password123')
  console.log('👤 Staff: staff@crmprodemp.com / password123')
  console.log('\n🎯 You can now sign in with any of these accounts!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })