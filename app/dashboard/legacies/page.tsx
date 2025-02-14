"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import LegacyForm from "@/components/legacy-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
// Mock data
const mockLegacies = [
  {
    id: 1,
    network: {
      name: "Avalanche Fuji",
      icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
      explorer: "https://testnet.snowtrace.io"
    },
    token: {
      name: "USDC",
      icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      amount: "1,000.00"
    },
    beneficiary: "0x1234...5678"
  },
  {
    id: 2,
    network: {
      name: "Sepolia",
      icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
      explorer: "https://sepolia.etherscan.io"
    },
    token: {
      name: "USDT",
      icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
      amount: "500.00"
    },
    beneficiary: "0x8765...4321"
  },
]

export default function LegaciesPage() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Legacies</h2>
            <p className="text-muted-foreground">
              Here are all the legacies you have created.
            </p>
          </div>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[95%] sm:w-[800px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Create New Legacy</SheetTitle>
                <SheetDescription>
                  Set up a new digital legacy for your assets.
                </SheetDescription>
              </SheetHeader>
              <LegacyForm onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {mockLegacies.map((legacy) => (
            <Card key={legacy.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={legacy.network.icon} 
                      alt={legacy.network.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{legacy.network.name}</span>
                  </div>
                </CardTitle>
                <a 
                  href={`${legacy.network.explorer}/address/${legacy.beneficiary}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={legacy.token.icon} 
                      alt={legacy.token.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">
                        {legacy.token.amount} {legacy.token.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        To: {legacy.beneficiary}
                      </div>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

