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
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PayrollRow } from "./PayrollRow";

interface PayrollTableProps {
  payrollList: any[][];
  staticHeaders: string[];
  currencyHeaders: string[];
  title?: string;
  description?: string;
  payrollPeriod: string;
  branch?: string;
  totalEmployees?: number;
  totalNetSalary?: number;
}

export function PayrollTable({
  payrollList,
  staticHeaders,
  currencyHeaders,
  title = "Payroll Records",
  description = "Search and filter payroll entries by employee",
  payrollPeriod,
  branch,
  totalEmployees = 0,
  totalNetSalary = 0,
}: PayrollTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Memoize valid rows
  const validRows = useMemo(
    () => payrollList.filter((row) => row[1] && row[1] !== ""),
    [payrollList]
  );

  // Filter payroll data based on search query
  const filteredPayrollList = useMemo(() => {
    if (!searchQuery.trim()) return validRows;

    const query = searchQuery.toLowerCase();
    return validRows.filter((row) =>
      row[1]?.toString().toLowerCase().includes(query)
    );
  }, [validRows, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayrollList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = filteredPayrollList.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPayrollList.length]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatCurrency = (value: any) => {
    const numValue = parseFloat(value) || 0;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numValue);
  };

  // Helper function to get specific column values by header name
  const getColumnValue = (row: any[], headerName: string) => {
    if (headerName.toLowerCase() === "deduction") {
      // Calculate total deductions from SSS, PhilHealth, SSS Loan, CA, and Pag-IBIG
      const deductionFields = [
        "sss",
        "philhealth",
        "sssloan",
        "ca",
        "pag-ibig",
      ];
      let totalDeduction = 0;

      deductionFields.forEach((field) => {
        const index = staticHeaders.findIndex(
          (header) =>
            header.toLowerCase().includes(field.toLowerCase()) ||
            header
              .toLowerCase()
              .replace(/[-\s]/g, "")
              .includes(field.toLowerCase().replace(/[-\s]/g, ""))
        );
        if (index !== -1) {
          const value = parseFloat(row[index]) || 0;
          totalDeduction += value;
        }
      });

      return totalDeduction;
    }

    // For other fields, find by header name
    const index = staticHeaders.findIndex((header) =>
      header.toLowerCase().includes(headerName.toLowerCase())
    );
    return index !== -1 ? row[index] : "-";
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getFilterDisplayText = () => {
    return searchQuery ? `"${searchQuery}"` : "All periods";
  };

  return (
    <Card className="@container/card">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                {title} {payrollPeriod}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Badge
              variant="secondary"
              className="justify-center sm:justify-start"
            >
              {totalEmployees || 0}{" "}
              {(totalEmployees || 0) === 1 ? "Employee" : "Employees"}
            </Badge>
            <Badge
              variant="outline"
              className="justify-center sm:justify-start"
            >
              Total: {formatCurrency(totalNetSalary || 0)}
            </Badge>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search employee..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-10">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Badge variant="secondary" className="text-sm w-fit">
              {filteredPayrollList.length}{" "}
              {filteredPayrollList.length === 1 ? "employee" : "employees"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              for {getFilterDisplayText()}
            </span>
            {filteredPayrollList.length > 0 && (
              <span className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredPayrollList.length)} of{" "}
                {filteredPayrollList.length}
              </span>
            )}
          </div>

          {/* Items per page selector - Hide on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
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
        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="space-y-3">
            {currentEntries.length > 0 ? (
              currentEntries.map((row, i) => {
                const globalIndex = startIndex + i;
                const isExpanded = expandedRows.has(globalIndex);

                return (
                  <Card key={`${row[1]}-${i}`} className="overflow-hidden">
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleRowExpansion(globalIndex)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-2">
                            {row[1] || "Unknown Employee"}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <div>
                              <span className="text-muted-foreground">
                                Gross:
                              </span>
                              <span className="ml-1 font-medium">
                                {formatCurrency(getColumnValue(row, "gross"))}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Net:
                              </span>
                              <span className="ml-1 font-medium">
                                {formatCurrency(getColumnValue(row, "net"))}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-2">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t bg-muted/20 p-4">
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          {staticHeaders.slice(2).map((header, idx) => {
                            const value = row[idx + 2];
                            const shouldFormatAsCurrency =
                              currencyHeaders.includes(header) ||
                              header.toLowerCase().includes("pay") ||
                              header.toLowerCase().includes("rate") ||
                              header.toLowerCase().includes("amount") ||
                              header.toLowerCase().includes("salary") ||
                              header.toLowerCase().includes("gross") ||
                              header.toLowerCase().includes("net") ||
                              header.toLowerCase().includes("sss") ||
                              header.toLowerCase().includes("philhealth") ||
                              header.toLowerCase().includes("pag-ibig") ||
                              header.toLowerCase().includes("pagibig") ||
                              header.toLowerCase().includes("loan") ||
                              header.toLowerCase().includes("deduction") ||
                              header.toLowerCase().includes("overtime") ||
                              header.toLowerCase().includes("holiday") ||
                              header.toLowerCase().includes("special") ||
                              header.toLowerCase().includes("rest") ||
                              header.toLowerCase().includes("nsd") ||
                              header.toLowerCase().includes("basic") ||
                              header.toLowerCase().includes("monthly") ||
                              header.toLowerCase().includes("daily");

                            return (
                              <div key={idx} className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {header}:
                                </span>
                                <span className="font-medium">
                                  {shouldFormatAsCurrency &&
                                  value &&
                                  value !== "0" &&
                                  !isNaN(parseFloat(value))
                                    ? formatCurrency(value)
                                    : value || "0"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No employees found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search criteria."
                    : "No payroll data available."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap w-8"></th>
                  <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                    Employee
                  </th>
                  <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                    Deductions
                  </th>
                  <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                    Gross Pay
                  </th>
                  <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                    Net Salary
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((row, i) => {
                    const globalIndex = startIndex + i;
                    const isExpanded = expandedRows.has(globalIndex);

                    return (
                      <>
                        <tr
                          key={`${row[1]}-${i}`}
                          className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50"
                          onClick={() => toggleRowExpansion(globalIndex)}
                        >
                          <td className="px-4 py-3 text-center">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-sm">
                            {row[1] || "Unknown Employee"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatCurrency(getColumnValue(row, "deduction"))}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatCurrency(getColumnValue(row, "gross"))}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {formatCurrency(getColumnValue(row, "net"))}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="px-4 py-0">
                              <div className="bg-muted/20 rounded-md p-4 mb-2">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                                  {staticHeaders.slice(2).map((header, idx) => {
                                    const value = row[idx + 2];
                                    const shouldFormatAsCurrency =
                                      currencyHeaders.includes(header) ||
                                      header.toLowerCase().includes("pay") ||
                                      header.toLowerCase().includes("rate") ||
                                      header.toLowerCase().includes("amount") ||
                                      header.toLowerCase().includes("salary") ||
                                      header.toLowerCase().includes("gross") ||
                                      header.toLowerCase().includes("net") ||
                                      header.toLowerCase().includes("sss") ||
                                      header
                                        .toLowerCase()
                                        .includes("philhealth") ||
                                      header
                                        .toLowerCase()
                                        .includes("pag-ibig") ||
                                      header
                                        .toLowerCase()
                                        .includes("pagibig") ||
                                      header.toLowerCase().includes("loan") ||
                                      header
                                        .toLowerCase()
                                        .includes("deduction") ||
                                      header
                                        .toLowerCase()
                                        .includes("overtime") ||
                                      header
                                        .toLowerCase()
                                        .includes("holiday") ||
                                      header
                                        .toLowerCase()
                                        .includes("special") ||
                                      header.toLowerCase().includes("rest") ||
                                      header.toLowerCase().includes("nsd") ||
                                      header.toLowerCase().includes("basic") ||
                                      header
                                        .toLowerCase()
                                        .includes("monthly") ||
                                      header.toLowerCase().includes("daily");

                                    return (
                                      <div key={idx}>
                                        <div className="text-muted-foreground text-xs mb-1">
                                          {header}
                                        </div>
                                        <div className="font-medium">
                                          {shouldFormatAsCurrency &&
                                          value &&
                                          value !== "0" &&
                                          !isNaN(parseFloat(value))
                                            ? formatCurrency(value)
                                            : value || "0"}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {searchQuery
                        ? "No employees found matching your search."
                        : "No payroll data available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredPayrollList.length > 0 && totalPages > 1 && (
          <div className="mt-4 pt-4 border-t">
            {/* Mobile pagination */}
            <div className="flex sm:hidden items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={currentPage === 1}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="h-8"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousPage}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNumber: number;
                    if (totalPages <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 2) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNumber = totalPages - 2 + i;
                    } else {
                      pageNumber = currentPage - 1 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}

                  {totalPages > 3 && currentPage < totalPages - 1 && (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        className="h-8 w-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="h-8"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {filteredPayrollList.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No employees found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
