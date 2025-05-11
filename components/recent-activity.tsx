"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Activity {
  id: number
  action: string
  description: string
  timestamp: string
  user: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This would be a real API call in a production app
    // Simulating API call with setTimeout
    const timer = setTimeout(() => {
      setActivities([
        {
          id: 1,
          action: "Patient Added",
          description: "New patient Emily Johnson was registered",
          timestamp: "2025-05-11T01:15:23.000Z",
          user: "Receptionist",
        },
        {
          id: 2,
          action: "Visit Scheduled",
          description: "Appointment scheduled for Michael Wilson",
          timestamp: "2025-05-11T00:45:12.000Z",
          user: "Receptionist",
        },
        {
          id: 3,
          action: "Prescription Updated",
          description: "Prescription for John Doe was updated",
          timestamp: "2025-05-10T23:30:45.000Z",
          user: "Receptionist",
        },
        {
          id: 4,
          action: "Medication Added",
          description: "New medication Azithromycin was added to inventory",
          timestamp: "2025-05-10T22:15:33.000Z",
          user: "Receptionist",
        },
        {
          id: 5,
          action: "Patient Updated",
          description: "Contact information updated for Sarah Thompson",
          timestamp: "2025-05-10T21:05:18.000Z",
          user: "Receptionist",
        },
      ])
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="mr-4 mt-0.5">
                  <div className="flex h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
