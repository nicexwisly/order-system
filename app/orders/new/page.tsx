"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OrderForm } from "@/components/orders/order-form"
import { getCurrentUser } from "@/lib/auth"

export default function NewOrderPage() {
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Order</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Fill in the details to create a new order</p>
          </div>

          <OrderForm />
        </div>
      </div>
    </div>
  )
}
