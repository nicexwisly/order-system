import { supabase } from "./supabase"
import type { User } from "./supabase"

export async function signIn(username: string, password: string) {
  try {
    // Query users table with password verification
    const { data, error } = await supabase
      .from("users")
      .select("id, username, role")
      .eq("username", username)
      .eq("password_hash", supabase.rpc("crypt", { password, salt: supabase.rpc("gen_salt", "bf") }))
      .single()

    if (error || !data) {
      // Fallback: simple password check for demo purposes
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, username, role, password_hash")
        .eq("username", username)
        .single()

      if (userError || !userData) {
        throw new Error("Invalid credentials")
      }

      // Simple password verification (in production, use proper bcrypt comparison)
      const isValidPassword =
        (username === "admin" && password === "admin01") ||
        (username === "fish" && password === "fish01") ||
        (username === "pork" && password === "pork01")

      if (!isValidPassword) {
        throw new Error("Invalid credentials")
      }

      return { user: userData as User }
    }

    return { user: data as User }
  } catch (error) {
    throw new Error("Invalid credentials")
  }
}

export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setCurrentUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}
