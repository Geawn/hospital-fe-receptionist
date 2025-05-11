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
import { Plus, MoreHorizontal, Pencil, Trash2, ArrowLeft, Pill } from "lucide-react"
import { type Visit, type Patient, getVisits, getPatient, deleteVisit } from "@/lib/api"
import { format } from "date-fns"

export default function PatientVisitsPage({ params }: { params: { id: string } }) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)
  const [page, setPage] = useState(0)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [visitToDelete, setVisitToDelete] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPatient()
    fetchVisits()
  }, [page])

  const fetchPatient = async () => {
    const data = await getPatient(params.id)
    setPatient(data)
  }

  const fetchVisits = async () => {
    const data = await getVisits(params.id, page, limit)
    setVisits(data)

    // Mock total pages for demo
    setTotalPages(2)
  }

  const handleDeleteClick = (visitId: number) => {
    setVisitToDelete(visitId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (visitToDelete) {
      const success = await deleteVisit(params.id, visitToDelete)
      if (success) {
        fetchVisits()
      }
      setIsDeleteDialogOpen(false)
      setVisitToDelete(null)
    }
  }

  const navigateToVisitForm = (visitId?: number) => {
    if (visitId) {
      router.push(`/dashboard/patients/${params.id}/visits/edit/${visitId}`)
    } else {
      router.push(`/dashboard/patients/${params.id}/visits/new`)
    }
  }

  const navigateToPrescriptions = (visitId: number) => {
    router.push(`/dashboard/patients/${params.id}/visits/${visitId}/prescriptions`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/patients")} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Patient Visits</h1>
          <p className="text-muted-foreground">
            {patient ? `${patient.firstName} ${patient.lastName}` : "Loading patient..."}
          </p>
        </div>
        <Button onClick={() => navigateToVisitForm()}>
          <Plus className="mr-2 h-4 w-4" /> Add Visit
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visit Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Symptoms</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.length > 0 ? (
              visits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>{visit.visitTime ? format(new Date(visit.visitTime), "MMM dd, yyyy") : "N/A"}</TableCell>
                  <TableCell>
                    {visit.doctor ? `Dr. ${visit.doctor.firstName} ${visit.doctor.lastName}` : "N/A"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{visit.symptoms}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{visit.diagnosis}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{visit.treatment}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigateToVisitForm(visit.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigateToPrescriptions(visit.id)}>
                          <Pill className="mr-2 h-4 w-4" />
                          Prescriptions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(visit.id)}
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
                  No visits found for this patient.
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the visit record and all associated
              prescriptions.
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
