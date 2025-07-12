import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  username: string
  role: "admin" | "fish" | "pork"
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  item_number: string
  qty: number
  details?: string
  day_pickup: string
  time_pickup: string
  department: "fish" | "pork"
  status: "new" | "in process" | "complete"
  created_by: string
  created_at: string
  updated_at: string
}

export type CreateOrderData = Omit<Order, "id" | "created_by" | "created_at" | "updated_at">
export type UpdateOrderData = Partial<CreateOrderData>
