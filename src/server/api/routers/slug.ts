import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit'; // for deno: see above
import { Redis } from '@upstash/redis';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(10, '10s'),
  analytics: true,
  timeout: 1000, // 1 second
  prefix: 'zshort-link',
});

export const slugRouter = createTRPCRouter({
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
      });
      return { used: count > 0 };
    }),
  createSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        url: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const forwarded = ctx.req.headers['x-forwarded-for'];
      const remoteAddress = ctx.req.socket.remoteAddress;
      const ip =
        typeof forwarded === 'string' ? forwarded.split(/, /)[0] ?? remoteAddress : remoteAddress;
      console.log('ip', ip);

      const { success } = await ratelimit.limit(ip ?? '127.0.0.1');
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

      try {
        await ctx.prisma.shortLink.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),
});
