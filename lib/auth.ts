import { supabase } from "./supabase"
import type { User } from "./supabase"
import bcrypt from "bcryptjs"

export async function signIn(username: string, password: string) {
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !userData) {
      throw new Error("Invalid username or password")
    }

    const isValidPassword = await bcrypt.compare(password, userData.password_hash);

    if (!isValidPassword) {
      throw new Error("Invalid username or password")
    }

    return { user: userData as User }

  } catch (error) {
    throw new Error("Invalid username or password")
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
