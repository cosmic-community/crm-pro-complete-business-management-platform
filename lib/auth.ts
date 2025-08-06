import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import type { JWTPayload, AuthUser } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development'

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error('Password comparison failed:', error)
    return false
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    return {
      id: payload.userId,
      email: payload.email,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      role: payload.role,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export function setAuthCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production'
  return `auth-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${isProduction ? '; Secure' : ''}`
}

export function clearAuthCookie(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  return `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${isProduction ? '; Secure' : ''}`
}