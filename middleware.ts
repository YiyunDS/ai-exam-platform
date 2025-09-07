import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Completely bypass all middleware for now to debug navigation issues
  console.log('Middleware hit for:', req.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: []
  // Completely disabled for debugging
}