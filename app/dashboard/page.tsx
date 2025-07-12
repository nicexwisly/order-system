"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Package, Users, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { OrderList } from "@/components/orders/order-list"
import { getCurrentUser } from "@/lib/auth"
import { getOrders } from "@/lib/orders"
import type { Order } from "@/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()
  const user = getCurrentUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push(`/orders/${user.role}`)
      return
    }

    loadOrders()
  }, [user, router])

  const loadOrders = async () => {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const stats = {
    total: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    inProcess: orders.filter((o) => o.status === "in process").length,
    complete: orders.filter((o) => o.status === "complete").length,
    fish: orders.filter((o) => o.department === "fish").length,
    pork: orders.filter((o) => o.department === "pork").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all orders across departments</p>
          </div>
          <Link href="/orders/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <GlassCard className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.new}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">New</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProcess}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Process</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.complete}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fish}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Fish Dept</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pork}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pork Dept</div>
          </GlassCard>
        </div>

        {/* Orders List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">All Orders</h2>
          <OrderList />
        </div>
      </div>
    </div>
  )
}
