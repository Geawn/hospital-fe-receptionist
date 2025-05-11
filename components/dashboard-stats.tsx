"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Pill, Tablets } from "lucide-react"
import { useEffect, useState } from "react"

interface StatsData {
  totalPatients: number
  totalVisits: number
  totalPrescriptions: number
  totalMedications: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalPatients: 0,
    totalVisits: 0,
    totalPrescriptions: 0,
    totalMedications: 0,
  })

  useEffect(() => {
    // This would be a real API call in a production app
    // Simulating API call with setTimeout
    const timer = setTimeout(() => {
      setStats({
        totalPatients: 248,
        totalVisits: 532,
        totalPrescriptions: 789,
        totalMedications: 124,
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPatients}</div>
          <p className="text-xs text-muted-foreground">Registered patients in the system</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVisits}</div>
          <p className="text-xs text-muted-foreground">Patient visits recorded</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
          <Pill className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPrescriptions}</div>
          <p className="text-xs text-muted-foreground">Prescriptions issued</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Medications</CardTitle>
          <Tablets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMedications}</div>
          <p className="text-xs text-muted-foreground">Available medications</p>
        </CardContent>
      </Card>
    </div>
  )
}
