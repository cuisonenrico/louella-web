"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { Employee } from "@/lib/types/employee";

interface DeleteEmployeeDialogProps {
  employee: Employee;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteEmployeeDialog({
  employee,
  onDelete,
  isDeleting = false,
}: DeleteEmployeeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(employee.id);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {employee.first_name} {employee.last_name}
                </div>
                {employee.phone_number && (
                  <div>
                    <strong>Phone:</strong> {employee.phone_number}
                  </div>
                )}
                {employee.gender && (
                  <div>
                    <strong>Gender:</strong> {employee.gender}
                  </div>
                )}
                {employee.date_of_birth && (
                  <div>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(employee.date_of_birth).toLocaleDateString()}
                  </div>
                )}
                {employee.address && (
                  <div>
                    <strong>Address:</strong> {employee.address}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
