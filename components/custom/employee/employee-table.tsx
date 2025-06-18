"use client";

import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Employee } from "@/lib/types/employee";
import { EmployeeTableSkeleton } from "./employee-skeleton";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";
import { AddEmployeeDialog } from "./add-employee-dialog";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading?: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, employee: Partial<Employee>) => Promise<void>;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function EmployeeTable({
  employees,
  isLoading = false,
  onDelete,
  onEdit,
  isDeleting = false,
  isEditing = false,
}: EmployeeTableProps) {
  if (isLoading) {
    return <EmployeeTableSkeleton />;
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

  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Name
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Phone
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Gender
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Date of Birth
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-center whitespace-nowrap w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-muted/50 transition-colors border-b border-border/50 animate-in fade-in-0 duration-300"
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {employee.first_name} {employee.last_name}
                      </div>
                      {employee.address && (
                        <div className="text-xs text-muted-foreground max-w-xs truncate">
                          {employee.address}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {employee.phone_number || "Not provided"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={getGenderBadgeVariant(employee.gender)} className="text-xs">
                      {employee.gender || "Not specified"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {formatDateOfBirth(employee.date_of_birth)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground animate-in fade-in-0 duration-300"
                >
                  No employees found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
