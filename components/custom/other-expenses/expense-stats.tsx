"use client";

import { Badge } from "@/components/ui/badge";
import { ExpenseStatsSkeleton } from "./expense-skeleton";

interface ExpenseStatsProps {
  totalCount: number;
  totalAmount: number;
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  hasFilters: boolean;
  formatCurrency: (value: number) => string;
  isLoading?: boolean;
  isMobile?: boolean;
}

export function ExpenseStats({
  totalCount,
  totalAmount,
  filteredCount,
  currentPage,
  itemsPerPage,
  hasFilters,
  formatCurrency,
  isLoading = false,
  isMobile = false,
}: ExpenseStatsProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (isLoading) {
    return <ExpenseStatsSkeleton />;
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 animate-in fade-in-0 duration-300">
        {/* Mobile compact layout */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-sm">
            {totalCount} {totalCount === 1 ? "Expense" : "Expenses"}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Total: {formatCurrency(totalAmount)}
          </Badge>
        </div>

        {/* Results summary for mobile */}
        {filteredCount > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filteredCount} {filteredCount === 1 ? "expense" : "expenses"}{" "}
              {hasFilters ? "filtered" : "total"}
            </span>
            <span>
              Showing {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredCount)} of{" "}
              {filteredCount}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Header Stats */}
      <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in-0 duration-300">
        <Badge variant="secondary" className="justify-center sm:justify-start">
          {totalCount} {totalCount === 1 ? "Expense" : "Expenses"}
        </Badge>
        <Badge variant="outline" className="justify-center sm:justify-start">
          Total: {formatCurrency(totalAmount)}
        </Badge>
      </div>

      {/* Desktop Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-6 animate-in slide-in-from-bottom-1 duration-300">
        <Badge variant="secondary" className="text-sm w-fit">
          {filteredCount} {filteredCount === 1 ? "expense" : "expenses"}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {hasFilters ? "filtered" : "total"}
        </span>
        {filteredCount > 0 && (
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredCount)} of{" "}
            {filteredCount}
          </span>
        )}
      </div>
    </>
  );
}
