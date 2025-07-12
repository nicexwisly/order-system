"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { getOrders, deleteOrder } from "@/lib/orders"
import { getCurrentUser } from "@/lib/auth"
import type { Order } from "@/lib/supabase"

interface OrderListProps {
  department?: "fish" | "pork"
}

export function OrderList({ department }: OrderListProps) {
  const router = useRouter()
  const user = getCurrentUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadOrders()
  }, [department])

  const loadOrders = async () => {
    try {
      const data = await getOrders(department)
      setOrders(data)
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    try {
      await deleteOrder(id)
      setOrders(orders.filter((order) => order.id !== id))
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300"
      case "in process":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
      case "complete":
        return "bg-green-500/20 text-green-700 dark:text-green-300"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/20 dark:bg-black/20 rounded-lg" />
          ))}
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by customer name or item number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in process">In Process</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          </GlassCard>
        ) : (
          filteredOrders.map((order) => (
            <GlassCard key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {order.department}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Item: {order.item_number}</div>
                    <div>Qty: {order.qty}</div>
                    <div>
                      Pickup: {order.day_pickup} at {order.time_pickup}
                    </div>
                  </div>
                  {order.details && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{order.details}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/orders/edit/${order.id}`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
