import * as XLSX from "xlsx";
import { PayrollEntry } from "@/lib/types/payroll";
import { PayrollService } from "./payroll-service";

// Utility functions
export const extractBranchFromWorksheet = (ws: XLSX.WorkSheet): string | null => {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z100');

  for (let row = range.s.r; row <= Math.min(range.e.r, 50); row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = ws[cellAddress];

      if (cell && cell.v && typeof cell.v === 'string') {
        const text = cell.v.toString();
        // More flexible regex to capture business names with various endings
        const match = text.match(/WE HEREBY ACKNOWLEDGE to have received from (.+?)\s*,/i) ||
          text.match(/WE HEREBY ACKNOWLEDGE to have received from (.+?)(?:\s+#|\s+\d)/i) ||
          text.match(/WE HEREBY ACKNOWLEDGE to have received from ([^,#\d]+)/i);

        if (match) {
          return match[1].trim();
        }
      }
    }
  }
  return null;
};

export const extractDateFromWorksheet = (ws: XLSX.WorkSheet): string | null => {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z100');

  for (let row = range.s.r; row <= Math.min(range.e.r, 50); row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = ws[cellAddress];

      if (cell && cell.v && typeof cell.v === 'string') {
        const text = cell.v.toString();

        if (text.includes('For the period of') || text.includes('period of')) {
          let cleanedText = text.replace(/For the period of|period of/i, '').trim();

          // Normalize spaces - replace multiple spaces with single spaces
          cleanedText = cleanedText.replace(/\s+/g, ' ').trim();

          // More flexible regex patterns to handle various formats with extra spaces
          const patterns = [
            /([A-Za-z]+)\s*(\d{1,2})\s*-\s*(\d{1,2})\s*,?\s*(\d{4})/i, // February 16-28, 2025 or February16-28, 2025 with extra spaces
            /([A-Za-z]+)\s*(\d{1,2})\s*to\s*(\d{1,2})\s*,?\s*(\d{4})/i, // February 16 to 28, 2025 with extra spaces
            /([A-Za-z]+)\s*(\d{1,2})\s*,?\s*(\d{4})/i, // February 28, 2025 (single date) with extra spaces
          ];

          for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            const match = cleanedText.match(pattern);

            if (match) {
              let month, endDay, year;

              if (match.length === 5) {
                // Date range format: [full match, month, startDay, endDay, year]
                [, month, , endDay, year] = match;
              } else if (match.length === 4) {
                // Single date format: [full match, month, day, year]
                [, month, endDay, year] = match;
              } else {
                continue;
              }

              // Clean up the extracted components
              const cleanMonth = month.trim();
              const cleanEndDay = parseInt(endDay.toString().trim());
              const cleanYear = parseInt(year.toString().trim());

              // Validate and correct the date
              const correctedDate = validateAndCorrectDate(cleanMonth, cleanEndDay, cleanYear);
              return correctedDate;
            }
          }
        }
      }
    }
  }
  return null;
};

// Helper function to validate and correct invalid dates
export const validateAndCorrectDate = (month: string, day: number, year: number): string => {
  // Get the last day of the month
  const lastDayOfMonth = new Date(year, getMonthIndex(month) + 1, 0).getDate();
  
  // If the day exceeds the last day of the month, use the last valid day
  const correctedDay = Math.min(day, lastDayOfMonth);
  
  return `${month} ${correctedDay}, ${year}`;
};

// Helper function to get month index (0-11) from month name
export const getMonthIndex = (monthName: string): number => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const index = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
  return index !== -1 ? index : 0; // Default to January if not found
};

export const normalizeBranchName = (branchName: string): string => {
  return branchName
    .replace(/,\s*\(([^)]+)\)/g, ' ($1)') // Fix comma before parentheses: "Bakery,(Contractual)" -> "Bakery (Contractual)"
    .replace(/\s*&\s*/g, ' & ') // Normalize ampersand spacing
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
};

