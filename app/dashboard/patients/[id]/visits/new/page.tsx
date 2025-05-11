"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createVisit, getPatient, getDoctors, type Patient, type Doctor } from "@/lib/api"
import { ArrowLeft, Save } from "lucide-react"

export default function NewVisitPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [formData, setFormData] = useState({
    visitTime: new Date().toISOString().split("T")[0],
    symptoms: "",
    treatment: "",
    diagnosis: "",
    notes: "",
    doctorId: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const patientData = await getPatient(params.id)
      const doctorsData = await getDoctors()

      setPatient(patientData)
      setDoctors(doctorsData)

      if (doctorsData.length > 0) {
        setFormData((prev) => ({ ...prev, doctorId: doctorsData[0].id }))
      }
    }

    fetchData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
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

      const result = await createVisit(params.id, visitData)
      if (result) {
        router.push(`/dashboard/patients/${params.id}/visits`)
      }
    } catch (error) {
      console.error("Error creating visit:", error)
    } finally {
      setIsSubmitting(false)
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Visit</h1>
          <p className="text-muted-foreground">
            {patient ? `Patient: ${patient.firstName} ${patient.lastName}` : "Loading patient..."}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Visit Information</CardTitle>
            <CardDescription>Enter the details for this patient visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <Label htmlFor="doctorId">Doctor</Label>
                <Select value={formData.doctorId} onValueChange={(value) => handleSelectChange("doctorId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              {isSubmitting ? "Saving..." : "Save Visit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
