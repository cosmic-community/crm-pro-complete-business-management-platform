'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Users, 
  Calendar, 
  CheckSquare, 
  MapPin, 
  UserCheck, 
  Package, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  MessageSquare,
  Bell,
  Search
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Patient List', href: '/dashboard/contacts', icon: Users },
  { name: 'Messages', href: '/dashboard/activities', icon: MessageSquare, count: 3 },
  { name: 'Resources', href: '/dashboard/services', icon: Package },
  { name: 'Billing', href: '/dashboard/reports', icon: BarChart3 },
]

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-xl shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        bg-white w-64 min-h-screen shadow-sm fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out border-r border-gray-100
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Mindease</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gray-100 text-gray-900 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    <span>{item.name}</span>
                    {'count' in item && item.count && (
                      <span className="ml-auto bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Premium Section */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Join Premium</h3>
            <p className="text-xs text-gray-600 mb-3">$9.99/m</p>
            <button className="w-full bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
              Explore plans
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}