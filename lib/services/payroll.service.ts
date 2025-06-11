import { createClient } from "@/utils/supabase/client"
import { PayrollEntry } from "@/lib/types/payroll"

export interface PayrollData {
  date: string
  expenses: number
  branch: string
}

export class PayrollService {
  private supabase = createClient()

  async fetchPayrollData(): Promise<PayrollData[]> {
    try {
      // First get unique branches
      const { data: branches, error: branchError } = await this.supabase
        .from("PayrollPeriod")
        .select('branch')
        .order('branch')
        .throwOnError();

      if (branchError) {
        console.error('Error fetching branches:', branchError);
        throw branchError;
      }

      const uniqueBranches = Array.from(new Set(branches.map(b => b.branch)));

      // For each branch, get payroll periods and entries
      const branchData = await Promise.all(uniqueBranches.map(async (branch) => {
        return await this.fetchBranchPayrollData(branch);
      }));

      // Combine expenses for the same month
      const monthlyData = branchData.flat().reduce((acc, item) => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

        if (!acc[monthKey]) {
          acc[monthKey] = {
            date: `${monthKey}-01`,
            expenses: 0,
            branch: 'All Branches'
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
      return combinedData;

    } catch (error) {
      console.error('Error in fetchPayrollData:', error);
      throw error;
    }
  }

  async fetchPayrollEntries(): Promise<PayrollEntry[]> {
    try {
      const { data: entries, error } = await this.supabase
        .from("PayrollEntry")
        .select(`
          *,
          PayrollPeriod!inner(
            id,
            payroll_start,
            payroll_end,
            branch
          )
        `)
        .order('id');

      if (error) {
        console.error('Error fetching payroll entries:', error);
        throw error;
      }

      if (!entries || entries.length === 0) {
        return [];
      }

      // Transform the data to match PayrollEntry interface
      const transformedEntries: PayrollEntry[] = entries.map(entry => ({
        id: entry.id,
        employee: entry.employee,
        days_worked: entry.days_worked,
        monthly_rate: entry.monthly_rate,
        daily_rate: entry.daily_rate,
        basic_rate: entry.basic_rate,
        overtime_hrs: entry.overtime_hrs,
        overtime_amount: entry.overtime_amount,
        holiday_no: entry.holiday_no,
        holiday_pay: entry.holiday_pay,
        special_no: entry.special_no,
        special_pay: entry.special_pay,
        rest_day_no: entry.rest_day_no,
        rest_day_pay: entry.rest_day_pay,
        no_of_ns_hours: entry.no_of_ns_hours,
        nsd_pay: entry.nsd_pay,
        gross_pay: entry.gross_pay,
        sss: entry.sss,
        philhealth: entry.philhealth,
        pagibig: entry.pagibig,
        sssloan: entry.sssloan,
        ca: entry.ca,
        hidden: entry.hidden,
        net_salary: entry.net_salary,
        payroll_start: entry.PayrollPeriod.payroll_start,
        payroll_end: entry.PayrollPeriod.payroll_end,
        payroll_period_id: entry.payroll_period_id
      }));

      console.log(`Fetched ${transformedEntries.length} payroll entries`);
      return transformedEntries;

    } catch (error) {
      console.error('Error in fetchPayrollEntries:', error);
      throw error;
    }
  }

  private async fetchBranchPayrollData(branch: string): Promise<PayrollData[]> {
    try {
      // Get payroll periods for this branch
      const { data: periods, error: periodError } = await this.supabase
        .from("PayrollPeriod")
        .select('id, payroll_start, payroll_end')
        .eq('branch', branch)
        .order('payroll_start');

      if (periodError) {
        console.error(`Error fetching periods for ${branch}:`, periodError);
        return [];
      }

      if (!periods || periods.length === 0) {
        return [];
      }

      // Get entries for these periods
      const { data: entries, error: entryError } = await this.supabase
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
        
        const periodEntries = entries?.filter(e => e.payroll_period_id === period.id) || [];
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

    } catch (error) {
      console.error(`Error fetching data for branch ${branch}:`, error);
      return [];
    }
  }

  async fetchPayrollDataByBranch(branchName: string): Promise<PayrollData[]> {
    try {
      return await this.fetchBranchPayrollData(branchName);
    } catch (error) {
      console.error(`Error fetching payroll data for branch ${branchName}:`, error);
      throw error;
    }
  }

  async fetchPayrollDataByDateRange(startDate: string, endDate: string): Promise<PayrollData[]> {
    try {
      const { data: periods, error: periodError } = await this.supabase
        .from("PayrollPeriod")
        .select('id, payroll_start, payroll_end, branch')
        .gte('payroll_start', startDate)
        .lte('payroll_end', endDate)
        .order('payroll_start');

      if (periodError) {
        console.error('Error fetching periods by date range:', periodError);
        throw periodError;
      }

      if (!periods || periods.length === 0) {
        return [];
      }

      const { data: entries, error: entryError } = await this.supabase
        .from("PayrollEntry")
        .select('payroll_period_id, net_salary')
        .in('payroll_period_id', periods.map(p => p.id));

      if (entryError) {
        console.error('Error fetching entries by date range:', entryError);
        throw entryError;
      }

      const groupedData = periods.reduce((acc, period) => {
        const date = new Date(period.payroll_start);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        const periodEntries = entries?.filter(e => e.payroll_period_id === period.id) || [];
        const totalSalary = periodEntries.reduce((sum, entry) => sum + Number(entry.net_salary || 0), 0);

        if (!acc[monthKey]) {
          acc[monthKey] = {
            date: `${monthKey}-01`,
            expenses: 0,
            branch: 'All Branches'
          };
        }

        acc[monthKey].expenses += totalSalary;
        return acc;
      }, {} as Record<string, PayrollData>);

      return Object.values(groupedData).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    } catch (error) {
      console.error('Error in fetchPayrollDataByDateRange:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const payrollService = new PayrollService();