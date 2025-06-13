"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, DollarSign, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { OtherExpense } from "./types";
import { ExpenseMobileListSkeleton } from "./expense-skeleton";
import { DeleteExpenseDialog } from "./delete-expense-dialog";
import { AddExpenseDialog } from "./add-expense-dialog";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";

interface ExpenseMobileListProps {
  expenses: OtherExpense[];
  formatCurrency: (value: number) => string;
  hasFilters: boolean;
  isLoading?: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, expense: Partial<OtherExpense>) => Promise<void>;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function ExpenseMobileList({
  expenses,
  formatCurrency,
  hasFilters,
  isLoading = false,
  onDelete,
  onEdit,
  isDeleting = false,
  isEditing = false,
}: ExpenseMobileListProps) {
  if (isLoading) {
    return <ExpenseMobileListSkeleton />;
  }

  return (
    <div className="block lg:hidden">
      <div className="space-y-3">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <Card
              key={expense.id}
              className="overflow-hidden animate-in slide-in-from-bottom-2 duration-300"
            >
              <div className="p-4">
                {/* Header with date and actions */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(new Date(expense.date), "MMM d, yyyy")}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={isEditing || isDeleting}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AddExpenseDialog
                        mode="edit"
                        expense={expense}
                        onEditExpense={onEdit}
                        isSubmitting={isEditing}
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuItem
                        onSelect={async (e) => {
                          e.preventDefault();
                          if (
                            window.confirm(
                              "Are you sure you want to delete this expense?"
                            )
                          ) {
                            await onDelete(expense.id!);
                          }
                        }}
                        className="text-red-600 focus:text-red-600"
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Amount and branch */}
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-xl text-primary">
                    {formatCurrency(expense.amount)}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {expense.branch}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {expense.description}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 animate-in fade-in-0 duration-300">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No expenses found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {hasFilters
                ? "Try adjusting your search criteria to see more results."
                : "Add your first expense to get started tracking your business expenses."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
