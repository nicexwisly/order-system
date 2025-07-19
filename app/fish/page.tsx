"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { orderService, type Order } from "@/lib/supabase"

export default function FishDepartmentPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getOrdersByDepartment("Fish")
      setOrders(data)
    } catch (err) {
      setError("Failed to load orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus)
      await loadOrders() // Reload orders
    } catch (err) {
      setError("Failed to update order status")
      console.error(err)
    }
  }

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "new":
        return "status-badge status-new"
      case "in process":
        return "status-badge status-in-process"
      case "complete":
        return "status-badge status-complete"
      default:
        return "status-badge"
    }
  }

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    switch (currentStatus) {
      case "new":
        return "in process"
      case "in process":
        return "complete"
      default:
        return null
    }
  }

  const getActionButtonText = (status: Order["status"]) => {
    switch (status) {
      case "new":
        return "Accept Order"
      case "in process":
        return "Mark Complete"
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fish Department</h1>
            <p className="text-gray-600 mt-2">Manage fish orders and update status</p>
          </div>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No fish orders found</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{order.customer_name}</h3>
                      <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Item:</span>
                        <p className="text-gray-900">{order.item_number}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Quantity:</span>
                        <p className="text-gray-900">{order.qty}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Pickup Date:</span>
                        <p className="text-gray-900">{new Date(order.day_pickup).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Pickup Time:</span>
                        <p className="text-gray-900">{order.time_pickup}</p>
                      </div>
                    </div>

                    {order.details && (
                      <div className="mt-3">
                        <span className="font-medium text-gray-700">Details:</span>
                        <p className="text-gray-900 mt-1">{order.details}</p>
                      </div>
                    )}
                  </div>

                  {getNextStatus(order.status) && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                        className="btn-success w-full sm:w-auto min-w-[140px]"
                      >
                        {getActionButtonText(order.status)}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
