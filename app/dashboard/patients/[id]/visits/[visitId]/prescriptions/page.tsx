"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, MoreHorizontal, Pencil, Trash2, ArrowLeft } from "lucide-react"
import {
  type Prescription,
  type Patient,
  type Visit,
  getPrescriptions,
  getPatient,
  deletePrescription,
} from "@/lib/api"

// Mock function to get a visit by ID (would be in api.ts in a real app)
const getVisit = async (patientId: string, visitId: number): Promise<Visit | null> => {
  // This would be a real API call in a production app
  return {
    id: visitId,
    visitTime: "2025-05-10T18:30:09.308Z",
    symptoms: "Fever and headache",
    treatment: "Rest and hydration",
    diagnosis: "Common cold",
    notes: "Follow up in a week if symptoms persist",
    patient: {
      id: patientId,
      firstName: "John",
      lastName: "Doe",
      gender: "MALE",
      dateOfBirth: "1980-01-01T00:00:00.000Z",
      email: "john.doe@example.com",
      contactNumber: "123-456-7890",
    },
    doctor: {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@hospital.com",
      specialization: "General Medicine",
      contactNumber: "123-456-7891",
    },
  }
}

export default function PrescriptionsPage({ params }: { params: { id: string; visitId: string } }) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)
  const [visit, setVisit] = useState<Visit | null>(null)
  const [page, setPage] = useState(0)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [page])

  const fetchData = async () => {
    const patientData = await getPatient(params.id)
    const visitData = await getVisit(params.id, Number.parseInt(params.visitId))
    const prescriptionsData = await getPrescriptions(params.id, Number.parseInt(params.visitId), page, limit)

    setPatient(patientData)
    setVisit(visitData)
    setPrescriptions(prescriptionsData)

    // Mock total pages for demo
    setTotalPages(1)
  }

  const handleDeleteClick = (prescriptionId: number) => {
    setPrescriptionToDelete(prescriptionId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (prescriptionToDelete) {
      const success = await deletePrescription(params.id, Number.parseInt(params.visitId), prescriptionToDelete)
      if (success) {
        fetchData()
      }
      setIsDeleteDialogOpen(false)
      setPrescriptionToDelete(null)
    }
  }

  const navigateToPrescriptionForm = (prescriptionId?: number) => {
    if (prescriptionId) {
      router.push(`/dashboard/patients/${params.id}/visits/${params.visitId}/prescriptions/edit/${prescriptionId}`)
    } else {
      router.push(`/dashboard/patients/${params.id}/visits/${params.visitId}/prescriptions/new`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/patients/${params.id}/visits`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">
            {patient ? `Patient: ${patient.firstName} ${patient.lastName}` : "Loading patient..."}
            {visit ? ` | Visit: ${new Date(visit.visitTime).toLocaleDateString()}` : ""}
          </p>
        </div>
        <Button onClick={() => navigateToPrescriptionForm()}>
          <Plus className="mr-2 h-4 w-4" /> Add Prescription
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Duration (days)</TableHead>
              <TableHead>Instructions</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">{prescription.medication.name}</TableCell>
                  <TableCell>{prescription.medication.dosage}</TableCell>
                  <TableCell>{prescription.quantity}</TableCell>
                  <TableCell>{prescription.duration}</TableCell>
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
                        <DropdownMenuItem onClick={() => navigateToPrescriptionForm(prescription.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(prescription.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No prescriptions found for this visit.
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the prescription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
