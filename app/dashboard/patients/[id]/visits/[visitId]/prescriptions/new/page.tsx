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
import { createPrescription, getPatient, getMedications, type Patient, type Medication } from "@/lib/api"
import { ArrowLeft, Save } from "lucide-react"

export default function NewPrescriptionPage({ params }: { params: { id: string; visitId: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [formData, setFormData] = useState({
    quantity: 1,
    instructions: "",
    duration: 7,
    medicationId: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      const patientData = await getPatient(params.id)
      const medicationsData = await getMedications()

      setPatient(patientData)
      setMedications(medicationsData)

      if (medicationsData.length > 0) {
        setFormData((prev) => ({ ...prev, medicationId: medicationsData[0].id }))
      }
    }

    fetchData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "duration" ? Number.parseInt(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "medicationId" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createPrescription(params.id, Number.parseInt(params.visitId), formData)
      if (result) {
        router.push(`/dashboard/patients/${params.id}/visits/${params.visitId}/prescriptions`)
      }
    } catch (error) {
      console.error("Error creating prescription:", error)
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
          onClick={() => router.push(`/dashboard/patients/${params.id}/visits/${params.visitId}/prescriptions`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Prescription</h1>
          <p className="text-muted-foreground">
            {patient ? `Patient: ${patient.firstName} ${patient.lastName}` : "Loading patient..."}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Prescription Information</CardTitle>
            <CardDescription>Enter the details for this prescription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="medicationId">Medication</Label>
              <Select
                value={formData.medicationId.toString()}
                onValueChange={(value) => handleSelectChange("medicationId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  {medications.map((medication) => (
                    <SelectItem key={medication.id} value={medication.id.toString()}>
                      {medication.name} ({medication.dosage})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={3}
                placeholder="E.g., Take one tablet twice daily after meals"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/patients/${params.id}/visits/${params.visitId}/prescriptions`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Prescription"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
