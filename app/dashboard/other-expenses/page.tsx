"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import {
  OtherExpense,
  ExpenseFilters,
} from "@/components/custom/other-expenses/types";
import { ExpenseFiltersComponent } from "@/components/custom/other-expenses/expense-filters";
import { ExpenseTable } from "@/components/custom/other-expenses/expense-table";
import { ExpenseMobileList } from "@/components/custom/other-expenses/expense-mobile-list";
import { ExpensePagination } from "@/components/custom/other-expenses/expense-pagination";
import { ExpenseStats } from "@/components/custom/other-expenses/expense-stats";
import { formatCurrency } from "@/lib/utils/format_utils";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { otherExpensesService } from "@/lib/services/other-expenses.service";

export default function Page() {
  const [expenses, setExpenses] = useState<OtherExpense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({
    searchQuery: "",
    selectedBranch: "all",
    dateFilter: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 10;

  // Debounce search queries to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);
  const debouncedBranchFilter = useDebounce(filters.selectedBranch, 300);

  // Fetch expenses from Supabase on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedExpenses = await otherExpensesService.fetchExpenses();
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to load expenses. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Handle filter changes with loading animation
  useEffect(() => {
    if (!isLoading) {
      setIsFiltering(true);
      setCurrentPage(1); // Reset to first page when filtering

      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [
    debouncedSearchQuery,
    debouncedBranchFilter,
    filters.dateFilter,
    isLoading,
  ]);

  // Filter expenses using debounced values
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.description
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        expense.branch
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase());
      const matchesBranch =
        debouncedBranchFilter === "all" ||
        debouncedBranchFilter === "" ||
        expense.branch
          .toLowerCase()
          .includes(debouncedBranchFilter.toLowerCase());
      const matchesDate = filters.dateFilter
        ? new Date(expense.date).toDateString() ===
          filters.dateFilter.toDateString()
        : true;
      return matchesSearch && matchesBranch && matchesDate;
    });
  }, [
    expenses,
    debouncedSearchQuery,
    debouncedBranchFilter,
    filters.dateFilter,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = filteredExpenses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate totals
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const hasFilters =
    !!filters.dateFilter ||
    filters.selectedBranch !== "all" ||
    !!filters.searchQuery;

  const showLoading = isLoading || isFiltering;

  const handleAddExpense = async (expense: OtherExpense) => {
    setIsSubmitting(true);

    try {
      const newExpense = await otherExpensesService.createExpense({
        date: expense.date,
        amount: expense.amount,
        description: expense.description,
        branch: expense.branch,
      });

      setExpenses([newExpense, ...expenses]);
      toast.success("Expense added successfully!");
    } catch (error) {
      console.error("Error inserting expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setIsDeleting(true);

    try {
      await otherExpensesService.deleteExpense(id);

      // Remove from local state
      setExpenses(expenses.filter((expense) => expense.id !== id));
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditExpense = async (
    id: string,
    updatedExpense: Partial<OtherExpense>
  ) => {
    setIsEditing(true);

    try {
      const editedExpense = await otherExpensesService.updateExpense(
        id,
        updatedExpense
      );

      // Update local state
      setExpenses(
        expenses.map((expense) => (expense.id === id ? editedExpense : expense))
      );
      toast.success("Expense updated successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 p-6">
        <Card className="@container/card">
          <CardHeader className="pb-6">
            {/* Mobile optimized header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Other Expenses
                  </CardTitle>
                  <CardDescription>
                    Track and manage miscellaneous business expenses
                  </CardDescription>
                </div>
              </div>

              {/* Mobile stats row */}
              <div className="lg:hidden">
                <ExpenseStats
                  totalCount={expenses.length}
                  totalAmount={totalAmount}
                  filteredCount={filteredExpenses.length}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  hasFilters={hasFilters}
                  formatCurrency={formatCurrency}
                  isLoading={showLoading}
                  isMobile={true}
                />
              </div>

              {/* Desktop stats */}
              <div className="hidden lg:block">
                <ExpenseStats
                  totalCount={expenses.length}
                  totalAmount={totalAmount}
                  filteredCount={filteredExpenses.length}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  hasFilters={hasFilters}
                  formatCurrency={formatCurrency}
                  isLoading={showLoading}
                  isMobile={false}
                />
              </div>
            </div>

            <ExpenseFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onAddExpense={handleAddExpense}
              isSubmitting={isSubmitting}
            />
          </CardHeader>

          <CardContent className="pt-0">
            <ExpenseMobileList
              expenses={currentEntries}
              formatCurrency={formatCurrency}
              hasFilters={hasFilters}
              isLoading={showLoading}
              onDelete={handleDeleteExpense}
              onEdit={handleEditExpense}
              isDeleting={isDeleting}
              isEditing={isEditing}
            />

            <ExpenseTable
              expenses={currentEntries}
              formatCurrency={formatCurrency}
              isLoading={showLoading}
              onDelete={handleDeleteExpense}
              onEdit={handleEditExpense}
              isDeleting={isDeleting}
              isEditing={isEditing}
            />

            <ExpensePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
