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
    const startDay = match[2];
    const endDay = match[3];
    const year = match[4];
    return {
      startDate: `${month} ${startDay}, ${year}`,
      endDate: `${month} ${endDay}, ${year}`,
    };
  }
  return { startDate: "", endDate: "" };
}

function getNextWord(text: string, key: string) {
  const words = text.split(/\s+/);
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].replace(/[.,!?]/g, "") === key) {
      return words[i + 1].replaceAll("(", "").replaceAll(")", "");
    }
  }
  return null;
}

export default function UploadPayrollFileButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const supabase = createClient();
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please select an XLSX or XLS file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "array" });
      const wsName = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsName];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const untrimmedData = jsonData as any[][];

      // Extract branch name and date range
      const branchName =
        getNextWord(untrimmedData[4][1], "BAKESHOP")?.replaceAll(",", "") ?? "";
      let dateFieldValue: any = null;
      for (let row of untrimmedData) {
        for (let col = 0; col < row.length; col++) {
          const cell = row[col];
          if (
            cell instanceof Date ||
            (typeof cell === "string" &&
              !isNaN(Date.parse(cell)) &&
              cell.trim() !== "")
          ) {
            dateFieldValue = cell;
            break;
          }
        }
        if (dateFieldValue) break;
      }

      let startDate = "",
        endDate = "";
      if (typeof dateFieldValue === "string") {
        const range = extractDateRange(dateFieldValue);
        startDate = range.startDate;
        endDate = range.endDate;
      }

      // Prepare safe file name parts
      const safeBranch = branchName.replace(/\s+/g, "").replace(/,/g, "");
      const safeStart = startDate.replace(/\s+/g, "").replace(/,/g, "");
      const safeEnd = endDate.replace(/\s+/g, "").replace(/,/g, "");
      const fileExt = file.name.endsWith(".xlsx") ? ".xlsx" : ".xls";

      // --- The rest of your logic (insert period, entries, upload, etc) ---
      // Get or insert payroll period
      let payrollPeriodId: number | null = null;
      try {
        const { data: payrollPeriod } =
          await supabase
            .from("PayrollPeriod")
            .select("id")
            .eq("payroll_start", startDate)
            .eq("payroll_end", endDate)
            .eq("branch", branchName)
            .maybeSingle();

        if (payrollPeriod && payrollPeriod.id) {
          payrollPeriodId = payrollPeriod.id;
        } else {
          const { data: insertedPeriod } = await supabase
            .from("PayrollPeriod")
            .insert({
              payroll_start: startDate,
              payroll_end: endDate,
              branch: branchName,
            })
            .select("id")
            .single();
          if (insertedPeriod && insertedPeriod.id) {
            payrollPeriodId = insertedPeriod.id;
          } else {
            alert("Failed to create payroll period.");
            return;
          }
        }
      } catch (error) {
        alert("Error fetching or inserting payroll period: " + error);
        return;
      }

      // Now that payrollPeriodId is available, construct the custom file name
      const customFileName = `${safeBranch}_${payrollPeriodId}_${safeStart}_${safeEnd}${fileExt}`;

      // Check if file already exists in the bucket
      const { data: existingFile, error: listError } = await supabase
        .storage
        .from("payroll-files")
        .list("", { search: customFileName });

      if (existingFile && existingFile.some(f => f.name === customFileName)) {
        alert("This payroll file has already been uploaded. No records were written.");
        e.target.value = "";
        return;
      }

      // Filter and trim data
      const filteredData = untrimmedData
        .slice(7)
        .slice(4, untrimmedData.length - 20)
        .filter(
          (row) => row[1] !== null && row[1] !== undefined && row[1] !== ""
        );

      // Insert payroll entries
      for (const row of filteredData) {
        const rowObj = {
          payroll_period_id: payrollPeriodId,
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
        const { error } = await supabase.from("PayrollEntry").insert([rowObj]);
        if (error) {
          console.error("Insert error:", error.message, rowObj);
        }
      }

      // Upload file with custom name
      const { error: uploadError } = await supabase.storage
        .from("payroll-files")
        .upload(customFileName, file, { upsert: true });
      if (uploadError) {
        alert("Upload failed: " + uploadError.message);
        return;
      }

      // Insert file record
      const { error: fileInsertError } = await supabase.from("payroll_files").insert({
        filename: customFileName,
        branch: branchName,
        payroll_period_id: payrollPeriodId,
        public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payroll-files/${customFileName}`,
      });
      if (fileInsertError) {
        alert("File record insert failed: " + fileInsertError.message);
      } else {
        alert("File uploaded successfully!");
      }
      e.target.value = "";
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button onClick={handleButtonClick} size={isMobile ? "icon" : "default"} className='mr-2'>
        {isMobile ? <FaUpload /> : "Upload Payroll"}
      </Button>
    </>
  );
}