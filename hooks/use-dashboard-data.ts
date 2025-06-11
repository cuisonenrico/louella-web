import { useState, useEffect } from "react"
import { payrollService, type PayrollData } from "@/lib/services/payroll.service"
import { PayrollEntry } from "@/lib/types/payroll"

interface DashboardData {
  payrollData: PayrollData[]
  payrollEntries: PayrollEntry[]
}

interface UseDashboardDataReturn extends DashboardData {
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData>({
    payrollData: [],
    payrollEntries: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch data in parallel for better performance
      const [payrollData, payrollEntries] = await Promise.all([
        payrollService.fetchPayrollData(),
        payrollService.fetchPayrollEntries()
      ])
      
      setData({ payrollData, payrollEntries })
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    ...data,
    loading,
    error,
    refetch: fetchData
  }
}
