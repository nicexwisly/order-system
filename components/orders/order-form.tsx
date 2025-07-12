"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassCard } from "@/components/ui/glass-card"
import { createOrder, updateOrder } from "@/lib/orders"
import { getCurrentUser } from "@/lib/auth"
import type { Order, CreateOrderData } from "@/lib/supabase"

interface OrderFormProps {
  order?: Order
  onSuccess?: () => void
}

export function OrderForm({ order, onSuccess }: OrderFormProps) {
  const router = useRouter()
  const user = getCurrentUser()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateOrderData>({
    customer_name: order?.customer_name || "",
    item_number: order?.item_number || "",
    qty: order?.qty || 1,
    details: order?.details || "",
    day_pickup: order?.day_pickup || "",
    time_pickup: order?.time_pickup || "",
    department: order?.department || (user?.role === "admin" ? "fish" : (user?.role as "fish" | "pork")) || "fish",
    status: order?.status || "new",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      if (order) {
        await updateOrder(order.id, formData)
      } else {
        await createOrder(formData, user.id)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(user.role === "admin" ? "/dashboard" : `/orders/${user.role}`)
      }
    } catch (error) {
      console.error("Error saving order:", error)
    } finally {
      setLoading(false)
    }
  }

  const canChangeDepartment = user?.role === "admin"

  return (
    <GlassCard className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              required
              className="bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item_number">Item Number</Label>
            <Input
              id="item_number"
              value={formData.item_number}
              onChange={(e) => setFormData({ ...formData, item_number: e.target.value })}
              required
              className="bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qty">Quantity</Label>
            <Input
              id="qty"
              type="number"
              min="1"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: Number.parseInt(e.target.value) || 1 })}
              required
              className="bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value: "fish" | "pork") => setFormData({ ...formData, department: value })}
              disabled={!canChangeDepartment}
            >
              <SelectTrigger className="bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fish">Fish</SelectItem>
                <SelectItem value="pork">Pork</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day_pickup">Pickup Date</Label>
            <Input
              id="day_pickup"
              type="date"
              value={formData.day_pickup}
              onChange={(e) => setFormData({ ...formData, day_pickup: e.target.value })}
              required
              className="bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time_pickup">Pickup Time</Label>
            <Input
              id="time_pickup"
              type="time"
              value={formData.time_pickup}
              onChange={(e) => setFormData({ ...formData, time_pickup: e.target.value })}
              required
              className="bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "new" | "in process" | "complete") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in process">In Process</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="details">Details</Label>
          <Textarea
            id="details"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            rows={3}
            className="bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/20"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving..." : order ? "Update Order" : "Create Order"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
