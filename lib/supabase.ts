import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Order = {
  id: string
  customer_name: string
  item_number: string
  qty: number
  details: string | null
  day_pickup: string
  time_pickup: string
  department: "Fish" | "Butchery"
  status: "new" | "in process" | "complete"
  created_at: string
  updated_at: string
}

// Database operations
export const orderService = {
  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get orders by department
  async getOrdersByDepartment(department: "Fish" | "Butchery"): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("department", department)
      .order("day_pickup", { ascending: true })
      .order("time_pickup", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Create new order
  async createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order> {
    const { data, error } = await supabase.from("orders").insert([order]).select().single()

    if (error) throw error
    return data
  },

  // Update order
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Update order status
  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Delete order
  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) throw error
  },
}
