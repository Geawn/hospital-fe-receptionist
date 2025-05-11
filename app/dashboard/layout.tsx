"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Calendar, Pill, LogOut, Menu, X, Hospital, Tablets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if user is authenticated
    const userRole = localStorage.getItem("userRole")
    if (!userRole) {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    router.push("/")
  }

  if (!isMounted) {
    return null
  }

  const navItems = [
    {
      title: "Patients",
      href: "/dashboard/patients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Visits",
      href: "/dashboard/visits",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Prescriptions",
      href: "/dashboard/prescriptions",
      icon: <Pill className="h-5 w-5" />,
    },
    {
      title: "Medications",
      href: "/dashboard/medications",
      icon: <Tablets className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Navigation */}
      <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:max-w-xs">
            <div className="flex h-16 items-center gap-2 border-b">
              <Hospital className="h-6 w-6" />
              <span className="text-lg font-semibold">Hospital Management</span>
              <Button variant="outline" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <nav className="grid gap-2 py-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Hospital className="h-6 w-6" />
          <span className="text-lg font-semibold">Hospital Management</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="grid lg:grid-cols-[240px_1fr]">
        <div className="hidden border-r bg-gray-50/40 lg:block">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Hospital className="h-6 w-6" />
            <span className="text-lg font-semibold">Hospital Management</span>
          </div>
          <nav className="grid gap-2 p-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium mt-4"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>
        </div>
        <div className="flex flex-col">
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
