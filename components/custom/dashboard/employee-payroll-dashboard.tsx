"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayrollEntry } from "@/lib/types/payroll";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { usePayrollFilters } from "@/hooks/use-payroll-filters";
import { PayrollFilters } from "./payroll-filters";
import { PayrollMobileView } from "./payroll-mobile-view";
import { PayrollDesktopTable } from "./payroll-desktop-table";
import { usePagination } from "@/hooks/use-pagination";

interface EmployeePayrollDashboardProps {
  entries?: PayrollEntry[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
};

export function EmployeePayrollDashboard({
  entries = [],
}: EmployeePayrollDashboardProps) {
  const {
    filters,
    setters,
    filteredEntries,
    availableYears,
    isFiltering,
    clearFilters,
    getFilterDisplayText,
  } = usePayrollFilters({ entries });

  const pagination = usePagination({
    totalItems: filteredEntries.length,
    initialItemsPerPage: 10,
  });

  // Reset pagination when filters change
  useEffect(() => {
    pagination.reset();
  }, [filteredEntries.length]);

  const currentEntries = useMemo(
    () => filteredEntries.slice(pagination.startIndex, pagination.endIndex),
    [filteredEntries, pagination.startIndex, pagination.endIndex]
  );

  return (
    <Card className="@container/card">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Employee Payroll Records
            </CardTitle>
            <CardDescription>
              Search and filter payroll entries by employee, branch, and period
            </CardDescription>
          </div>
        </div>

        <div className="mt-6">
          <PayrollFilters
            filters={filters}
            setters={setters}
            availableYears={availableYears}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Badge variant="secondary" className="text-sm w-fit">
              {filteredEntries.length}{" "}
              {filteredEntries.length === 1 ? "employee" : "employees"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              for {getFilterDisplayText()}
            </span>
            {filteredEntries.length > 0 && (
              <span className="text-sm text-muted-foreground">
                Showing {pagination.startIndex + 1}-
                {Math.min(pagination.endIndex, filteredEntries.length)} of{" "}
                {filteredEntries.length}
              </span>
            )}
          </div>

          {/* Items per page selector - Hide on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={pagination.itemsPerPage.toString()}
              onValueChange={(value) =>
                pagination.setItemsPerPage(parseInt(value))
              }
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <PayrollMobileView
          entries={currentEntries}
          isFiltering={isFiltering}
          formatCurrency={formatCurrency}
        />

        <PayrollDesktopTable
          entries={currentEntries}
          isFiltering={isFiltering}
          itemsPerPage={pagination.itemsPerPage}
          formatCurrency={formatCurrency}
        />

        {/* Pagination */}
        {filteredEntries.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-4 pt-4 border-t">
            {/* Mobile pagination */}
            <div className="flex sm:hidden items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.previousPage}
                disabled={!pagination.hasPreviousPage}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                {pagination.currentPage} / {pagination.totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={pagination.nextPage}
                disabled={!pagination.hasNextPage}
                className="h-8"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pagination.previousPage}
                  disabled={!pagination.hasPreviousPage}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(3, pagination.totalPages) },
                    (_, i) => {
                      let pageNumber: number;
                      if (pagination.totalPages <= 3) {
                        pageNumber = i + 1;
                      } else if (pagination.currentPage <= 2) {
                        pageNumber = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 1
                      ) {
                        pageNumber = pagination.totalPages - 2 + i;
                      } else {
                        pageNumber = pagination.currentPage - 1 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            pagination.currentPage === pageNumber
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => pagination.goToPage(pageNumber)}
                          className="h-8 w-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    }
                  )}

                  {pagination.totalPages > 3 &&
                    pagination.currentPage < pagination.totalPages - 1 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            pagination.goToPage(pagination.totalPages)
                          }
                          className="h-8 w-8 p-0"
                        >
                          {pagination.totalPages}
                        </Button>
                      </>
                    )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={pagination.nextPage}
                  disabled={!pagination.hasNextPage}
                  className="h-8"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No employees found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}
