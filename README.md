# CRM Pro - Complete Business Management Platform

A comprehensive CRM system built with Next.js 15, TypeScript, Prisma, PostgreSQL, and Cosmic CMS.

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL (running locally or remote)
- Cosmic CMS account (free at [cosmicjs.com](https://www.cosmicjs.com))

### 1. Install Dependencies

```bash
bun install
# or npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```bash
createdb crm_pro_db
```

3. Update your `.env` file:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/crm_pro_db"
```

#### Option B: Remote PostgreSQL (Recommended for production)

Update your `.env` with your remote PostgreSQL connection string:
```bash
DATABASE_URL="postgresql://username:password@host:5432/database_name"
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update the following variables in your `.env` file:

```bash
# Database (REQUIRED)
DATABASE_URL="postgresql://username:password@localhost:5432/crm_pro_db"

# Authentication (REQUIRED)
JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-characters-long"

# Cosmic CMS (REQUIRED for CRM data)
COSMIC_BUCKET_SLUG="your-cosmic-bucket-slug"
COSMIC_READ_KEY="your-cosmic-read-key"
COSMIC_WRITE_KEY="your-cosmic-write-key"
```

### 4. Database Migration & Seed

Run the complete database setup:

```bash
bun run db:setup
```

This command will:
- Generate Prisma client
- Run database migrations
- Seed the database with demo data

### 5. Start the Application

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign in with:

**Demo Accounts:**
- **Admin**: `admin@crmprodemp.com` / `password123`
- **Manager**: `manager@crmprodemp.com` / `password123`
- **Staff**: `staff@crmprodemp.com` / `password123`

## 🗃️ Database Commands

```bash
# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate

# Reset database (WARNING: This will delete all data)
bun run db:reset

# Seed database with demo data
bun run db:seed

# Open Prisma Studio (database GUI)
bun run db:studio

# Complete setup (generate + migrate + seed)
bun run db:setup
```

## 🌟 Features

### Core CRM Features
- **Dashboard** - Real-time analytics and insights
- **Contacts** - Contact management from Cosmic CMS
- **Companies** - Company profiles and information
- **Deals** - Sales pipeline management
- **Tasks** - Task tracking and assignment
- **Activities** - Activity timeline and history
- **Appointments** - Calendar and scheduling (PostgreSQL)
- **Customers** - Customer database (PostgreSQL)

### Technical Features
- **Authentication** - JWT-based auth with role-based access
- **Database** - PostgreSQL with Prisma ORM
- **CMS Integration** - Cosmic CMS for content management
- **TypeScript** - Full type safety
- **Responsive Design** - Works on all devices
- **Real-time Updates** - Live data synchronization

## 📊 Data Sources

This CRM uses a hybrid approach with two data sources:

### PostgreSQL Database
- User authentication and management
- Appointments and scheduling
- Customers and customer data
- Tasks and assignments
- Internal business operations

### Cosmic CMS
- Contacts and contact information
- Companies and company profiles
- Deals and sales pipeline
- Activities and activity tracking
- Content and media management

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **CMS**: Cosmic CMS
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/                 # Utility functions
│   ├── auth.ts          # Authentication utilities
│   ├── cosmic.ts        # Cosmic CMS client
│   └── prisma.ts        # Database client
├── prisma/              # Database schema and migrations
└── types.ts             # TypeScript definitions
```

## 🚦 Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running**:
```bash
# macOS/Linux
sudo service postgresql status

# or check if port 5432 is open
lsof -i :5432
```

2. **Verify DATABASE_URL**:
- Ensure the database exists
- Check username/password are correct
- Verify host and port are accessible

3. **Reset and rebuild**:
```bash
bun run db:reset
bun run db:setup
```

### Authentication Issues

1. **Check JWT_SECRET** is set in `.env`
2. **Clear browser cookies** and try again
3. **Verify demo accounts** exist by running:
```bash
bun run db:seed
```

### Cosmic CMS Issues

1. **Verify API keys** in `.env` file
2. **Check bucket slug** is correct
3. **Ensure data exists** in your Cosmic bucket

## 📝 Development

### Adding New Features

1. **Database changes**: Update `prisma/schema.prisma` and run migrations
2. **API routes**: Add new routes in `app/api/`
3. **UI components**: Create components in `components/`
4. **Pages**: Add new pages in `app/`

### Code Quality

```bash
# Type checking
bun run type-check

# Linting
bun run lint

# Build test
bun run build
```

## 🚀 Deployment

### Environment Variables for Production

Ensure these are set in your deployment environment:

```bash
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret-32+-chars"
COSMIC_BUCKET_SLUG="your-cosmic-bucket"
COSMIC_READ_KEY="your-cosmic-read-key"
COSMIC_WRITE_KEY="your-cosmic-write-key"
NODE_ENV="production"
```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app will automatically run migrations and optimizations for production.

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure your database and Cosmic CMS are properly configured
4. Check the console for specific error messages

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
```

## Summary of Changes Made

I've fixed several critical issues that were causing your "Database connection failed" error:

### Key Fixes:

1. **Enhanced Database Configuration**:
   - Added comprehensive error handling with specific error codes
   - Implemented connection retry logic
   - Added database schema validation
   - Improved connection debugging

2. **Updated Environment Files**:
   - Added proper Cosmic CMS configuration with your staging credentials
   - Included comprehensive setup instructions
   - Added troubleshooting guides

3. **Improved Authentication System**:
   - Better error messages for different database connection failures
   - Added schema validation before authentication attempts
   - Enhanced logging for debugging

4. **Added Database Seeding**:
   - Created demo accounts you can use to test the system
   - Added comprehensive sample data
   - Included proper setup scripts

5. **Updated Package Configuration**:
   - Added database setup scripts
   - Included type checking and build validation
   - Added Prisma seed configuration

### Next Steps:

1. **Update your `.env` file** with your actual PostgreSQL credentials
2. **Run the database setup**:
   ```bash
   bun run db:setup
   ```
3. **Start the development server**:
   ```bash
   bun run dev