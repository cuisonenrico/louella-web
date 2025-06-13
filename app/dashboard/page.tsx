"use client";

import { useState } from "react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardLoading } from "@/components/custom/dashboard/dashboard-loading";
import { DashboardError } from "@/components/custom/dashboard/dashboard-error";
import { DashboardContent } from "@/components/custom/dashboard/dashboard-content";
import { otherExpensesService } from "@/lib/services/other-expenses.service";
import { MonthlyExpenseTotal } from "@/lib/types/other-expenses";

export default function DashboardPage() {
  const { payrollData, payrollEntries, loading, error, refetch } =
    useDashboardData();
  const [retrying, setRetrying] = useState(false);
  const [otherExpensesData, setOtherExpensesData] = useState<
    MonthlyExpenseTotal[]
  >([]);
  const [otherExpensesLoading, setOtherExpensesLoading] = useState(true);

  // Fetch other expenses data
  useState(() => {
    const fetchOtherExpenses = async () => {
      try {
        const data = await otherExpensesService.getMonthlyTotalsAlternative();
        setOtherExpensesData(data);
      } catch (error) {
        console.error("Failed to fetch other expenses:", error);
      } finally {
        setOtherExpensesLoading(false);
      }
    };

    fetchOtherExpenses();
  });

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await refetch();
      // Also refetch other expenses
      const data = await otherExpensesService.getMonthlyTotalsAlternative();
      setOtherExpensesData(data);
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setRetrying(false);
    }
  };

  if (loading || otherExpensesLoading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <DashboardError error={error} onRetry={handleRetry} retrying={retrying} />
    );
  }

  return (
    <DashboardContent
      payrollData={payrollData}
      payrollEntries={payrollEntries}
      otherExpensesData={otherExpensesData}
    />
  );
}
