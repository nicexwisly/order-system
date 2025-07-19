"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { orderService, type Order } from "@/lib/supabase"

type FilterStatus = "all" | Order["status"]
type FilterDepartment = "all" | Order["department"]

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [departmentFilter, setDepartmentFilter] = useState<FilterDepartment>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter, departmentFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getAllOrders()
      setOrders(data)
    } catch (err) {
      setError("Failed to load orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.item_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.details?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((order) => order.department === departmentFilter)
    }

    setFilteredOrders(filtered)
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    try {
      await orderService.deleteOrder(orderId)
      await loadOrders()
    } catch (err) {
      setError("Failed to delete order")
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

  const getDepartmentBadgeClass = (department: Order["department"]) => {
    return department === "Fish"
      ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
      : "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage all orders across departments</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              Create Order
            </button>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Search</label>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="form-input"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in process">In Process</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div>
              <label className="form-label">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value as FilterDepartment)}
                className="form-input"
              >
                <option value="all">All Departments</option>
                <option value="Fish">Fish</option>
                <option value="Butchery">Butchery</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDepartmentFilter("all")
                }}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.item_number}</div>
                        {order.details && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{order.details}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.qty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{new Date(order.day_pickup).toLocaleDateString()}</div>
                        <div className="text-gray-500">{order.time_pickup}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getDepartmentBadgeClass(order.department)}>{order.department}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingOrder(order)} className="text-blue-600 hover:text-blue-900">
                            Edit
                          </button>
                          <button onClick={() => deleteOrder(order.id)} className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingOrder) && (
        <OrderModal
          order={editingOrder}
          onClose={() => {
            setShowCreateModal(false)
            setEditingOrder(null)
          }}
          onSave={loadOrders}
        />
      )}
    </div>
  )
}

// Order Modal Component
function OrderModal({
  order,
  onClose,
  onSave,
}: {
  order: Order | null
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    customer_name: order?.customer_name || "",
    item_number: order?.item_number || "",
    qty: order?.qty || 1,
    details: order?.details || "",
    day_pickup: order?.day_pickup || "",
    time_pickup: order?.time_pickup || "",
    department: order?.department || ("Fish" as Order["department"]),
    status: order?.status || ("new" as Order["status"]),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (order) {
        await orderService.updateOrder(order.id, formData)
      } else {
        await orderService.createOrder(formData)
      }
      onSave()
      onClose()
    } catch (err) {
      setError("Failed to save order")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{order ? "Edit Order" : "Create New Order"}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="form-input"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="form-label">Item Number *</label>
                <input
                  type="text"
                  required
                  value={formData.item_number}
                  onChange={(e) => setFormData({ ...formData, item_number: e.target.value })}
                  className="form-input"
                  placeholder="Enter item number"
                />
              </div>

              <div>
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: Number.parseInt(e.target.value) || 1 })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Department *</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as Order["department"] })}
                  className="form-input"
                >
                  <option value="Fish">Fish</option>
                  <option value="Butchery">Butchery</option>
                </select>
              </div>

              <div>
                <label className="form-label">Pickup Date *</label>
                <input
                  type="date"
                  required
                  value={formData.day_pickup}
                  onChange={(e) => setFormData({ ...formData, day_pickup: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Pickup Time *</label>
                <input
                  type="time"
                  required
                  value={formData.time_pickup}
                  onChange={(e) => setFormData({ ...formData, time_pickup: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Order["status"] })}
                  className="form-input"
                >
                  <option value="new">New</option>
                  <option value="in process">In Process</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Details</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="form-input"
                  rows={3}
                  placeholder="Enter order details..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? "Saving..." : order ? "Update Order" : "Create Order"}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
