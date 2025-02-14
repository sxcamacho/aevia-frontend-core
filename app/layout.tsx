import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Providers from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aevia - Secure Your Digital Legacy",
  description:
    "Aevia empowers you to safeguard and transfer your digital assets, ensuring your blockchain wealth reaches its intended destination.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main>
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
