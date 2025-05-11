"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { format } from "date-fns"

interface UpcomingVisit {
  id: number
  patientName: string
  doctorName: string
  visitTime: string
  status: "scheduled" | "confirmed" | "cancelled"
}

export function UpcomingVisits() {
  const [visits, setVisits] = useState<UpcomingVisit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This would be a real API call in a production app
    // Simulating API call with setTimeout
    const timer = setTimeout(() => {
      setVisits([
        {
          id: 1,
          patientName: "John Doe",
          doctorName: "Dr. Sarah Johnson",
          visitTime: "2025-05-12T09:30:00.000Z",
          status: "confirmed",
        },
        {
          id: 2,
          patientName: "Emily Davis",
          doctorName: "Dr. Michael Brown",
          visitTime: "2025-05-12T10:15:00.000Z",
          status: "scheduled",
        },
        {
          id: 3,
          patientName: "Robert Wilson",
          doctorName: "Dr. John Smith",
          visitTime: "2025-05-12T11:00:00.000Z",
          status: "confirmed",
        },
        {
          id: 4,
          patientName: "Sarah Thompson",
          doctorName: "Dr. Sarah Johnson",
          visitTime: "2025-05-12T13:45:00.000Z",
          status: "scheduled",
        },
        {
          id: 5,
          patientName: "Michael Johnson",
          doctorName: "Dr. Michael Brown",
          visitTime: "2025-05-12T14:30:00.000Z",
          status: "cancelled",
        },
      ])
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 hover:bg-green-600"
      case "scheduled":
        return "bg-blue-500 hover:bg-blue-600"
      case "cancelled":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const formatVisitTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return format(date, "h:mm a")
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Visits</CardTitle>
        <CardDescription>Scheduled visits for today</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <div key={visit.id} className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{visit.patientName}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{formatVisitTime(visit.visitTime)}</span>
                    <span className="mx-2">•</span>
                    <span>{visit.doctorName}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(visit.status)}>
                  {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
