"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Search, CalendarIcon, Building2Icon } from "lucide-react";
import { ExpenseFilters } from "./types";
import { AddExpenseDialog } from "./add-expense-dialog";
import { OtherExpense } from "./types";

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  onAddExpense: (expense: OtherExpense) => Promise<void>;
  isSubmitting?: boolean;
}

export function ExpenseFiltersComponent({
  filters,
  onFiltersChange,
  onAddExpense,
  isSubmitting = false,
}: ExpenseFiltersProps) {
  const { searchQuery, selectedBranch, dateFilter } = filters;

  const updateFilters = (updates: Partial<ExpenseFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearDateFilter = () => {
    updateFilters({ dateFilter: undefined });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: "",
      selectedBranch: "all",
      dateFilter: undefined,
    });
  };

  const hasActiveFilters =
    dateFilter || selectedBranch !== "all" || searchQuery;

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Branch Filter */}
          <div className="relative">
            <Building2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Filter by branch..."
              value={selectedBranch === "all" ? "" : selectedBranch}
              onChange={(e) =>
                updateFilters({ selectedBranch: e.target.value || "all" })
              }
              className="pl-9 w-48 h-10"
            />
          </div>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-48 h-10 justify-start text-left font-normal",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? (
                  format(dateFilter, "PPP")
                ) : (
                  <span>Filter by date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={(date) => updateFilters({ dateFilter: date })}
                initialFocus
              />
              {dateFilter && (
                <div className="p-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearDateFilter}
                    className="w-full"
                  >
                    Clear filter
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          <AddExpenseDialog
            onAddExpense={onAddExpense}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="text-xs">
              Search: "{searchQuery}"
              <button
                onClick={() => updateFilters({ searchQuery: "" })}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedBranch !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Branch: {selectedBranch}
              <button
                onClick={() => updateFilters({ selectedBranch: "all" })}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {dateFilter && (
            <Badge variant="secondary" className="text-xs">
              Date: {format(dateFilter, "MMM d, yyyy")}
              <button
                onClick={clearDateFilter}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
