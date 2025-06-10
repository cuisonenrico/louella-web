"use client"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

// make interface for payroll data
interface PayrollData {
  date: string
  expenses: number
  branch: string
}
export default function Page() {
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // First get unique branches
      const { data: branches, error: branchError } = await supabase
        .from("PayrollPeriod")
        .select('branch')
        .order('branch')
        .throwOnError();

      if (branchError) {
        console.error('Error fetching branches:', branchError);
        return;
      }

      const uniqueBranches = Array.from(new Set(branches.map(b => b.branch)));
      console.log('Unique branches:', uniqueBranches);

      // For each branch, get payroll periods and entries
      const branchData = await Promise.all(uniqueBranches.map(async (branch) => {
        // Get payroll periods for this branch
        const { data: periods, error: periodError } = await supabase
          .from("PayrollPeriod")
          .select('id, payroll_start, payroll_end')
          .eq('branch', branch)
          .order('payroll_start');

        if (periodError) {
          console.error(`Error fetching periods for ${branch}:`, periodError);
          return [];
        }

        // Get entries for these periods
        const { data: entries, error: entryError } = await supabase
          .from("PayrollEntry")
          .select('payroll_period_id, net_salary')
          .in('payroll_period_id', periods.map(p => p.id));

        if (entryError) {
          console.error(`Error fetching entries for ${branch}:`, entryError);
          return [];
        }

        // Group by payroll_start and sum net_salary
        const groupedData = periods.reduce((acc, period) => {
          const date = new Date(period.payroll_start);
          const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          
          const periodEntries = entries.filter(e => e.payroll_period_id === period.id);
          const totalSalary = periodEntries.reduce((sum, entry) => sum + Number(entry.net_salary || 0), 0);

          if (!acc[monthKey]) {
            acc[monthKey] = {
              date: `${monthKey}-01`,
              expenses: 0,
              branch
            };
          }

          acc[monthKey].expenses += totalSalary;
          return acc;
        }, {} as Record<string, PayrollData>);

        return Object.values(groupedData);
      }));

      // Combine expenses for the same month
      const monthlyData = branchData.flat().reduce((acc, item) => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

        if (!acc[monthKey]) {
          acc[monthKey] = {
            date: `${monthKey}-01`,
            expenses: 0,
            branch: 'All Branches'  // or keep track of branches if needed
          };
        }

        acc[monthKey].expenses += item.expenses;
        return acc;
      }, {} as Record<string, PayrollData>);

      // Convert to array and sort chronologically
      const combinedData = Object.values(monthlyData).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      console.log('Combined payroll data:', combinedData);

      setPayrollData(combinedData);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            {/** Chart showing payroll expenses overview 
             * add c2ValeData prop to ChartAreaInteractive component soon when it is available
            */}
            <ChartAreaInteractive
              data={payrollData}
              title="Payroll Expenses Overview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
