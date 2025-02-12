import Link from "next/link"
import { Twitter, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-background">
      <div className="container py-8 flex justify-center items-center">
        <div className="flex space-x-4">
          <Link href="https://x.com/aeviaprotocol" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Button>
          </Link>
          <Link href="https://github.com/BeingFounders/aevia-smart-contracts" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="container py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Aevia. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

