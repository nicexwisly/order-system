"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role === "admin") {
      router.push("/dashboard")
    } else {
      router.push(`/orders/${user.role}`)
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
