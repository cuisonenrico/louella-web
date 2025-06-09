import * as XLSX from "xlsx";
import { PayrollEntry } from "@/types/payroll";
import { PayrollService } from "./payroll-service";

// Utility functions
export const extractDateFromFilename = (filename: string): string | null => {
  const nameWithoutExt = filename.replace(/\.(xlsx|xls)$/i, '');
  const match = nameWithoutExt.match(/Payroll-.*?-([A-Za-z]{3})(\d{1,2})-(\d{4})$/);
  
  if (!match) return null;
  
  const [, month, day, year] = match;
  return `${month} ${day.padStart(2, '0')}, ${year}`;
};

export const getTypeSuffix = (type: string): string | null => {
  const typeMap: Record<string, string> = {
    contractual: '(CONTRACTUAL)',
    incomplete: '(INCOMPLETE)',
    temporary: '(TEMPORARY)'
  };
  
  return typeMap[type.toLowerCase()] || null;
};

export const extractBranchFromFilename = (filename: string): string | null => {
  const nameWithoutExt = filename.replace(/\.(xlsx|xls)$/i, '');
  const parts = nameWithoutExt.split('-');
  
  if (parts.length < 4) return null;
  
  const branchName = parts[1];
  
  // Handle multiple types (6+ parts)
  if (parts.length >= 6) {
    const [type1, type2] = [parts[2], parts[3]];
    const suffix1 = getTypeSuffix(type1);
    const suffix2 = getTypeSuffix(type2);
    
    const suffixes = [suffix1, suffix2].filter(Boolean);
    return suffixes.length ? `${branchName}_${suffixes.join('_')}` : branchName;
  }
  
  // Handle single type
  const typeSuffix = getTypeSuffix(parts[2]);
  return typeSuffix ? `${branchName}_${typeSuffix}` : branchName;
};

export const processWorksheetData = (ws: XLSX.WorkSheet): any[][] => {
  const untrimmedData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
  return untrimmedData
    .slice(7) // Skip header rows
    .slice(4, untrimmedData.length - 20) // Skip footer rows
    .filter(row => row[1] != null && row[1] !== ""); // Filter valid rows
};

export const createPayrollEntries = (
  data: any[][], 
  periodId: number, 
  startDate: string, 
  endDate: string
): Omit<PayrollEntry, 'id'>[] => {
  return data.map(row => ({
    payroll_period_id: periodId,
    payroll_start: startDate,
    payroll_end: endDate,
    employee: row[1] ?? "",
    days_worked: Number(row[2]) || 0,
    monthly_rate: Number(row[3]) || 0,
    daily_rate: Number(row[4]) || 0,
    basic_rate: Number(row[5]) || 0,
    overtime_hrs: Number(row[6]) || 0,
    overtime_amount: Number(row[7]) || 0,
    holiday_no: Number(row[8]) || 0,
    holiday_pay: Number(row[9]) || 0,
    special_no: Number(row[10]) || 0,
    special_pay: Number(row[11]) || 0,
    rest_day_no: Number(row[12]) || 0,
    rest_day_pay: Number(row[13]) || 0,
    no_of_ns_hours: Number(row[14]) || 0,
    nsd_pay: Number(row[15]) || 0,
    gross_pay: Number(row[16]) || 0,
    sss: Number(row[17]) || 0,
    philhealth: Number(row[18]) || 0,
    pagibig: Number(row[19]) || 0,
    sssloan: Number(row[20]) || 0,
    ca: Number(row[21]) || 0,
    hidden: Number(row[22]) || 0,
    net_salary: Number(row[23]) || 0,
  }));
};

export class PayrollFileProcessor {
  private payrollService: PayrollService;

  constructor() {
    this.payrollService = new PayrollService();
  }

  async processFile(file: File): Promise<string> {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      throw new Error(`${file.name} is not a valid Excel file`);
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
    const ws = workbook.Sheets[workbook.SheetNames[0]];

    const startDate = extractDateFromFilename(file.name);
    const branchName = extractBranchFromFilename(file.name);

    if (!startDate || !branchName) {
      throw new Error(`Invalid filename format: ${file.name}`);
    }

    // Generate safe filename
    const safeBranch = branchName.replace(/[\s,]/g, "");
    const safeDate = startDate.replace(/[\s,]/g, "");
    const fileExt = file.name.match(/\.xlsx$/i) ? ".xlsx" : ".xls";

    const periodId = await this.payrollService.handlePayrollPeriod(branchName, startDate, startDate);
    const customFileName = `${safeBranch}_${periodId}_${safeDate}${fileExt}`;

    // Check for existing file
    if (await this.payrollService.checkFileExists(customFileName)) {
      throw new Error("File already exists");
    }

    // Process data
    const worksheetData = processWorksheetData(ws);
    const payrollEntries = createPayrollEntries(worksheetData, periodId, startDate, startDate);

    // Upload in parallel where possible
    await Promise.all([
      this.payrollService.batchInsertEntries(payrollEntries),
      this.payrollService.uploadFile(file, customFileName, branchName, periodId)
    ]);

    return customFileName;
  }

  async processFiles(files: File[]): Promise<Array<{ file: string; status: 'success' | 'error'; message?: string }>> {
    const results: Array<{ file: string; status: 'success' | 'error'; message?: string }> = [];
    const CONCURRENCY_LIMIT = 3;

    for (let i = 0; i < files.length; i += CONCURRENCY_LIMIT) {
      const batch = files.slice(i, i + CONCURRENCY_LIMIT);
      const batchResults = await Promise.allSettled(
        batch.map(async (file) => {
          try {
            await this.processFile(file);
            return { file: file.name, status: 'success' as const };
          } catch (error) {
            return {
              file: file.name,
              status: 'error' as const,
              message: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );

      results.push(
        ...batchResults.map(result =>
          result.status === "fulfilled" ? result.value : result.reason
        )
      );
    }

    return results;
  }
}