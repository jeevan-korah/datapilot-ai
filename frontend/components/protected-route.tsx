"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return <>{children}</>
}
