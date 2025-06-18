"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Phone, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Employee } from "@/lib/types/employee";
import { EmployeeMobileListSkeleton } from "./employee-skeleton";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";
import { AddEmployeeDialog } from "./add-employee-dialog";
import { Edit } from "lucide-react";

interface EmployeeMobileListProps {
  employees: Employee[];
  isLoading?: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, employee: Partial<Employee>) => Promise<void>;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function EmployeeMobileList({
  employees,
  isLoading = false,
  onDelete,
  onEdit,
  isDeleting = false,
  isEditing = false,
}: EmployeeMobileListProps) {
  if (isLoading) {
    return <EmployeeMobileListSkeleton />;
  }

  const formatDateOfBirth = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const getGenderBadgeVariant = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "default";
      case "female":
        return "secondary";
      case "other":
        return "outline";
      default:
        return "outline";
    }
  };

  if (employees.length === 0) {
    return (
      <div className="lg:hidden">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No employees found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-3">
      {employees.map((employee, index) => (
        <Card
          key={employee.id}
          className="p-4 animate-in fade-in-0 duration-300"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="font-medium">
                  {employee.first_name} {employee.last_name}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getGenderBadgeVariant(employee.gender)} className="text-xs">
                    {employee.gender || "Not specified"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <AddEmployeeDialog
                  mode="edit"
                  employee={employee}
                  onEditEmployee={onEdit}
                  isSubmitting={isEditing}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      disabled={isEditing || isDeleting}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  }
                />
                <DeleteEmployeeDialog
                  employee={employee}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </div>
                <div className="font-medium">
                  {employee.phone_number || "Not provided"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Birth Date
                </div>
                <div className="font-medium">
                  {formatDateOfBirth(employee.date_of_birth)}
                </div>
              </div>
            </div>

            {employee.address && (
              <div className="text-sm">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Address
                </div>
                <div className="font-medium line-clamp-2">
                  {employee.address}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
