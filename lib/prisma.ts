import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please add it to your .env file.\n' +
    'Example: DATABASE_URL="postgresql://username:password@localhost:5432/database_name"'
  )
}

// Log database URL for debugging (hide password)
const sanitizedUrl = process.env.DATABASE_URL.replace(/:([^:@]*?)@/, ':****@')
console.log('Connecting to database:', sanitizedUrl)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Enhanced database connection test with retry logic
async function testDatabaseConnection(retries = 3): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Testing database connection (attempt ${attempt}/${retries})...`)
      
      // Test basic connection
      await prisma.$connect()
      console.log('✅ Database connection successful')
      
      // Test if we can query (this will fail if schema is not migrated)
      try {
        await prisma.$queryRaw`SELECT COUNT(*) FROM "users"`
        console.log('✅ Database schema is accessible')
      } catch (schemaError) {
        console.warn('⚠️  Database connected but schema may not be migrated:', schemaError)
        console.warn('   Run: npx prisma migrate dev OR npx prisma db push')
      }
      
      return // Success, exit the retry loop
    } catch (error) {
      console.error(`❌ Database connection failed (attempt ${attempt}/${retries}):`, error)
      
      if (attempt === retries) {
        console.error('🚨 All database connection attempts failed!')
        console.error('Please check:')
        console.error('1. PostgreSQL is running')
        console.error('2. DATABASE_URL is correct in .env file')
        console.error('3. Database exists and is accessible')
        console.error('4. Run: npx prisma generate && npx prisma migrate dev')
        throw error
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

// Test connection on startup
testDatabaseConnection().catch((error) => {
  console.error('Failed to establish database connection:', error)
})

// Graceful shutdown
process.on('beforeExit', async () => {
  console.log('Disconnecting from database...')
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  console.log('Received SIGINT, disconnecting from database...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, disconnecting from database...')
  await prisma.$disconnect()
  process.exit(0)
})