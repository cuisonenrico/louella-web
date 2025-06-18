"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Plus, Edit, Loader2 } from "lucide-react";
import { Employee, CreateEmployeeData } from "@/lib/types/employee";
import { AddressSelector } from "./address-selector";

interface AddEmployeeDialogProps {
  mode?: "add" | "edit";
  employee?: Employee;
  onAddEmployee?: (employee: CreateEmployeeData) => Promise<void>;
  onEditEmployee?: (id: string, employee: Partial<Employee>) => Promise<void>;
  isSubmitting?: boolean;
  trigger?: React.ReactNode;
}

export function AddEmployeeDialog({
  mode = "add",
  employee,
  onAddEmployee,
  onEditEmployee,
  isSubmitting = false,
  trigger,
}: AddEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateEmployeeData>({
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    gender: undefined,
    address: "",
  });

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && employee) {
        setFormData({
          first_name: employee.first_name,
          last_name: employee.last_name,
          phone_number: employee.phone_number || "",
          date_of_birth: employee.date_of_birth || "",
          gender: employee.gender,
          address: employee.address || "",
        });
      } else {
        setFormData({
          first_name: "",
          last_name: "",
          phone_number: "",
          date_of_birth: "",
          gender: undefined,
          address: "",
        });
      }
    }
  }, [open, mode, employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      return;
    }

    try {
      if (mode === "edit" && employee && onEditEmployee) {
        await onEditEmployee(employee.id, formData);
      } else if (mode === "add" && onAddEmployee) {
        await onAddEmployee(formData);
      }
      setOpen(false);
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Form submission failed:", error);
    }
  };

  const isFormValid = formData.first_name.trim() && formData.last_name.trim();

  const defaultTrigger = (
    <Button size="sm">
      {mode === "edit" ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
      {mode === "edit" ? "" : "Add Employee"}
    </Button>
  );

  const handleAddressChange = useCallback((address: string) => {
    setFormData(prev => ({ ...prev, address }));
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the employee information below."
              : "Enter the employee information below to add them to the system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      gender: value as "Male" | "Female" | "Other",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <AddressSelector
                value={formData.address || ""}
                onChange={handleAddressChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Adding..."}
                </>
              ) : (
                mode === "edit" ? "Update" : "Add Employee"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}