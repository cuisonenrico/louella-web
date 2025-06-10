import { useState, useEffect, useCallback, useMemo } from "react"
import { PayrollEntry } from "@/types/payroll"

interface UsePayrollFiltersProps {
  entries: PayrollEntry[]
}

export function usePayrollFilters({ entries }: UsePayrollFiltersProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [employeeSearch, setEmployeeSearch] = useState<string>("")
  const [isFiltering, setIsFiltering] = useState(false)

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(
      entries.map(entry => new Date(entry.payroll_start).getFullYear().toString())
    )).sort((a, b) => parseInt(b) - parseInt(a))

    return [{ value: "all", label: "All Years" }, ...years.map(year => ({ value: year, label: year }))]
  }, [entries])

  const applyFilters = useCallback(() => {
    setIsFiltering(true)
    
    setTimeout(() => {
      let filtered = entries

      if (employeeSearch.trim()) {
        filtered = filtered.filter(entry =>
          entry.employee.toLowerCase().includes(employeeSearch.toLowerCase())
        )
      }

      if (selectedMonth !== "all") {
        filtered = filtered.filter(entry => {
          const entryMonth = new Date(entry.payroll_start).getMonth() + 1
          return entryMonth.toString().padStart(2, '0') === selectedMonth
        })
      }

      if (selectedYear !== "all") {
        filtered = filtered.filter(entry => {
          const entryYear = new Date(entry.payroll_start).getFullYear()
          return entryYear.toString() === selectedYear
        })
      }

      setIsFiltering(false)
      return filtered
    }, 200)
  }, [entries, employeeSearch, selectedMonth, selectedYear, selectedBranch])

  const filteredEntries = useMemo(() => {
    let filtered = entries

    if (employeeSearch.trim()) {
      filtered = filtered.filter(entry =>
        entry.employee.toLowerCase().includes(employeeSearch.toLowerCase())
      )
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter(entry => {
        const entryMonth = new Date(entry.payroll_start).getMonth() + 1
        return entryMonth.toString().padStart(2, '0') === selectedMonth
      })
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(entry => {
        const entryYear = new Date(entry.payroll_start).getFullYear()
        return entryYear.toString() === selectedYear
      })
    }

    return filtered
  }, [entries, employeeSearch, selectedMonth, selectedYear])

  const clearFilters = () => {
    setEmployeeSearch("")
    setSelectedBranch("all")
    setSelectedMonth("all")
    setSelectedYear("all")
  }

  const getFilterDisplayText = () => {
    const parts = []
    const months = [
      { value: "01", label: "January" }, { value: "02", label: "February" },
      { value: "03", label: "March" }, { value: "04", label: "April" },
      { value: "05", label: "May" }, { value: "06", label: "June" },
      { value: "07", label: "July" }, { value: "08", label: "August" },
      { value: "09", label: "September" }, { value: "10", label: "October" },
      { value: "11", label: "November" }, { value: "12", label: "December" }
    ]

    if (selectedMonth !== "all") {
      const monthLabel = months.find(m => m.value === selectedMonth)?.label
      parts.push(monthLabel)
    }

    if (selectedYear !== "all") {
      parts.push(selectedYear)
    }

    return parts.length === 0 ? "All periods" : parts.join(" ")
  }

  return {
    filters: {
      selectedBranch,
      selectedMonth,
      selectedYear,
      employeeSearch,
    },
    setters: {
      setSelectedBranch,
      setSelectedMonth,
      setSelectedYear,
      setEmployeeSearch,
    },
    filteredEntries,
    availableYears,
    isFiltering,
    clearFilters,
    getFilterDisplayText,
  }
}
