"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download } from "lucide-react";
import { EmployeeFilters } from "@/lib/types/employee";
import { AddEmployeeDialog } from "./add-employee-dialog";
import { CreateEmployeeData } from "@/lib/types/employee";

interface EmployeeFiltersComponentProps {
  filters: EmployeeFilters;
  onFiltersChange: (filters: EmployeeFilters) => void;
  onAddEmployee: (employee: CreateEmployeeData) => Promise<void>;
  isSubmitting?: boolean;
}

export function EmployeeFiltersComponent({
  filters,
  onFiltersChange,
  onAddEmployee,
  isSubmitting = false,
}: EmployeeFiltersComponentProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleGenderChange = (value: string) => {
    onFiltersChange({ ...filters, selectedGender: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      selectedGender: "all",
    });
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Stack everything vertically */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select value={filters.selectedGender} onValueChange={handleGenderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={clearFilters} variant="outline" size="sm">
            Clear
          </Button>
        </div>

        <div className="flex gap-2">
          <AddEmployeeDialog
            mode="add"
            onAddEmployee={onAddEmployee}
            isSubmitting={isSubmitting}
            trigger={
              <Button className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            }
          />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop: Original horizontal layout */}
      <div className="hidden sm:flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={filters.selectedGender} onValueChange={handleGenderChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={clearFilters} variant="outline" size="sm">
            Clear
          </Button>

          <AddEmployeeDialog
            mode="add"
            onAddEmployee={onAddEmployee}
            isSubmitting={isSubmitting}
          />

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
