"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderList } from "@/components/orders/order-list"
import { getCurrentUser } from "@/lib/auth"

interface DepartmentPageProps {
  params: {
    department: "fish" | "pork"
  }
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  const router = useRouter()
  const user = getCurrentUser()
  const { department } = params

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Check if user has access to this department
    if (user.role !== "admin" && user.role !== department) {
      router.push(user.role === "admin" ? "/dashboard" : `/orders/${user.role}`)
      return
    }
  }, [user, department, router])

  if (!user) {
    return null
  }

  const departmentName = department.charAt(0).toUpperCase() + department.slice(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{departmentName} Department Orders</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage orders for the {department} department</p>
          </div>
          <Link href="/orders/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </Link>
        </div>

        <OrderList department={department} />
      </div>
    </div>
  )
}
