import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Pill, Tablets } from "lucide-react"
import Link from "next/link"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { UpcomingVisits } from "@/components/upcoming-visits"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Hospital Management System - Receptionist Module</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/patients">
          <Card className="hover:bg-accent/10 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage patient records, add new patients, and update existing information.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/visits">
          <Card className="hover:bg-accent/10 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Visits</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule and manage patient visits, update visit details and treatments.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/prescriptions">
          <Card className="hover:bg-accent/10 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <Pill className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>View and manage prescriptions for patient visits.</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/medications">
          <Card className="hover:bg-accent/10 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Medications</CardTitle>
              <Tablets className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>Manage medication inventory and information.</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingVisits />
        <RecentActivity />
      </div>
    </div>
  )
}
