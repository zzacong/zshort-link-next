import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const slugRouter = router({
  slugCheck: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const count = await ctx.prisma.shortLink.count({
        where: {
          slug: input.slug,
        },
      })
      return { used: count > 0 }
    }),
  createSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.shortLink.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        })
      } catch (e) {
        console.log(e)
      }
    }),
})
