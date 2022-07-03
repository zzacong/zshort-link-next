import type { NextApiRequest, NextApiResponse } from 'next'
import type { ZodError } from 'zod'

import { z } from 'zod'
import { prisma } from '$server/db/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const slug = z.string().parse(req.query.slug)
    const data = await prisma.shortLink.findFirst({
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (!data) {
      return res.status(404).send({ message: 'slug not found' })
    }

    return res.redirect(data.url)
  } catch (error) {
    console.error(error)
    const err = error as ZodError
    if (err.name === 'ZodError') {
      res.status(400).send(err)
    }
    res.status(500).send({ message: 'An error occurred' })
  }
}
