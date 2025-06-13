"use client";

import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { OtherExpense } from "./types";
import { ExpenseTableSkeleton } from "./expense-skeleton";
import { DeleteExpenseDialog } from "./delete-expense-dialog";
import { AddExpenseDialog } from "./add-expense-dialog";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpenseTableProps {
  expenses: OtherExpense[];
  formatCurrency: (value: number) => string;
  isLoading?: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, expense: Partial<OtherExpense>) => Promise<void>;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function ExpenseTable({
  expenses,
  formatCurrency,
  isLoading = false,
  onDelete,
  onEdit,
  isDeleting = false,
  isEditing = false,
}: ExpenseTableProps) {
  if (isLoading) {
    return <ExpenseTableSkeleton />;
  }

  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Date
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Amount
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Branch
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Description
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-center whitespace-nowrap w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-muted/50 transition-colors border-b border-border/50 animate-in fade-in-0 duration-300"
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(expense.date), "MMMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {expense.branch}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="max-w-md">
                      <p className="line-clamp-2">{expense.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <AddExpenseDialog
                        mode="edit"
                        expense={expense}
                        onEditExpense={onEdit}
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
                      <DeleteExpenseDialog
                        expense={expense}
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
                  No expenses found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
