"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OrderForm } from "@/components/orders/order-form"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { Order } from "@/lib/supabase"

interface EditOrderPageProps {
  params: {
    id: string
  }
}

export default function EditOrderPage({ params }: EditOrderPageProps) {
  const router = useRouter()
  const user = getCurrentUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    loadOrder()
  }, [user, params.id, router])

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("id", params.id).single()

      if (error || !data) {
        router.push("/dashboard")
        return
      }

      // Check if user has access to this order
      if (user?.role !== "admin" && user?.role !== data.department) {
        router.push("/dashboard")
        return
      }

      setOrder(data)
    } catch (error) {
      console.error("Error loading order:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (!user || loading) {
    return null
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Order</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Update order details for {order.customer_name}</p>
          </div>

          <OrderForm order={order} />
        </div>
      </div>
    </div>
  )
}
