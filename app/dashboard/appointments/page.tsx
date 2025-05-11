"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentType: string;
  description: string;
  fromDate: string;
  toDate: string;
  appointmentStatus: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    appointmentType: "",
    description: "",
    fromDate: "",
    toDate: "",
  });

  const appointmentTypes = [
    "RE_EXAMINATION",
    "SURGERY",
    "GET_RESULTS",
    "EXAMINATION",
    "GET_TEST_RESULTS",
  ];

  const appointmentStatuses = [
    "WAITING",
    "CONFIRMED",
    "REJECTED",
    "COMPLETED",
    "CANCELED",
    "EXPIRED",
  ];

  const handleCreateAppointment = async () => {
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppointment),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        // Refresh appointments list
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientId" className="text-right">
                  Patient ID
                </Label>
                <Input
                  id="patientId"
                  className="col-span-3"
                  value={newAppointment.patientId}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      patientId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctorId" className="text-right">
                  Doctor ID
                </Label>
                <Input
                  id="doctorId"
                  className="col-span-3"
                  value={newAppointment.doctorId}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      doctorId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="appointmentType" className="text-right">
                  Type
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewAppointment({
                      ...newAppointment,
                      appointmentType: value,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  className="col-span-3"
                  value={newAppointment.description}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fromDate" className="text-right">
                  From Date
                </Label>
                <Input
                  id="fromDate"
                  type="datetime-local"
                  className="col-span-3"
                  value={newAppointment.fromDate}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      fromDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="toDate" className="text-right">
                  To Date
                </Label>
                <Input
                  id="toDate"
                  type="datetime-local"
                  className="col-span-3"
                  value={newAppointment.toDate}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      toDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateAppointment}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient ID</TableHead>
            <TableHead>Doctor ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>From Date</TableHead>
            <TableHead>To Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.id}</TableCell>
              <TableCell>{appointment.patientId}</TableCell>
              <TableCell>{appointment.doctorId}</TableCell>
              <TableCell>{appointment.appointmentType}</TableCell>
              <TableCell>{appointment.description}</TableCell>
              <TableCell>
                {format(new Date(appointment.fromDate), "PPpp")}
              </TableCell>
              <TableCell>
                {format(new Date(appointment.toDate), "PPpp")}
              </TableCell>
              <TableCell>{appointment.appointmentStatus}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    try {
                      await fetch(`/api/appointments/${appointment.id}`, {
                        method: "DELETE",
                      });
                      fetchAppointments();
                    } catch (error) {
                      console.error("Error deleting appointment:", error);
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 