"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Home, FileText, User, LogOut, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: FileText, label: "Legacies", href: "/dashboard/legacies" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = () => {
    // Add any sign out logic here (e.g., clearing session, tokens, etc.)
    // Then redirect to the home page
    router.push("/")
  }

  return (
    <div
      className={`flex h-screen ${theme === "light" ? "bg-dashboard-light-background" : "bg-dashboard-dark-background"}`}
    >
      {/* Sidebar */}
      <aside
        className={`w-64 p-4 shadow-lg flex flex-col ${theme === "light" ? "bg-dashboard-light-sidebar" : "bg-dashboard-dark-sidebar"}`}
      >
        <h1
          className={`text-xl font-bold mb-6 ${theme === "light" ? "text-dashboard-light-text" : "text-dashboard-dark-text"}`}
        >
          Aevia Dashboard
        </h1>
        <nav className="space-y-2 flex-grow">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-dashboard-light-accent dark:bg-dashboard-dark-accent text-white"
                  : `${theme === "light" ? "text-dashboard-light-text hover:bg-dashboard-light-accent/10" : "text-dashboard-dark-text hover:bg-dashboard-dark-accent/10"}`
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`w-full justify-start ${theme === "light" ? "text-dashboard-light-text" : "text-dashboard-dark-text"}`}
          >
            {theme === "light" ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${
              theme === "light"
                ? "text-dashboard-light-text hover:bg-dashboard-light-accent/10"
                : "text-dashboard-dark-text hover:bg-dashboard-dark-accent/10"
            }`}
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Sign out</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}

