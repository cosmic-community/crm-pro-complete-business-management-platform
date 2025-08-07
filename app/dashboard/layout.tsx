import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const isDemoMode = cookieStore.get('demo-mode')?.value === 'true'

  // Allow access if user has valid token OR is in demo mode
  if (!token && !isDemoMode) {
    redirect('/login')
  }

  // If token exists but is invalid, and not in demo mode, redirect to login
  if (token && !verifyToken(token) && !isDemoMode) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}