import type * as trpcNext from '@trpc/server/adapters/next'

import * as trpc from '@trpc/server'
import { prisma } from '$server/db/client'

export const createContext = ({ req, res }: trpcNext.CreateNextContextOptions) => {
  return {
    req,
    res,
    prisma,
  }
}

type Context = trpc.inferAsyncReturnType<typeof createContext>

export const createRouter = () => trpc.router<Context>()
