import { getUserIdFromCookie } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  const userId = getUserIdFromCookie(event)
  if (userId) {
    event.context.user = { id: userId }
  }
})
