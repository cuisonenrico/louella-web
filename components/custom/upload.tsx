"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import * as XLSX from "xlsx";
import { FaUpload } from "react-icons/fa";

function extractDateRange(str: string) {
  const match = str.match(/([A-Za-z]+)\s+(\d{1,2})-(\d{1,2}),\s*(\d{4})/);
  if (match) {
    const month = match[1];
    const startDay = match[2].padStart(2, '0');  // Add leading zero if single digit
    const endDay = match[3].padStart(2, '0');    // Add leading zero if single digit
    const year = match[4];
    return {
      startDate: `${month} ${startDay}, ${year}`,
      endDate: `${month} ${endDay}, ${year}`,
    };
  }
  return { startDate: "", endDate: "" };
}

function getNextWord(text: string, key: string) {
  const keyPattern = new RegExp(`${key}\\s+([^,]+)`);
  const match = text.match(keyPattern);
  return match ? match[1].trim().replace(/[()]/g, '') : null;
}

export default function UploadPayrollFileButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Detect mobile layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      throw new Error(`${file.name} is not a valid Excel file`);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = evt.target?.result;
          if (!data) throw new Error("Failed to read file");

          const workbook = XLSX.read(data, { type: "array" });
          const wsName = workbook.SheetNames[0];
          const ws = workbook.Sheets[wsName];
          const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
          const untrimmedData = jsonData as any[][];

          // Extract branch name and date range
          const branchName = getNextWord(untrimmedData[4][1], "from")?.replaceAll(",", "") ?? "";
          const dateFieldValue = findDateInData(untrimmedData);
          
          const { startDate, endDate } = typeof dateFieldValue === "string" 
            ? extractDateRange(dateFieldValue)
            : { startDate: "", endDate: "" };

          // Prepare safe file name parts
          const safeBranch = branchName.replace(/\s+/g, "").replace(/,/g, "");
          const safeStart = startDate.replace(/\s+/g, "").replace(/,/g, "");
          const safeEnd = endDate.replace(/\s+/g, "").replace(/,/g, "");
          const fileExt = file.name.endsWith(".xlsx") ? ".xlsx" : ".xls";

          const supabase = createClient();

          // Get or insert payroll period
          const payrollPeriodId = await handlePayrollPeriod(supabase, branchName, startDate, endDate);
          if (!payrollPeriodId) throw new Error("Failed to create payroll period");

          const customFileName = `${safeBranch}_${payrollPeriodId}_${safeStart}_${safeEnd}${fileExt}`;

          // Check for existing file
          const { data: existingFile } = await supabase.storage
            .from("payroll-files")
            .list("", { search: customFileName });

          if (existingFile?.some(f => f.name === customFileName)) {
            throw new Error("File already exists");
          }

          // Process and upload data
          const filteredData = untrimmedData
            .slice(7)
            .slice(4, untrimmedData.length - 20)
            .filter(row => row[1] !== null && row[1] !== undefined && row[1] !== "");

          await uploadPayrollEntries(supabase, filteredData, payrollPeriodId, startDate, endDate);
          await uploadFile(supabase, file, customFileName, branchName, payrollPeriodId);

          resolve(customFileName);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const results: { file: string; status: 'success' | 'error'; message?: string }[] = [];

    try {
      await Promise.all(files.map(async (file) => {
        try {
          const filename = await processFile(file);
          results.push({ file: file.name, status: 'success' });
        } catch (error) {
          results.push({ 
            file: file.name, 
            status: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }));

      // Show summary
      const successful = results.filter(r => r.status === 'success').length;
      const failed = results.filter(r => r.status === 'error').length;
      
      alert(`Upload complete:\n${successful} files uploaded successfully\n${failed} files failed\n\n${
        failed > 0 ? 'Failed files:\n' + results
          .filter(r => r.status === 'error')
          .map(r => `${r.file}: ${r.message}`)
          .join('\n') : ''
      }`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx,.xls"
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button 
        onClick={handleButtonClick} 
        size={isMobile ? "icon" : "default"} 
        className="mr-2"
        disabled={isUploading}
      >
        {isMobile ? <FaUpload /> : isUploading ? "Uploading..." : "Upload Payroll"}
      </Button>
    </>
  );
}

// Helper functions
function findDateInData(data: any[][]): string | null {
  for (const row of data) {
    for (const cell of row) {
      if (cell instanceof Date || 
         (typeof cell === "string" && !isNaN(Date.parse(cell)) && cell.trim())) {
        return cell instanceof Date ? cell.toISOString() : cell;
      }
    }
  }
  return null;
}

async function handlePayrollPeriod(supabase: any, branch: string, startDate: string, endDate: string) {
  const { data: payrollPeriod } = await supabase
    .from("PayrollPeriod")
    .select("id")
    .eq("payroll_start", startDate)
    .eq("payroll_end", endDate)
    .eq("branch", branch)
    .maybeSingle();

  if (payrollPeriod?.id) return payrollPeriod.id;

  const { data: insertedPeriod } = await supabase
    .from("PayrollPeriod")
    .insert({
      payroll_start: startDate,
      payroll_end: endDate,
      branch,
    })
    .select("id")
    .single();

  return insertedPeriod?.id;
}

async function uploadPayrollEntries(supabase: any, data: any[], periodId: number, startDate: string, endDate: string) {
  for (const row of data) {
    const rowObj = {
      payroll_period_id: periodId,
      payroll_start: startDate,
      payroll_end: endDate,
      employee: row[1] ?? "",
      days_worked: row[2] ?? 0,
      monthly_rate: row[3] ?? 0,
      daily_rate: row[4] ?? 0,
      basic_rate: row[5] ?? 0,
      overtime_hrs: row[6] ?? 0,
      overtime_amount: row[7] ?? 0,
      holiday_no: row[8] ?? 0,
      holiday_pay: row[9] ?? 0,
      special_no: row[10] ?? 0,
      special_pay: row[11] ?? 0,
      rest_day_no: row[12] ?? 0,
      rest_day_pay: row[13] ?? 0,
      no_of_ns_hours: row[14] ?? 0,
      nsd_pay: row[15] ?? 0,
      gross_pay: row[16] ?? 0,
      sss: row[17] ?? 0,
      philhealth: row[18] ?? 0,
      pagibig: row[19] ?? 0,
      sssloan: row[20] ?? 0,
      ca: row[21] ?? 0,
      hidden: row[22] ?? 0,
      net_salary: row[23] ?? 0,
    };
    await supabase.from("PayrollEntry").insert([rowObj]);
  }
}

async function uploadFile(supabase: any, file: File, fileName: string, branch: string, periodId: number) {
  await supabase.storage
    .from("payroll-files")
    .upload(fileName, file, { upsert: true });

  await supabase.from("payroll_files").insert({
    filename: fileName,
    branch: branch,
    payroll_period_id: periodId,
    public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payroll-files/${fileName}`,
  });
}