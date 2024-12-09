import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname
  console.log(pathName)
  const token = request.cookies.get('token')
  if (!token && pathName == '/') {
    console.log(1)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if ((pathName == '/login' || pathName == '/register') && token) {
    console.log(2)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login', '/register'],
}