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
import { OtherExpense } from "./types";

interface DeleteExpenseDialogProps {
  expense: OtherExpense;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteExpenseDialog({
  expense,
  onDelete,
  isDeleting = false,
}: DeleteExpenseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(expense.id!);
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
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(expense.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Amount:</strong> ₱{expense.amount.toLocaleString()}
                </div>
                <div>
                  <strong>Branch:</strong> {expense.branch}
                </div>
                <div>
                  <strong>Description:</strong> {expense.description}
                </div>
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
