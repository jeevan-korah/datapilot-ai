"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-muted-foreground mb-8">A secure authentication system with OTP verification</p>
        <div className="flex gap-4 flex-col">
          <Link href="/login" className="w-full">
            <Button className="w-full">Sign In</Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
