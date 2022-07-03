import superjson from 'superjson'
import { createRouter } from '$server/router/context'

import { slugRouter } from './slug'

export const appRouter = createRouter().transformer(superjson).merge('slug.', slugRouter)

// export type definition of API
export type AppRouter = typeof appRouter
