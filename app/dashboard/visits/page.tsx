"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-group"
import { Plus, MoreHorizontal, Eye, Search, Calendar } from "lucide-react"
import { format } from "date-fns"

// Mock data for all visits
interface AllVisit {
  id: number
  visitTime: string
  patientName: string
  patientId: string
  doctorName: string
  symptoms: string
  diagnosis: string
}

// Mock function to get all visits
const getAllVisits = async (page: number, limit: number): Promise<AllVisit[]> => {
  // This would be a real API call in a production app
  return [
    {
      id: 1,
      visitTime: "2025-05-01T10:00:00.000Z",
      patientName: "John Doe",
      patientId: "1",
      doctorName: "Dr. Sarah Johnson",
      symptoms: "Fever and headache",
      diagnosis: "Common cold",
    },
    {
      id: 2,
      visitTime: "2025-05-02T14:30:00.000Z",
      patientName: "Jane Smith",
      patientId: "2",
      doctorName: "Dr. Michael Brown",
      symptoms: "Sore throat and cough",
      diagnosis: "Strep throat",
    },
    {
      id: 3,
      visitTime: "2025-05-03T09:15:00.000Z",
      patientName: "Robert Johnson",
      patientId: "3",
      doctorName: "Dr. John Smith",
      symptoms: "Back pain",
      diagnosis: "Muscle strain",
    },
    {
      id: 4,
      visitTime: "2025-05-04T11:45:00.000Z",
      patientName: "Emily Davis",
      patientId: "4",
      doctorName: "Dr. Sarah Johnson",
      symptoms: "Rash and itching",
      diagnosis: "Allergic reaction",
    },
    {
      id: 5,
      visitTime: "2025-05-05T16:00:00.000Z",
      patientName: "Michael Wilson",
      patientId: "5",
      doctorName: "Dr. Michael Brown",
      symptoms: "Stomach pain and nausea",
      diagnosis: "Gastroenteritis",
    },
  ]
}

export default function VisitsPage() {
  const [visits, setVisits] = useState<AllVisit[]>([])
  const [page, setPage] = useState(0)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchVisits()
  }, [page])

  const fetchVisits = async () => {
    const data = await getAllVisits(page, limit)
    setVisits(data)

    // Mock total pages for demo
    setTotalPages(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would implement search functionality
    fetchVisits()
  }

  const navigateToPatientVisits = (patientId: string) => {
    router.push(`/dashboard/patients/${patientId}/visits`)
  }

  const navigateToNewVisit = () => {
    // In a real app, you would first select a patient
    router.push("/dashboard/patients")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Visits</h1>
          <p className="text-muted-foreground">View and manage all patient visits</p>
        </div>
        <Button onClick={navigateToNewVisit}>
          <Plus className="mr-2 h-4 w-4" /> New Visit
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search visits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Symptoms</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.length > 0 ? (
              visits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>{format(new Date(visit.visitTime), "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell className="font-medium">{visit.patientName}</TableCell>
                  <TableCell>{visit.doctorName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{visit.symptoms}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{visit.diagnosis}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigateToPatientVisits(visit.patientId)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigateToPatientVisits(visit.patientId)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Patient Visits
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No visits found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {visits.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(0, page - 1))}
                className={page === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setPage(i)} isActive={page === i}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                className={page === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
