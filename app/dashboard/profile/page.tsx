"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { HardHat, Construction } from "lucide-react"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex gap-2">
            <Construction className="h-12 w-12" />
            <HardHat className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            HODL Tight! 🚧
          </h2>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Our devs are mining this profile page block by block.
            </p>
            <p className="text-sm">
              Expected gas fees: infinite patience ⛽️
            </p>
            <p className="text-xs italic mt-4">
              * No smart contracts were harmed during the construction of this page
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

