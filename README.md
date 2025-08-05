# CRM Pro - Complete Business Management Platform

![CRM Pro Dashboard](https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=300&fit=crop&auto=format)

A comprehensive, production-ready CRM application built with Next.js 15, PostgreSQL, and modern web technologies. Manage customers, appointments, tasks, and business analytics all in one powerful platform.

## ✨ Features

- **📊 Interactive Dashboard** - Real-time KPIs, charts, and business metrics
- **👥 Customer Management** - Complete CRUD operations with advanced search and filtering
- **📅 Smart Calendar** - Appointment scheduling with automated email reminders
- **✅ Task Management** - Kanban boards with priority levels and team assignment
- **🏢 Multi-Location Support** - Manage multiple office locations and branches
- **👤 Employee Management** - Role-based access control with detailed permissions
- **🛍️ Services & Products** - Catalog management with pricing and categorization
- **🔗 Booking Widget** - Embeddable widget for external websites
- **📈 Advanced Reports** - Interactive analytics with CSV/PDF export
- **🔐 Enterprise Security** - JWT authentication with audit logging
- **📱 Mobile Responsive** - Optimized for all device sizes

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=68928f6254b8038efaf579a2&clone_repository=6892944b54b8038efaf579a7)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Build a complete, production-ready, full-stack CRM application with the following requirements:
> 
> • Tech stack:
>   – Frontend: React (or Next.js) with Tailwind CSS for styling
>   – Backend: Node.js with Express (or a serverless API)
>   – Database: PostgreSQL (or MongoDB)  
>   – Authentication: JWT-based, with email/password signup, login, logout, password reset, and profile management
> 
> • Core modules:
>   1. Dashboard  
>      – Display key KPIs (new customers, upcoming appointments, overdue tasks, revenue, etc.)  
>      – Charts for sales, appointments, and task trends  
> 
>   2. Customers  
>      – CRUD customer records (contact info, notes, tags)  
>      – Search, filter, and import/export  
> 
>   3. Appointments  
>      – Calendar view (day/week/month)  
>      – Schedule, reschedule, cancel appointments  
>      – Email reminders  
> 
>   4. Tasks  
>      – CRUD tasks with status, priority, due dates  
>      – Assign to employees  
> 
>   5. Locations  
>      – CRUD office/branch locations with address and map link  
> 
>   6. Employees  
>      – CRUD employee profiles  
>      – Role-based access control (admin, manager, staff)  
> 
>   7. Services & Products  
>      – CRUD services and products with pricing  
>      – Categorization  
> 
>   8. Booking Widget  
>      – Embeddable widget customers can use on external sites to book appointments  
>      – Configurable by service, location, employee, and availability  
> 
>   9. Reports & Analytics  
>      – Pre-built reports (sales by period, appointment no-shows, task completion)  
>      – Export to CSV/PDF  
>      – Interactive charts  
> 
>   10. Settings & Security  
>      – Company info, timezone, currency  
>      – User roles & permissions  
>      – Audit logs  
> 
> • Extras:
>   – Responsive design for desktop and mobile  
>   – Seed sample data for customers, appointments, tasks  
>   – Clear folder structure and README with setup steps  
>   – Environment variable configuration  
> 
> Generate the full codebase scaffolding, all API endpoints, React pages/components, database schema/migrations, and instructions to run locally (npm install, migrate, npm run dev).

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🚀 Technologies Used

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Email**: Resend for transactional emails
- **Charts**: Recharts for data visualization
- **Calendar**: React Big Calendar for appointment scheduling
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React icon library

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- Bun package manager installed
- PostgreSQL database running
- Email service account (Resend recommended)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm-pro
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/crm_pro"
   
   # JWT Secret (generate a secure random string)
   JWT_SECRET="your-jwt-secret-key-minimum-32-characters"
   
   # Email Service
   RESEND_API_KEY="your-resend-api-key"
   
   # App Configuration
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   bun prisma generate
   
   # Run database migrations
   bun prisma migrate dev
   
   # Seed the database with sample data
   bun prisma db seed
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Users** - Employee accounts with role-based permissions
- **Customers** - Customer records with contact information and notes
- **Appointments** - Scheduled meetings with customers and services
- **Tasks** - Actionable items with priorities and assignments
- **Locations** - Business locations and branches
- **Services** - Available services with pricing
- **Products** - Product catalog with inventory tracking
- **Audit Logs** - Security and activity tracking

## 🔐 Authentication & Security

- JWT-based authentication with secure token handling
- Role-based access control (Admin, Manager, Staff)
- Password hashing with bcrypt
- Protected API routes with middleware validation
- Audit logging for security monitoring
- Session management with automatic token refresh

## 📧 Email Integration

The application includes automated email notifications for:

- Welcome emails for new user registrations
- Appointment confirmations and reminders
- Password reset instructions
- Task assignment notifications
- Important system alerts

## 📱 Responsive Design

- Fully responsive design optimized for desktop, tablet, and mobile
- Touch-friendly interface elements
- Adaptive navigation and layout
- Mobile-optimized data tables and forms

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up PostgreSQL database (Vercel Postgres or external)
4. Deploy with automatic CI/CD

### Traditional Hosting
1. Build the application: `bun run build`
2. Start production server: `bun start`
3. Configure reverse proxy (nginx recommended)
4. Set up SSL certificate
5. Configure environment variables

## 📈 Performance Features

- Server-side rendering with Next.js App Router
- Optimized database queries with Prisma
- Image optimization and lazy loading
- Code splitting and bundle optimization
- Caching strategies for improved performance

For production deployment, ensure you have:
- PostgreSQL database properly configured
- All environment variables set
- Email service configured
- SSL certificate installed
- Regular database backups scheduled
<!-- README_END -->