export const findDataStartRow = (ws: XLSX.WorkSheet): number => {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z100');

  // Look for common header patterns
  for (let row = range.s.r; row <= Math.min(range.e.r, 30); row++) {
    for (let col = range.s.c; col <= Math.min(range.e.c, 10); col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = ws[cellAddress];

      if (cell && cell.v && typeof cell.v === 'string') {
        const text = cell.v.toString().toLowerCase();
        // Look for employee/name column headers
        if (text.includes('employee') || text.includes('name') || text.includes('emp')) {
          return row + 1; // Return the row after the header
        }
      }
    }
  }

  // Fallback: assume data starts at row 10 if no header found
  return 10;
};

export const processWorksheetData = (ws: XLSX.WorkSheet): any[][] => {
  const startRow = findDataStartRow(ws);
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z100');
  const data: any[][] = [];

  for (let row = startRow; row <= range.e.r; row++) {
    const rowData: any[] = [];
    let hasData = false;

    // Get data for each column (assuming max 25 columns)
    for (let col = 0; col < 25; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = ws[cellAddress];
      const value = cell ? cell.v : null;

      if (value !== null && value !== undefined && value !== '') {
        hasData = true;
      }

      rowData.push(value);
    }

    // Only include rows that have employee name (column 1)
    if (hasData && rowData[1] && typeof rowData[1] === 'string' && rowData[1].trim() !== '') {
      data.push(rowData);
    }
  }

  return data;
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
    employee: row[1]?.toString().trim() || "",
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
    try {
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error(`${file.name} is not a valid Excel file`);
      }

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('No worksheets found in the Excel file');
      }

      const ws = workbook.Sheets[workbook.SheetNames[0]];

      // Extract information from worksheet content
      const rawBranchName = extractBranchFromWorksheet(ws);
      const endDate = extractDateFromWorksheet(ws);

      if (!rawBranchName) {
        throw new Error(`Could not extract branch name from file: ${file.name}. Please check if the file contains "WE HEREBY ACKNOWLEDGE to have received from [BRANCH NAME]" text.`);
      }

      if (!endDate) {
        throw new Error(`Could not extract date from file: ${file.name}. Please check if the file contains "For the period of" text with date range.`);
      }

      // Normalize branch name
      const branchName = normalizeBranchName(rawBranchName);

      // Calculate start date (assuming bi-monthly: 1-15 or 16-end of month)
      const endDateObj = new Date(endDate);

      if (isNaN(endDateObj.getTime())) {
        throw new Error(`Invalid end date format: ${endDate}. Expected format like "February 28, 2025"`);
      }

      const day = endDateObj.getDate();
      let startDate: string;

      if (day <= 15) {
        // First half of month (1-15)
        startDate = `${endDateObj.toLocaleString('default', { month: 'long' })} 1, ${endDateObj.getFullYear()}`;
      } else {
        // Second half of month (16-end)
        startDate = `${endDateObj.toLocaleString('default', { month: 'long' })} 16, ${endDateObj.getFullYear()}`;
      }

      // Generate safe filename
      const safeBranch = branchName.replace(/[\s,&()]/g, "");
      const safeDate = endDate.replace(/[\s,]/g, "");
      const fileExt = file.name.match(/\.xlsx$/i) ? ".xlsx" : ".xls";

      const periodId = await this.payrollService.handlePayrollPeriod(branchName, startDate, endDate);
      const customFileName = `${safeBranch}_${periodId}_${safeDate}${fileExt}`;

      // Check for existing file
      if (await this.payrollService.checkFileExists(customFileName)) {
        throw new Error("File already exists");
      }

      // Process data
      const worksheetData = processWorksheetData(ws);

      if (worksheetData.length === 0) {
        throw new Error('No employee data found in the worksheet. Please check the file format.');
      }

      const payrollEntries = createPayrollEntries(worksheetData, periodId, startDate, endDate);
      
      // Upload in parallel where possible
      await Promise.all([
        this.payrollService.batchInsertEntries(payrollEntries),
        this.payrollService.uploadFile(file, customFileName, branchName, periodId)
      ]);

      return customFileName;

    } catch (error) {
      throw error; // Re-throw to preserve the original error
    }
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
            const errorMessage = error instanceof Error ? error.message : `Unknown error: ${String(error)}`;
            return {
              file: file.name,
              status: 'error' as const,
              message: errorMessage
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