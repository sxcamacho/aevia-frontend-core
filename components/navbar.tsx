"use client"

import type React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function Navbar() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Aevia</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a
              href="#features"
              onClick={(e) => handleScroll(e, "features")}
              className="transition-colors hover:text-primary cursor-pointer"
            >
              Features
            </a>
            <a
              href="#assets"
              onClick={(e) => handleScroll(e, "assets")}
              className="transition-colors hover:text-primary cursor-pointer"
            >
              Supported Assets
            </a>
            {/* <a
              href="#about"
              onClick={(e) => handleScroll(e, "about")}
              className="transition-colors hover:text-primary cursor-pointer"
            >
              About Us
            </a> */}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="mr-2"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Link href="/dashboard">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

