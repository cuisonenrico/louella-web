"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { FaCalendarAlt } from "react-icons/fa";
import {
  processPayrollFile,
  processPayrollFromDB,
} from "@/lib/payroll/process-payroll";
import { PayrollFileList } from "./PayrollFileList";
import { PayrollTable } from "./PayrollTable";
import { formatCurrency, formatPayrollPeriod } from "@/lib/utils/format_utils";

interface PayrollListProps {
  staticHeaders: string[];
}

const currencyHeaders = [
  "C.A.",
  "SSS",
  "PhilHealth",
  "Pag-Ibig",
  "SSSLoan",
  "GROSS Pay",
  "NSD Pay",
  "Rest day Pay",
  "Special Pay",
  "Holiday Pay",
  "Overtime Amount",
  "BASIC rate",
  "DAILY rate",
  "Monthly rate",
  "Net Salary",
].map((h) => h.toLowerCase().trim());

interface PayrollFile {
  id: string;
  filename: string;
  payroll_period_id?: number;
}

export function PayrollList({ staticHeaders }: PayrollListProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const fetchPayrollFiles = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("payroll_files").select("*");
      setFiles(data || []);
    };
    fetchPayrollFiles();
  }, []);

  const handleFileSelect = async (file: PayrollFile) => {
    try {
      setSelectedFile(file);

      // If file has payroll_period_id, get data from DB
      if (file.payroll_period_id) {
        const { date: fileDate, payrollData } = await processPayrollFromDB(
          file.payroll_period_id
        );
        setDate(fileDate);
        setPayrollList(payrollData);
      } else {
        // Fallback to file processing if no period ID
        const { date: fileDate, payrollData } = await processPayrollFile(
          file.filename
        );
        setDate(fileDate);
        setPayrollList(payrollData);
      }
    } catch (error) {
      console.error("Error processing payroll file:", error);
    }
  };

  const netSalaryIdx = staticHeaders.findIndex(
    (h) => h.toLowerCase().trim() === "net salary".toLowerCase()
  );

  const totalNetSalary = payrollList
    .filter((row) => row[1] !== null && row[1] !== undefined && row[1] !== "")
    .reduce((sum, row) => {
      let value = row[netSalaryIdx];
      if (value === undefined || value === null || value === "") value = 0;
      return sum + (typeof value === "string" ? Number(value) : value);
    }, 0);

  return (
    <div className="flex flex-col gap-4">
      <PayrollFileList
        files={files}
        selectedFile={selectedFile}
        onFileSelect={(file) => {
          void handleFileSelect(file);
        }}
      />

      {payrollList.length > 0 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {date && (
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sidebar-foreground">
                <FaCalendarAlt className="text-sidebar-primary" />
                <span className="font-semibold">
                  {formatPayrollPeriod(date)} of {selectedFile?.branch}
                </span>
              </div>
            </Card>
          )}

          <PayrollTable
            payrollList={payrollList}
            staticHeaders={staticHeaders}
            currencyHeaders={currencyHeaders}
          />

          <Card className="p-4">
            <div className="flex justify-start">
              <div className="text-left font-bold text-lg text-sidebar-primary">
                Total Net Salary: {formatCurrency(totalNetSalary)}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
