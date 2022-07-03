import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '$server/db/client'

export default async function handelr(req: NextApiRequest, res: NextApiResponse) {
  const examples = await prisma.example.findMany()
  res.status(200).json(examples)
}
