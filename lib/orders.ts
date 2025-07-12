import { supabase } from "./supabase"
import type { Order, CreateOrderData, UpdateOrderData } from "./supabase"

export async function getOrders(department?: "fish" | "pork"): Promise<Order[]> {
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (department) {
    query = query.eq("department", department)
  }

  const { data, error } = await query

  if (error) {
    throw new Error("Failed to fetch orders")
  }

  return data || []
}

export async function createOrder(orderData: CreateOrderData, userId: string): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      ...orderData,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    throw new Error("Failed to create order")
  }

  return data
}

export async function updateOrder(id: string, orderData: UpdateOrderData): Promise<Order> {
  const { data, error } = await supabase.from("orders").update(orderData).eq("id", id).select().single()

  if (error) {
    throw new Error("Failed to update order")
  }

  return data
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("id", id)

  if (error) {
    throw new Error("Failed to delete order")
  }
}
