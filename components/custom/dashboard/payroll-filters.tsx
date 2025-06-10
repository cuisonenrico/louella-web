"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download } from "lucide-react"

interface PayrollFiltersProps {
  filters: {
    selectedBranch: string
    selectedMonth: string
    selectedYear: string
    employeeSearch: string
  }
  setters: {
    setSelectedBranch: (value: string) => void
    setSelectedMonth: (value: string) => void
    setSelectedYear: (value: string) => void
    setEmployeeSearch: (value: string) => void
  }
  availableYears: Array<{ value: string; label: string }>
  onClearFilters: () => void
}

const months = [
  { value: "all", label: "All Months" },
  { value: "01", label: "January" }, { value: "02", label: "February" },
  { value: "03", label: "March" }, { value: "04", label: "April" },
  { value: "05", label: "May" }, { value: "06", label: "June" },
  { value: "07", label: "July" }, { value: "08", label: "August" },
  { value: "09", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" }
]

const branches = ["All Branches", "Main Branch", "Branch A", "Branch B"]

export function PayrollFilters({ filters, setters, availableYears, onClearFilters }: PayrollFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Mobile: Stack everything vertically */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employee..."
            value={filters.employeeSearch}
            onChange={(e) => setters.setEmployeeSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select value={filters.selectedMonth} onValueChange={setters.setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.selectedYear} onValueChange={setters.setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={onClearFilters} variant="outline" size="sm" className="flex-1">
            Clear Filters
          </Button>
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
              placeholder="Search employee..."
              value={filters.employeeSearch}
              onChange={(e) => setters.setEmployeeSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={filters.selectedBranch} onValueChange={setters.setSelectedBranch}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.slice(1).map(branch => (
                <SelectItem key={branch} value={branch.toLowerCase().replace(/\s+/g, '-')}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.selectedMonth} onValueChange={setters.setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.selectedYear} onValueChange={setters.setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={onClearFilters} variant="outline" size="sm">
            Clear
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
