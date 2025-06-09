import * as XLSX from 'xlsx';
import { createClient } from "@/utils/supabase/client";
import { ProcessedPayroll, PayrollEntry } from "@/types/payroll";

export async function processPayrollFile(fileName: string): Promise<ProcessedPayroll> {
  const supabase = createClient();
  const { data } = supabase.storage.from("payroll-files").getPublicUrl(fileName);
  if (!data.publicUrl) {
    throw new Error("Could not get file URL");
  }

  const response = await fetch(data.publicUrl);
  const buffer = await response.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const wsName = wb.SheetNames[0];
  const ws = wb.Sheets[wsName];
  const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const untrimmedData = jsonData as any[][];

  // Find date in the data
  let dateFieldIndex: number | null = null;
  let dateFieldValue: any = null;
  for (let row of untrimmedData) {
    for (let col = 0; col < row.length; col++) {
      const cell = row[col];
      if (
        cell instanceof Date ||
        (typeof cell === "string" && !isNaN(Date.parse(cell)) && cell.trim() !== "")
      ) {
        dateFieldIndex = col;
        dateFieldValue = cell;
        break;
      }
    }
    if (dateFieldIndex !== null) break;
  }

  return {
    date: dateFieldValue ? dateFieldValue.toString() : "",
    payrollData: untrimmedData.slice(4).slice(4, untrimmedData.length - 13)
  };
}

export async function processPayrollFromDB(payrollPeriodId: number): Promise<ProcessedPayroll> {
  const supabase = createClient();
  
  // First get the payroll period details
  const { data: periodData, error: periodError } = await supabase
    .from('PayrollPeriod')
    .select('*')
    .eq('id', payrollPeriodId)
    .single();
    
  if (periodError) throw new Error('Failed to fetch payroll period');
  if (!periodData) throw new Error('Payroll period not found');

  // Then get all entries for this period
  const { data: entries, error: entriesError } = await supabase
    .from('PayrollEntry')
    .select('*')
    .eq('payroll_period_id', payrollPeriodId)
    .order('id');

    console.log("Payroll entries data:", entries);

  if (entriesError) throw new Error('Failed to fetch payroll entries');
  if (!entries) throw new Error('No entries found');

  // Convert structured data back to array format to match excel structure
  const payrollData = entries.map((entry: PayrollEntry) => [
    '', // Empty cell for numbering
    entry.employee,
    entry.days_worked,
    entry.monthly_rate,
    entry.daily_rate,
    entry.basic_rate,
    entry.overtime_hrs,
    entry.overtime_amount,
    entry.holiday_no,
    entry.holiday_pay,
    entry.special_no,
    entry.special_pay,
    entry.rest_day_no,
    entry.rest_day_pay,
    entry.no_of_ns_hours,
    entry.nsd_pay,
    entry.gross_pay,
    entry.ca,
    entry.sss,
    entry.philhealth,
    entry.pagibig,
    entry.sssloan,
    entry.net_salary,
    '' // Empty cell for signature
  ]);

  return {
    date: `${periodData.payroll_start} - ${periodData.payroll_end}`,
    payrollData
  };
}