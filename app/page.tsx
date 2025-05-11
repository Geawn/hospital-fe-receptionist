"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Hospital } from "lucide-react"

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string>("receptionist")
  const router = useRouter()

  const handleLogin = () => {
    // Store the selected role in localStorage for mock authentication
    localStorage.setItem("userRole", selectedRole)
    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Hospital className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Hospital Management System</CardTitle>
          <CardDescription>Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue="receptionist"
            value={selectedRole}
            onValueChange={setSelectedRole}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 border p-4 rounded-md">
              <RadioGroupItem value="receptionist" id="receptionist" />
              <Label htmlFor="receptionist" className="flex-1 cursor-pointer">
                Receptionist
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-md opacity-60">
              <RadioGroupItem value="doctor" id="doctor" disabled />
              <Label htmlFor="doctor" className="flex-1 cursor-not-allowed">
                Doctor (Coming Soon)
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-md opacity-60">
              <RadioGroupItem value="admin" id="admin" disabled />
              <Label htmlFor="admin" className="flex-1 cursor-not-allowed">
                Administrator (Coming Soon)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
