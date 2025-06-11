"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Building2Icon, DollarSignIcon } from "lucide-react";
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
  branch?: string;
}

export function PayrollList({ staticHeaders }: PayrollListProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const netSalaryIdx = staticHeaders.findIndex(
    (h) => h.toLowerCase().trim() === "net salary".toLowerCase()
  );

  const validEmployees = payrollList.filter(
    (row) => row[1] !== null && row[1] !== undefined && row[1] !== ""
  );

  const totalNetSalary = validEmployees.reduce((sum, row) => {
    let value = row[netSalaryIdx];
    if (value === undefined || value === null || value === "") value = 0;
    return sum + (typeof value === "string" ? Number(value) : value);
  }, 0);

  return (
    <div className="@container/main flex flex-1 flex-col gap-4">
      {/* File Selection Section */}

      <PayrollFileList
        files={files}
        selectedFile={selectedFile}
        onFileSelect={(file) => {
          void handleFileSelect(file);
        }}
      />

      {/* Payroll Summary Header */}
      {payrollList.length > 0 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Payroll Table with integrated period indicator */}
          <PayrollTable
            payrollList={payrollList}
            staticHeaders={staticHeaders}
            currencyHeaders={currencyHeaders}
            title="Employee Payroll Records"
            description="Detailed breakdown of employee compensation and deductions"
            payrollPeriod={formatPayrollPeriod(date)}
            branch={selectedFile?.branch || "Unknown Branch"}
            totalEmployees={validEmployees.length}
            totalNetSalary={totalNetSalary}
          />

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5 text-primary" />
                Payroll Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Total Employees
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {validEmployees.length}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Total Net Salary
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalNetSalary)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Average per Employee
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      validEmployees.length > 0
                        ? totalNetSalary / validEmployees.length
                        : 0
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">
                Loading payroll data...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && payrollList.length === 0 && selectedFile && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building2Icon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">
                No payroll data found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The selected file doesn't contain any payroll records.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
