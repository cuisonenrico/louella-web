import { ChartAreaInteractive } from "@/components/shadcn/chart-area-interactive";
import { EmployeePayrollDashboard } from "@/components/custom/dashboard/employee-payroll-dashboard";
import { type PayrollData } from "@/lib/services/payroll.service";
import { PayrollEntry } from "@/lib/types/payroll";
import { MonthlyExpenseTotal } from "@/lib/types/other-expenses";

interface DashboardContentProps {
  payrollData: PayrollData[];
  payrollEntries: PayrollEntry[];
  otherExpensesData?: MonthlyExpenseTotal[];
}

export function DashboardContent({
  payrollData,
  payrollEntries,
  otherExpensesData = [],
}: DashboardContentProps) {
  // Transform other expenses data to match chart format
  const transformedOtherExpenses = otherExpensesData.map((item) => ({
    date: `${item.month}-01`, // Convert YYYY-MM to YYYY-MM-01
    expenses: item.total,
    branch: "All Branches",
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive
              data={payrollData}
              otherExpensesData={transformedOtherExpenses}
              title="Payroll Expenses Overview"
            />
          </div>

          <div className="px-4 lg:px-6">
            <EmployeePayrollDashboard entries={payrollEntries} />
          </div>
        </div>
      </div>
    </div>
  );
}
