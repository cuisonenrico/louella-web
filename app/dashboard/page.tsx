"use client"

import { useState } from "react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { DashboardLoading } from "@/components/custom/dashboard/dashboard-loading"
import { DashboardError } from "@/components/custom/dashboard/dashboard-error"
import { DashboardContent } from "@/components/custom/dashboard/dashboard-content"

export default function DashboardPage() {
  const { payrollData, payrollEntries, loading, error, refetch } = useDashboardData()
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    setRetrying(true)
    try {
      await refetch()
    } finally {
      setRetrying(false)
    }
  }

  if (loading) {
    return <DashboardLoading />
  }

  if (error) {
    return (
      <DashboardError 
        error={error} 
        onRetry={handleRetry}
        retrying={retrying}
      />
    )
  }

  return (
    <DashboardContent 
      payrollData={payrollData}
      payrollEntries={payrollEntries}
    />
  )
}
