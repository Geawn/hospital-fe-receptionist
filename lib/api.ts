// API base URL - replace with your actual API URL in production
const API_BASE_URL = "http://127.0.0.1:4897"

// Types
export type Gender = "MALE" | "FEMALE" | "OTHER"

export interface Patient {
  id: string
  firstName: string
  lastName: string
  gender: Gender
  dateOfBirth: string
  email: string
  contactNumber: string
  address?: string
}

export interface Doctor {
  id: string
  firstName: string
  lastName: string
  email: string
  specialization: string
  contactNumber: string
}

export interface Visit {
  id: number
  visitTime: string
  symptoms: string
  treatment: string
  diagnosis: string
  notes: string
  patient: Patient
  doctor: Doctor
}

export interface Medication {
  id: number
  name: string
  description: string
  dosage: string
}

export interface Prescription {
  id: number
  quantity: number
  instructions: string
  duration: number
  patientVisit: Visit
  medication: Medication
}

// Patient API
export async function getPatients(page = 0, limit = 10): Promise<Patient[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/page/${page}/limit/${limit}`)
    if (!response.ok) throw new Error("Failed to fetch patients")
    return await response.json()
  } catch (error) {
    console.error("Error fetching patients:", error)
    return []
  }
}

export async function getPatient(id: string): Promise<Patient | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`)
    if (!response.ok) throw new Error("Failed to fetch patient")
    return await response.json()
  } catch (error) {
    console.error("Error fetching patient:", error)
    return null
  }
}

export async function createPatient(patient: Omit<Patient, "id">): Promise<Patient | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    })
    if (!response.ok) throw new Error("Failed to create patient")
    return await response.json()
  } catch (error) {
    console.error("Error creating patient:", error)
    return null
  }
}

export async function updatePatient(id: string, patient: Omit<Patient, "id">): Promise<Patient | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    })
    if (!response.ok) throw new Error("Failed to update patient")
    return await response.json()
  } catch (error) {
    console.error("Error updating patient:", error)
    return null
  }
}

export async function deletePatient(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Error deleting patient:", error)
    return false
  }
}

// Visit API
export async function getVisits(patientId: string, page = 0, limit = 10): Promise<Visit[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/visits/page/${page}/limit/${limit}`)
    if (!response.ok) throw new Error("Failed to fetch visits")
    return await response.json()
  } catch (error) {
    console.error("Error fetching visits:", error)
    return []
  }
}

export async function createVisit(
  patientId: string,
  visit: {
    visitTime: string
    symptoms: string
    treatment: string
    diagnosis: string
    notes: string
    doctorId: string
  },
): Promise<Visit | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visit),
    })
    if (!response.ok) throw new Error("Failed to create visit")
    return await response.json()
  } catch (error) {
    console.error("Error creating visit:", error)
    return null
  }
}

export async function updateVisit(
  patientId: string,
  visitId: number,
  visit: {
    visitTime: string
    symptoms: string
    treatment: string
    diagnosis: string
    notes: string
  },
): Promise<Visit | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/visits/${visitId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visit),
    })
    if (!response.ok) throw new Error("Failed to update visit")
    return await response.json()
  } catch (error) {
    console.error("Error updating visit:", error)
    return null
  }
}

export async function deleteVisit(patientId: string, visitId: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/visits/${visitId}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Error deleting visit:", error)
    return false
  }
}

// Prescription API
export async function getPrescriptions(
  patientId: string,
  visitId: number,
  page = 0,
  limit = 10,
): Promise<Prescription[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/visits/${visitId}/page/${page}/limit/${limit}`)
    if (!response.ok) throw new Error("Failed to fetch prescriptions")
    return await response.json()
  } catch (error) {
    console.error("Error fetching prescriptions:", error)
    return []
  }
}

export async function createPrescription(
  patientId: string,
  visitId: number,
  prescription: {
    quantity: number
    instructions: string
    duration: number
    medicationId: number
  },
): Promise<Prescription | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/visits/${visitId}/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prescription),
    })
    if (!response.ok) throw new Error("Failed to create prescription")
    return await response.json()
  } catch (error) {
    console.error("Error creating prescription:", error)
    return null
  }
}

export async function updatePrescription(
  patientId: string,
  visitId: number,
  prescriptionId: number,
  prescription: {
    quantity: number
    instructions: string
    duration: number
    medicationId: number
  },
): Promise<Prescription | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/patients/${patientId}/visits/${visitId}/prescriptions/${prescriptionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescription),
      },
    )
    if (!response.ok) throw new Error("Failed to update prescription")
    return await response.json()
  } catch (error) {
    console.error("Error updating prescription:", error)
    return null
  }
}

export async function deletePrescription(patientId: string, visitId: number, prescriptionId: number): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/patients/${patientId}/visits/${visitId}/prescriptions/${prescriptionId}`,
      {
        method: "DELETE",
      },
    )
    return response.ok
  } catch (error) {
    console.error("Error deleting prescription:", error)
    return false
  }
}

// Medication API
export async function getMedications(page = 0, limit = 10): Promise<Medication[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/medications/page/${page}/limit/${limit}`)
    if (!response.ok) throw new Error("Failed to fetch medications")
    return await response.json()
  } catch (error) {
    console.error("Error fetching medications:", error)
    // Return mock data for development
    return mockMedications
  }
}

export async function getMedication(id: number): Promise<Medication | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/medications/${id}`)
    if (!response.ok) throw new Error("Failed to fetch medication")
    return await response.json()
  } catch (error) {
    console.error("Error fetching medication:", error)
    // Return mock data for development
    return mockMedications.find((med) => med.id === id) || null
  }
}

export async function createMedication(medication: Omit<Medication, "id">): Promise<Medication | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/medications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medication),
    })
    if (!response.ok) throw new Error("Failed to create medication")
    return await response.json()
  } catch (error) {
    console.error("Error creating medication:", error)
    // Mock response for development
    return {
      id: Math.floor(Math.random() * 1000) + 10,
      ...medication,
    }
  }
}

export async function updateMedication(id: number, medication: Omit<Medication, "id">): Promise<Medication | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/medications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medication),
    })
    if (!response.ok) throw new Error("Failed to update medication")
    return await response.json()
  } catch (error) {
    console.error("Error updating medication:", error)
    // Mock response for development
    return {
      id,
      ...medication,
    }
  }
}

export async function deleteMedication(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/medications/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Error deleting medication:", error)
    return true // Mock success for development
  }
}

// Mock data for development
export const mockDoctors: Doctor[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@hospital.com",
    specialization: "Cardiology",
    contactNumber: "123-456-7890",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hospital.com",
    specialization: "Neurology",
    contactNumber: "123-456-7891",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@hospital.com",
    specialization: "Pediatrics",
    contactNumber: "123-456-7892",
  },
]

export const mockMedications: Medication[] = [
  {
    id: 1,
    name: "Paracetamol",
    description: "Pain reliever and fever reducer",
    dosage: "500mg",
  },
  {
    id: 2,
    name: "Amoxicillin",
    description: "Antibiotic used to treat bacterial infections",
    dosage: "250mg",
  },
  {
    id: 3,
    name: "Loratadine",
    description: "Antihistamine for allergy relief",
    dosage: "10mg",
  },
]

// Function to get doctors (mock)
export async function getDoctors(): Promise<Doctor[]> {
  return mockDoctors
}
