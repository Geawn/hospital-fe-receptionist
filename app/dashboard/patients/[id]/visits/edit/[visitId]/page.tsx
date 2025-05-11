"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPatient, updateVisit, type Patient, type Visit } from "@/lib/api"
import { ArrowLeft, Save } from "lucide-react"

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

export default function EditVisitPage({ params }: { params: { id: string; visitId: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    visitTime: "",
    symptoms: "",
    treatment: "",
    diagnosis: "",
    notes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const patientData = await getPatient(params.id)
        const visitData = await getVisit(params.id, Number.parseInt(params.visitId))

        setPatient(patientData)

        if (visitData) {
          // Format date to YYYY-MM-DD for input
          const formattedDate = visitData.visitTime ? new Date(visitData.visitTime).toISOString().split("T")[0] : ""

          setFormData({
            visitTime: formattedDate,
            symptoms: visitData.symptoms,
            treatment: visitData.treatment,
            diagnosis: visitData.diagnosis,
            notes: visitData.notes,
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, params.visitId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert date to ISO format for API
      const visitData = {
        ...formData,
        visitTime: new Date(formData.visitTime).toISOString(),
      }

      const result = await updateVisit(params.id, Number.parseInt(params.visitId), visitData)
      if (result) {
        router.push(`/dashboard/patients/${params.id}/visits`)
      }
    } catch (error) {
      console.error("Error updating visit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading visit data...</div>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Visit</h1>
          <p className="text-muted-foreground">
            {patient ? `Patient: ${patient.firstName} ${patient.lastName}` : "Loading patient..."}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Visit Information</CardTitle>
            <CardDescription>Update the details for this patient visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="visitTime">Visit Date</Label>
              <Input
                id="visitTime"
                name="visitTime"
                type="date"
                value={formData.visitTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Textarea id="treatment" name="treatment" value={formData.treatment} onChange={handleChange} rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/patients/${params.id}/visits`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
