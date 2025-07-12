import { supabase } from "./supabase";
import type { User } from "./supabase";

export async function signIn(username: string, password: string) {
  try {
    // Call the DB function to verify user login
    const { data, error } = await supabase
      .rpc('verify_user_login', { p_username: username, p_password: password });

    if (error || !data || data.length === 0) {
      throw new Error("Invalid username or password");
    }

    // Success - return the user
    const userData = data[0];
    return { user: userData as User };

  } catch (error) {
    throw new Error("Invalid username or password");
  }
}

export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
}
