export interface ProcessedPayroll {
  date: string;
  payrollData: any[][];
}

export interface PayrollEntry {
  id: number;
  employee: string;
  days_worked: number;
  monthly_rate: number;
  daily_rate: number;
  basic_rate: number;
  overtime_hrs: number;
  overtime_amount: number;
  holiday_no: number;
  holiday_pay: number;
  special_no: number;
  special_pay: number;
  rest_day_no: number;
  rest_day_pay: number;
  no_of_ns_hours: number;
  nsd_pay: number;
  gross_pay: number;
  sss: number;
  philhealth: number;
  pagibig: number;
  sssloan: number;
  ca: number;
  hidden: number;
  net_salary: number;
  payroll_start: string;
  payroll_end: string;
  payroll_period_id: number;
}