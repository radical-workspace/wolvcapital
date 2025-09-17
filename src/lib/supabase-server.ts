import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/dashboard', '/admin']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Admin only routes
  const adminPaths = ['/admin']
  const isAdminPath = adminPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isAdminPath && user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const isAdmin = user.user_metadata?.role === 'admin' || 
                   (user.app_metadata?.claims_admin === true)

    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/auth/login', '/auth/signup']
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isAuthPath && user) {
    const isAdmin = user.user_metadata?.role === 'admin'
    const url = request.nextUrl.clone()
    url.pathname = isAdmin ? '/admin' : '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export async function createServerSupabaseClient() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return undefined // Will use default cookie handling
        },
        set() {},
        remove() {},
      },
    }
  )

  return supabase
}