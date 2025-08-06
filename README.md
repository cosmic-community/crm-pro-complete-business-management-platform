# CRM Pro - Complete Business Management Platform

A comprehensive CRM and business management platform built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- **Customer Management** - Complete customer profiles with contact information and history
- **Appointment Scheduling** - Calendar-based appointment booking and management
- **Task Management** - Kanban-style task board with priorities and assignments
- **User Authentication** - Secure JWT-based authentication with role-based access
- **Dashboard Analytics** - Revenue tracking and business insights
- **Multi-location Support** - Manage multiple business locations
- **Service Management** - Define and manage your business services
- **Product Catalog** - Inventory and product management
- **Audit Logging** - Track all system changes and user actions

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Git

### 1. Clone and Install

```bash
git clone <repository-url>
cd crm-pro-complete-business-management-platform
bun install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Windows - Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database and User**:
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE DATABASE crm_pro_db;
   CREATE USER crm_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE crm_pro_db TO crm_user;
   \q
   ```

#### Option B: Cloud Database

Use any PostgreSQL cloud service (AWS RDS, Google Cloud SQL, Supabase, etc.)

### 3. Environment Configuration

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Update .env file**:
   ```bash
   # Required: Update with your database credentials
   DATABASE_URL="postgresql://crm_user:your_secure_password@localhost:5432/crm_pro_db"
   
   # Required: Generate a secure JWT secret (32+ characters)
   JWT_SECRET="your-super-secure-jwt-secret-key-here-minimum-32-characters"
   ```

### 4. Database Migration and Seeding

```bash
# Generate Prisma client and run migrations
bun run db:setup

# OR run steps individually:
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run database migrations  
bun run db:seed      # Seed with demo data
```

### 5. Start Development Server

```bash
bun run dev
```

Visit `http://localhost:3000` and login with demo accounts:

- **Admin**: admin@crmprodemp.com / password123
- **Manager**: manager@crmprodemp.com / password123
- **Staff**: staff@crmprodemp.com / password123

## Troubleshooting

### Database Connection Issues

If you see "Database connection failed" errors:

1. **Check PostgreSQL is running**:
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql  # Linux
   brew services list | grep postgresql  # macOS
   ```

2. **Verify DATABASE_URL**:
   - Ensure the database exists: `psql -d crm_pro_db -c "SELECT 1;"`
   - Check username/password are correct
   - Verify the host and port (default: localhost:5432)

3. **Run database setup**:
   ```bash
   bun run db:generate  # Regenerate Prisma client
   bun run db:migrate   # Apply schema migrations
   ```

4. **Check database schema**:
   ```bash
   bun run db:studio    # Open Prisma Studio to inspect database
   ```

### Common Fixes

- **"relation does not exist"**: Run `bun run db:migrate`
- **"JWT_SECRET not defined"**: Add JWT_SECRET to your .env file
- **"prisma client not generated"**: Run `bun run db:generate`
- **Connection timeout**: Check if PostgreSQL is accepting connections

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run db:setup` - Complete database setup (generate + migrate + seed)
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run database migrations
- `bun run db:seed` - Seed database with demo data
- `bun run db:studio` - Open Prisma Studio
- `bun run db:reset` - Reset database (WARNING: deletes all data)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── register/
├── components/            # React components
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── ...
```

## Technologies Used

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **UI**: Tailwind CSS with Lucide React icons
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Validation**: Zod
- **Type Safety**: TypeScript

## License

This project is proprietary software. All rights reserved.
```

I've made several important fixes to resolve the database connection issues:

## Key Changes Made:

1. **Enhanced Database Connection Handling** (`lib/prisma.ts`):
   - Added DATABASE_URL validation on startup
   - Implemented retry logic for connection attempts
   - Added graceful shutdown handlers
   - Improved error logging and diagnostics
   - Added schema existence checks

2. **Improved Error Handling** (`app/api/auth/login/route.ts`):
   - Added specific error codes and messages for different database issues
   - Enhanced database connection testing with detailed feedback
   - Added schema validation checks
   - Better error reporting for development vs production

3. **Updated Environment Configuration** (`.env.example`):
   - Added detailed PostgreSQL setup instructions
   - Included database creation commands
   - Added troubleshooting steps

4. **Enhanced Package Scripts** (`package.json`):
   - Added database setup and management scripts
   - Included `postinstall` script to generate Prisma client automatically
   - Added `db:setup` command for one-step database initialization

5. **Comprehensive README** with troubleshooting guide

## To Fix Your Database Connection Issue:

1. **Check if PostgreSQL is running**:
   ```bash
   sudo systemctl status postgresql  # Linux
   brew services start postgresql    # macOS
   ```

2. **Verify your .env file has the correct DATABASE_URL**:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

3. **Run the database setup**:
   ```bash
   bun run db:setup
   ```

4. **Test the connection**:
   ```bash
   bun run dev