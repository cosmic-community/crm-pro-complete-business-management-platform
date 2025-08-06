import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import type { AuthUser } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only-change-in-production'

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production')
}

export interface AuthJWTPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: string
  iat?: number
  exp?: number
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: Omit<AuthJWTPayload, 'iat' | 'exp'>): string {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  } catch (error) {
    console.error('Token generation failed:', error)
    throw new Error('Failed to generate authentication token')
  }
}

export function verifyToken(token: string): AuthJWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthJWTPayload
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
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
  const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds
  
  return `auth-token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${isProduction ? '; Secure' : ''}`
}

export function clearAuthCookie(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  return `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${isProduction ? '; Secure' : ''}`
}