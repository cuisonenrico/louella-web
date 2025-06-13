export interface OtherExpense {
  id?: string;
  date: string;
  amount: number;
  description: string;
  branch: string;
}

export type ExpenseFormData = Partial<OtherExpense>;

export interface ExpenseFilters {
  searchQuery: string;
  selectedBranch: string;
  dateFilter?: Date;
}
