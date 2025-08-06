import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default async function HomePage() {
  const user = await getCurrentUser()

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CRM Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Complete Business Management Platform for modern teams. 
            Manage customers, tasks, appointments, and grow your business.
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Link
              href="/login"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
              <p className="text-gray-600">
                Keep track of all your customers, their information, and interaction history.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-600">
                Organize tasks, set priorities, and track progress with our intuitive task board.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-3xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Appointment Scheduling</h3>
              <p className="text-gray-600">
                Schedule and manage appointments with an integrated calendar system.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Demo Accounts</h3>
            <p className="text-gray-600 mb-4">Try CRM Pro with these demo accounts:</p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-red-600">Admin Access</h4>
                <p className="mt-2">Email: admin@crmprodemp.com</p>
                <p>Password: password123</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-blue-600">Manager Access</h4>
                <p className="mt-2">Email: manager@crmprodemp.com</p>
                <p>Password: password123</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-green-600">Staff Access</h4>
                <p className="mt-2">Email: staff@crmprodemp.com</p>
                <p>Password: password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}