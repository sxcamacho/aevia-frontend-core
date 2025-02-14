"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Home, FileText, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrivy } from '@privy-io/react-auth'

const sidebarItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: FileText, label: "Legacies", href: "/dashboard/legacies" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = usePrivy()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r">
        <div className="fixed h-full w-64 p-4 space-y-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 w-[calc(100%-2rem)]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

