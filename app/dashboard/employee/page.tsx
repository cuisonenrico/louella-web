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
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Employee, EmployeeFilters, CreateEmployeeData } from "@/lib/types/employee";
import { employeeService } from "@/lib/services/employee.service";
import { EmployeeFiltersComponent } from "@/components/custom/employee/employee-filters";
import { EmployeeTable } from "@/components/custom/employee/employee-table";
import { EmployeeMobileList } from "@/components/custom/employee/employee-mobile-list";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({
    searchQuery: "",
    selectedGender: "all",
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
  const debouncedGenderFilter = useDebounce(filters.selectedGender, 300);

  // Fetch employees from Supabase on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await employeeService.fetchEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
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
  }, [debouncedSearchQuery, debouncedGenderFilter, isLoading]);

  // Filter employees using debounced values
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        debouncedSearchQuery === "" ||
        `${employee.first_name} ${employee.last_name}`
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        employee.phone_number?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        employee.address?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesGender =
        debouncedGenderFilter === "all" ||
        debouncedGenderFilter === "" ||
        employee.gender?.toLowerCase() === debouncedGenderFilter.toLowerCase();

      return matchesSearch && matchesGender;
    });
  }, [employees, debouncedSearchQuery, debouncedGenderFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const hasFilters =
    filters.selectedGender !== "all" || !!filters.searchQuery;

  const showLoading = isLoading || isFiltering;

  // CRUD handlers
  const handleAddEmployee = async (employeeData: CreateEmployeeData) => {
    setIsSubmitting(true);

    try {
      const newEmployee = await employeeService.createEmployee(employeeData);
      setEmployees([newEmployee, ...employees]);
      toast.success("Employee added successfully!");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = async (
    id: string,
    employeeData: Partial<Employee>
  ) => {
    setIsEditing(true);

    try {
      const updatedEmployee = await employeeService.updateEmployee(id, employeeData);
      setEmployees(
        employees.map((employee) =>
          employee.id === id ? updatedEmployee : employee
        )
      );
      toast.success("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    setIsDeleting(true);

    try {
      await employeeService.deleteEmployee(id);
      setEmployees(employees.filter((employee) => employee.id !== id));
      toast.success("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination handlers
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
    const parts = [];
    
    if (filters.searchQuery) {
      parts.push(`"${filters.searchQuery}"`);
    }
    
    if (filters.selectedGender !== "all") {
      parts.push(filters.selectedGender);
    }
    
    return parts.length > 0 ? parts.join(" and ") : "all employees";
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 p-6">
        <Card className="@container/card">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Employee Management
                </CardTitle>
                <CardDescription>
                  Manage employee information and records
                </CardDescription>
              </div>
            </div>

            <div className="mt-6">
              <EmployeeFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onAddEmployee={handleAddEmployee}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Badge variant="secondary" className="text-sm w-fit">
                  {filteredEmployees.length}{" "}
                  {filteredEmployees.length === 1 ? "employee" : "employees"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  for {getFilterDisplayText()}
                </span>
                {filteredEmployees.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of{" "}
                    {filteredEmployees.length}
                  </span>
                )}
              </div>

              {/* Items per page selector - Hide on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={() => {}} // Static for now
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
            <EmployeeMobileList
              employees={currentEntries}
              isLoading={showLoading}
              onDelete={handleDeleteEmployee}
              onEdit={handleEditEmployee}
              isDeleting={isDeleting}
              isEditing={isEditing}
            />

            <EmployeeTable
              employees={currentEntries}
              isLoading={showLoading}
              onDelete={handleDeleteEmployee}
              onEdit={handleEditEmployee}
              isDeleting={isDeleting}
              isEditing={isEditing}
            />

            {/* Pagination */}
            {filteredEmployees.length > 0 && totalPages > 1 && (
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

            {filteredEmployees.length === 0 && !showLoading && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No employees found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search criteria or add a new employee.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
