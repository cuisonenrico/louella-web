import { createClient } from "@/utils/supabase/client";
import { OtherExpense } from "@/components/custom/other-expenses/types";
import { MonthlyExpenseTotal } from "@/lib/types/other-expenses";

export class OtherExpensesService {
  private supabase = createClient();

  async fetchExpenses(): Promise<OtherExpense[]> {
    const { data, error } = await this.supabase
      .from("other_expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch expenses: ${error.message}`);
    }

    return data.map((item) => ({
      id: item.id,
      date: item.date,
      amount: item.amount,
      description: item.description,
      branch: item.branch,
    }));
  }

  async createExpense(expense: Omit<OtherExpense, 'id'>): Promise<OtherExpense> {
    const { data, error } = await this.supabase
      .from("other_expenses")
      .insert({
        date: expense.date,
        amount: expense.amount,
        description: expense.description || null, // Handle empty description
        branch: expense.branch,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create expense: ${error.message}`);
    }

    return {
      id: data.id,
      date: data.date,
      amount: data.amount,
      description: data.description || "", // Ensure string return
      branch: data.branch,
    };
  }

  async updateExpense(id: string, expense: Partial<Omit<OtherExpense, 'id'>>): Promise<OtherExpense> {
    // Prepare update data, handling optional description
    const updateData: any = {};
    if (expense.date !== undefined) updateData.date = expense.date;
    if (expense.amount !== undefined) updateData.amount = expense.amount;
    if (expense.description !== undefined) updateData.description = expense.description || null;
    if (expense.branch !== undefined) updateData.branch = expense.branch;

    const { data, error } = await this.supabase
      .from("other_expenses")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update expense: ${error.message}`);
    }

    return {
      id: data.id,
      date: data.date,
      amount: data.amount,
      description: data.description || "", // Ensure string return
      branch: data.branch,
    };
  }

  async deleteExpense(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("other_expenses")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete expense: ${error.message}`);
    }
  }

  async getMonthlyTotals(): Promise<MonthlyExpenseTotal[]> {
    const { data, error } = await this.supabase
      .rpc('get_monthly_expense_totals');

    if (error) {
      throw new Error(`Failed to fetch monthly totals: ${error.message}`);
    }

    return data || [];
  }

  async getMonthlyTotalsAlternative(): Promise<MonthlyExpenseTotal[]> {
    // Alternative approach using client-side grouping if RPC is not available
    const { data, error } = await this.supabase
      .from("other_expenses")
      .select("date, amount")
      .order("date", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch expenses for monthly totals: ${error.message}`);
    }

    // Group by month on client side
    const monthlyTotals = new Map<string, { total: number; count: number }>();

    data.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyTotals.has(monthKey)) {
        const existing = monthlyTotals.get(monthKey)!;
        monthlyTotals.set(monthKey, {
          total: existing.total + expense.amount,
          count: existing.count + 1
        });
      } else {
        monthlyTotals.set(monthKey, {
          total: expense.amount,
          count: 1
        });
      }
    });

    // Convert to array and sort by month
    return Array.from(monthlyTotals.entries())
      .map(([month, data]) => ({
        month,
        total: data.total,
        count: data.count
      }))
      .sort((a, b) => b.month.localeCompare(a.month)); // Newest first
  }
}

// Export a singleton instance
export const otherExpensesService = new OtherExpensesService();
