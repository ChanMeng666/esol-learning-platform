'use client'

import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push('/handler/sign-in')
    }
  }, [user, router])

  // Show loading state while checking auth
  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // User is not logged in, will redirect
  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // User is logged in, show the protected content
  return <>{children}</>
}
