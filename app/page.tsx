import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token || !verifyToken(token)) {
    redirect('/login')
  }

  redirect('/dashboard')
}