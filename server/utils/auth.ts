import bcrypt from 'bcryptjs'
import { setCookie, deleteCookie, getCookie } from 'h3'
import type { H3Event } from 'h3'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function setAuthCookie(event: H3Event, userId: string, rememberMe = false): void {
  setCookie(event, 'auth_session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
    path: '/'
  })
}

export function clearAuthCookie(event: H3Event): void {
  deleteCookie(event, 'auth_session', { path: '/' })
}

export function getUserIdFromCookie(event: H3Event): string | null {
  return getCookie(event, 'auth_session') || null
}
