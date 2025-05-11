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

// Mock data for all prescriptions
interface AllPrescription {
  id: number
  medicationName: string
  dosage: string
  patientName: string
  patientId: string
  visitId: number
  visitDate: string
  doctorName: string
  quantity: number
  instructions: string
}

// Mock function to get all prescriptions
const getAllPrescriptions = async (page: number, limit: number): Promise<AllPrescription[]> => {
  // This would be a real API call in a production app
  return [
    {
      id: 1,
      medicationName: "Paracetamol",
      dosage: "500mg",
      patientName: "John Doe",
      patientId: "1",
      visitId: 1,
      visitDate: "2025-05-01T10:00:00.000Z",
      doctorName: "Dr. Sarah Johnson",
      quantity: 20,
      instructions: "Take one tablet every 6 hours as needed for pain",
    },
    {
      id: 2,
      medicationName: "Amoxicillin",
      dosage: "250mg",
      patientName: "Jane Smith",
      patientId: "2",
      visitId: 2,
      visitDate: "2025-05-02T14:30:00.000Z",
      doctorName: "Dr. Michael Brown",
      quantity: 30,
      instructions: "Take one capsule three times daily with food",
    },
    {
      id: 3,
      medicationName: "Ibuprofen",
      dosage: "400mg",
      patientName: "Robert Johnson",
      patientId: "3",
      visitId: 3,
      visitDate: "2025-05-03T09:15:00.000Z",
      doctorName: "Dr. John Smith",
      quantity: 15,
      instructions: "Take one tablet every 8 hours with food",
    },
    {
      id: 4,
      medicationName: "Loratadine",
      dosage: "10mg",
      patientName: "Emily Davis",
      patientId: "4",
      visitId: 4,
      visitDate: "2025-05-04T11:45:00.000Z",
      doctorName: "Dr. Sarah Johnson",
      quantity: 10,
      instructions: "Take one tablet daily",
    },
    {
      id: 5,
      medicationName: "Omeprazole",
      dosage: "20mg",
      patientName: "Michael Wilson",
      patientId: "5",
      visitId: 5,
      visitDate: "2025-05-05T16:00:00.000Z",
      doctorName: "Dr. Michael Brown",
      quantity: 28,
      instructions: "Take one capsule daily before breakfast",
    },
  ]
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<AllPrescription[]>([])
  const [page, setPage] = useState(0)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchPrescriptions()
  }, [page])

  const fetchPrescriptions = async () => {
    const data = await getAllPrescriptions(page, limit)
    setPrescriptions(data)

    // Mock total pages for demo
    setTotalPages(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would implement search functionality
    fetchPrescriptions()
  }

  const navigateToVisitPrescriptions = (patientId: string, visitId: number) => {
    router.push(`/dashboard/patients/${patientId}/visits/${visitId}/prescriptions`)
  }

  const navigateToNewPrescription = () => {
    // In a real app, you would first select a patient and visit
    router.push("/dashboard/patients")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Prescriptions</h1>
          <p className="text-muted-foreground">View and manage all patient prescriptions</p>
        </div>
        <Button onClick={navigateToNewPrescription}>
          <Plus className="mr-2 h-4 w-4" /> New Prescription
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search prescriptions..."
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
              <TableHead>Medication</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Instructions</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">
                    {prescription.medicationName} ({prescription.dosage})
                  </TableCell>
                  <TableCell>{prescription.patientName}</TableCell>
                  <TableCell>{format(new Date(prescription.visitDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{prescription.doctorName}</TableCell>
                  <TableCell>{prescription.quantity}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{prescription.instructions}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigateToVisitPrescriptions(prescription.patientId, prescription.visitId)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigateToVisitPrescriptions(prescription.patientId, prescription.visitId)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Visit Prescriptions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No prescriptions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {prescriptions.length > 0 && (
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
