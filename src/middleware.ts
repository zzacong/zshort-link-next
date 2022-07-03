import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.split('/').pop()
  const resp = await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)

  if (resp.status === 404) {
    return NextResponse.redirect(req.nextUrl.origin)
  }

  const data = await resp.json()
  if (data?.url) {
    return NextResponse.redirect(data.url)
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/r/:path*',
}
