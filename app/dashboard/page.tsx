"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from "@/components/dashboard-layout"
import { CalendarDays, CheckCircle2 } from "lucide-react"

// Mock data
const networkStats = [
  {
    network: "Avalanche",
    value: 2500,
    color: "#E84142"
  },
  {
    network: "Sepolia",
    value: 1500,
    color: "#627EEA"
  },
  {
    network: "Mantle",
    value: 1000,
    color: "#0EA5E9"
  },
];

const totalValue = networkStats.reduce((acc, curr) => acc + curr.value, 0)

// Agregar mock data para la actividad
const recentActivity = [
  {
    id: 1,
    date: "2024-03-15 09:30",
    contact: "@johndoe",
    status: "SUCCESS",
  },
  {
    id: 2,
    date: "2024-03-14 15:45",
    contact: "@johndoe",
    status: "SUCCESS",
  },
  {
    id: 3,
    date: "2024-03-13 11:20",
    contact: "@johndoe",
    status: "SUCCESS",
  },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-sm">
        <p className="text-sm font-medium">{`${payload[0].payload.network}`}</p>
        <p className="text-sm text-muted-foreground">{`$${payload[0].value.toLocaleString()}`}</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your digital legacy portfolio
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Value Locked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalValue.toLocaleString()}</div>
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={networkStats}>
                    <XAxis 
                      dataKey="network" 
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                      fill="currentColor"
                      className="fill-primary"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {activity.contact}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">{activity.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

