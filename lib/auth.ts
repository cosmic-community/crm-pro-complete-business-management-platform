import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import type { JWTPayload, AuthUser } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET

// Only throw error if JWT_SECRET is missing and we're not in build time
if (!JWT_SECRET && process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  console.warn('JWT_SECRET environment variable is not set. Authentication will not work properly.')
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET environment variable is required')
    return null
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!JWT_SECRET) {
    return null
  }

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
      firstName: '',
      lastName: '',
      role: payload.role,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export function setAuthCookie(token: string) {
  return `auth-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure`
}

export function clearAuthCookie() {
  return `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure`
}