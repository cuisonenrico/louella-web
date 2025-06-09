import * as XLSX from 'xlsx';
import { createClient } from "@/utils/supabase/client";

interface ProcessedPayroll {
  date: string;
  payrollData: any[][];
}

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