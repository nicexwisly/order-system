"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, LogOut, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { getCurrentUser, signOut } from "@/lib/auth"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const user = getCurrentUser()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const getNavLinks = () => {
    if (!user) return []

    const links = []

    if (user.role === "admin") {
      links.push({ href: "/dashboard", label: "Dashboard" })
      links.push({ href: "/orders/fish", label: "Fish Orders" })
      links.push({ href: "/orders/pork", label: "Pork Orders" })
    } else {
      links.push({
        href: `/orders/${user.role}`,
        label: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Orders`,
      })
    }

    links.push({ href: "/orders/new", label: "New Order" })

    return links
  }

  if (!user) return null

  return (
    <nav className="sticky top-0 z-50 w-full">
      <GlassCard className="m-4 p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OrderFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {getNavLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.username} ({user.role})
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 dark:border-white/10">
            <div className="flex flex-col space-y-2">
              {getNavLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-white/20 dark:border-white/10">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.username} ({user.role})
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </nav>
  )
}
