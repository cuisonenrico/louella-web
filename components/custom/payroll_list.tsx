"use client";

import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/lib/utils/format_utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaFileExcel, FaCalendarAlt } from "react-icons/fa";

interface PayrollListProps {
  staticHeaders: string[];
}

export function PayrollList({ staticHeaders }: PayrollListProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [date, setDate] = useState<string>("");

  // Fetch files on component mount
  useEffect(() => {
    const fetchPayrollFiles = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("payroll_files").select("*");
      setFiles(data || []);
    };
    fetchPayrollFiles();
  }, []);

  // Handle file selection
  const handleFileSelect = async (fileName: string) => {
    setSelectedFile(fileName);
    const supabase = createClient();
    const { data } = supabase.storage.from("payroll-files").getPublicUrl(fileName);
    if (!data.publicUrl) return;

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

    setDate(dateFieldValue ? dateFieldValue.toString() : "");
    setPayrollList(untrimmedData.slice(4).slice(4, (jsonData as any[][]).length - 13));
  };

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
    "Net Salary"
  ].map(h => h.toLowerCase().trim());

  const netSalaryIdx = staticHeaders.findIndex(
    h => h.toLowerCase().trim() === "net salary".toLowerCase()
  );

  const totalNetSalary = payrollList
    .filter(row => row[1] !== null && row[1] !== undefined && row[1] !== "")
    .reduce((sum, row) => {
      let value = row[netSalaryIdx];
      if (value === undefined || value === null || value === "") value = 0;
      return sum + (typeof value === "string" ? Number(value) : value);
    }, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* File Picker Card - Now at the top */}
      <Card className="w-full p-4">
        <div className="flex items-center gap-2 text-sidebar-primary font-semibold mb-4">
          <FaFileExcel />
          <span>Payroll Files</span>
        </div>
        
        <ScrollArea className="h-48">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {files.map((file) => (
              <Button
                key={file.id}
                variant="ghost"
                className={`w-full justify-start text-left font-normal ${
                  selectedFile === file.filename 
                    ? 'bg-sidebar-accent text-sidebar-primary' 
                    : ''
                }`}
                onClick={() => handleFileSelect(file.filename)}
              >
                <FaFileExcel className="mr-2 h-4 w-4" />
                <span className="truncate">{file.filename}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Payroll Content */}
      {payrollList.length > 0 && (
        <div className="flex flex-col gap-4">
          {date && (
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sidebar-foreground">
                <FaCalendarAlt className="text-sidebar-primary" />
                <span className="font-semibold">{date}</span>
              </div>
            </Card>
          )}
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-track-secondary scrollbar-thumb-primary hover:scrollbar-thumb-primary/80">
              <table className="w-full">
                <thead>
                  <tr className="bg-sidebar-primary">
                    {staticHeaders.map((header, idx) => (
                      <th
                        key={idx}
                        className="border-b border-sidebar-border px-4 py-2 text-xs font-bold text-sidebar-primary-foreground text-left"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payrollList
                    .filter(row => row[1] !== null && row[1] !== undefined && row[1] !== "")
                    .map((row, i) => (
                      <tr
                        key={i}
                        className={`${
                          i % 2 === 0 ? "bg-sidebar-accent/30" : "bg-white"
                        } hover:bg-sidebar-accent/50 transition-colors`}
                      >
                        {Array.from({ length: staticHeaders.length }).map((_, j) => {
                          const header = staticHeaders[j]?.toLowerCase().trim();
                          const shouldFormat = currencyHeaders.includes(header);
                          const isName = header === "name of employee".toLowerCase();
                          const isSignature = header === "signature".toLowerCase();
                          let value = row[j];

                          if (j === 0) {
                            value = i + 1;
                          } else if ((value === undefined || value === null || value === "") && !isName && !isSignature) {
                            value = 0;
                          }

                          return (
                            <td
                              key={j}
                              className="border border-sidebar-border px-4 py-2 text-sm text-sidebar-foreground whitespace-nowrap"
                            >
                              {shouldFormat ? formatCurrency(value) : value}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>

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