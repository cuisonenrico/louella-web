import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { EmployeePayrollDashboard } from "@/components/custom/dashboard/employee-payroll-dashboard"
import { type PayrollData } from "@/services/payroll.service"
import { PayrollEntry } from "@/types/payroll"

interface DashboardContentProps {
  payrollData: PayrollData[]
  payrollEntries: PayrollEntry[]
}

export function DashboardContent({ payrollData, payrollEntries }: DashboardContentProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive
              data={payrollData}
              title="Payroll Expenses Overview"
            />
          </div>

          <div className="px-4 lg:px-6">
            <EmployeePayrollDashboard entries={payrollEntries} />
          </div>
        </div>
      </div>
    </div>
  )
}
