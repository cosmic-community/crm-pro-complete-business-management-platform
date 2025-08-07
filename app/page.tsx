'use client'

import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
}

export default function HomePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoLoading, setDemoLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          // If user is authenticated, redirect to dashboard
          window.location.href = '/dashboard'
        }
      } catch (error) {
        // User not authenticated, stay on home page
        console.log('User not authenticated')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleTestDrive = async () => {
    setDemoLoading(true)
    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to dashboard immediately
        window.location.href = '/dashboard'
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start demo')
      }
    } catch (error) {
      console.error('Demo session failed:', error)
      alert('Failed to start demo session. Please try again.')
    } finally {
      setDemoLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleTestDrive}
              disabled={demoLoading}
              className={`bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform transition-all duration-200 hover:bg-green-700 hover:scale-105 ${
                demoLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
            >
              {demoLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Starting Demo...
                </span>
              ) : (
                '🚗 Test Drive - Try Now!'
              )}
            </button>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
              <p className="text-gray-600">
                Keep track of all your customers, their information, and interaction history.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-600">
                Organize tasks, set priorities, and track progress with our intuitive task board.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Appointment Scheduling</h3>
              <p className="text-gray-600">
                Schedule and manage appointments with an integrated calendar system.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Why Choose CRM Pro?</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">🎯 All-in-One Solution</h4>
                <p className="text-gray-600 text-sm">
                  CRM, task management, calendar, and reporting in one platform.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">📊 Real-time Analytics</h4>
                <p className="text-gray-600 text-sm">
                  Track performance with live dashboards and detailed reports.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">🔒 Secure & Reliable</h4>
                <p className="text-gray-600 text-sm">
                  Enterprise-grade security with 99.9% uptime guarantee.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">⚡ Easy to Use</h4>
                <p className="text-gray-600 text-sm">
                  Intuitive interface that your team will love from day one.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold mb-3 text-blue-800">Ready to get started?</h3>
            <p className="text-blue-700 mb-4">
              Click "Test Drive" above to explore CRM Pro with live demo data - no signup required!
            </p>
            <p className="text-sm text-blue-600">
              Experience the full power of our CRM system with realistic sample data including contacts, deals, tasks, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}