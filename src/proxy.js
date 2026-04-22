import { NextResponse } from 'next/server'

export function proxy(request) {
  const { pathname } = request.nextUrl

  // Always allow the login page through to avoid redirect loops
  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  // Check for the auth cookie
  const auth = request.cookies.get('arda_auth')
  if (auth?.value === 'true') {
    return NextResponse.next()
  }

  // No valid cookie — redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
