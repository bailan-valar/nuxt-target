import type { H3Event } from 'h3'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 300000)

export function checkRateLimit(event: H3Event, maxAttempts = 100, windowMs = 60000): void {
  const ip = getRequestIP(event) || 'unknown'
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return
  }

  if (entry.count >= maxAttempts) {
    const resetIn = Math.ceil((entry.resetAt - now) / 1000)
    throw createError({
      statusCode: 429,
      message: `Too many attempts. Try again in ${resetIn} seconds`
    })
  }

  entry.count++
}
