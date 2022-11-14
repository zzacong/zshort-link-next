import { router } from '../trpc'
import { slugRouter } from './slug'

export const appRouter = router({ slug: slugRouter })

// export type definition of API
export type AppRouter = typeof appRouter
