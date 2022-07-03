import { createRouter } from '$server/router/context'
import { z } from 'zod'

export const slugRouter = createRouter()
  .query('slugCheck', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      const count = await ctx.prisma.shortLink.count({
        where: {
          slug: input.slug,
        },
      })
      return { used: count > 0 }
    },
  })
  .mutation('createSlug', {
    input: z.object({
      slug: z.string(),
      url: z.string(),
    }),
    async resolve({ input, ctx }) {
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
    },
  })
