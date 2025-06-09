import { start } from "repl";

export function formatCurrency(value: any) {
  if (typeof value === "number") {
    return value.toLocaleString("en-US", { style: "currency", currency: "PHP" });
  }
  if (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "") {
    return Number(value).toLocaleString("en-US", { style: "currency", currency: "PHP" });
  }
  return value;
}

export function formatPayrollFileName(filename: string): string {
  // Extract date range from filename format: branch_id_MonthDDYYYY_MonthDDYYYY.xlsx
  const match = filename.match(/_(\d+)_([A-Za-z]+)(\d{2})\d{4}_[A-Zael]+(\d{2})\d{4}\.(xlsx|xls)/i);
  if (!match) return filename;

  const [_, __, month, startDay, endDay] = match;
  
  // Format month and pad days with leading zeros
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  const formattedStartDay = startDay.padStart(2, '0');
  const formattedEndDay = endDay.padStart(2, '0');

  return `${formattedMonth} ${formattedStartDay}-${formattedEndDay}`;
}

export function formatPayrollPeriod(dateRange: string): string {
  const [startDate, endDate] = dateRange.split(' - ');
  if (!startDate || !endDate) return dateRange;

  try {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return dateRange;
    }

    const month = startDateTime.toLocaleString('en-US', { month: 'long' });
    const startDay = startDateTime.getDate();
    const endDay = endDateTime.getDate();
    const year = startDateTime.getFullYear();

    return `For Payroll Period ${month} ${startDay} to ${endDay}, ${year}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return dateRange;
  }
}