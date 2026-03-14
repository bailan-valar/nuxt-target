# Nuxt Target Project

## Language
**请始终使用中文回复用户的所有问题和请求。**

## Stack
- Nuxt 4.3.1
- Prisma 6.2.0 (PostgreSQL)
- Tailwind CSS
- Zod validation
- bcryptjs authentication

## Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Database
```bash
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate client
npx prisma studio         # Open Prisma Studio
```

## Project Structure
```
server/          # Nuxt server routes & API
prisma/          # Database schema & migrations
pages/           # Nuxt pages (file-based routing)
components/      # Vue components
composables/     # Vue composables
middleware/      # Route middleware
plugins/         # Nuxt plugins
lib/             # Shared utilities
types/           # TypeScript types
```

## Coding Standards
- Immutable patterns (no mutations)
- Zod for input validation
- Comprehensive error handling
- Small focused files (<800 lines)
- 80%+ test coverage required
