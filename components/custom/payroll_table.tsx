"use client";

import * as XLSX from 'xlsx';
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaFileExcel } from "react-icons/fa"; // You can use any icon library


const staticHeaders = [
  "#",
  "Employee",
  "Days Worked",
  "Monthly rate",
  "Daily rate",
  "Basic rate",
  "Overtime Hrs",
  "Overtime Amount",
  "Holiday No.",
  "Holiday Pay",
  "Special No.",
  "Special Pay",
  "Rest Day No.",
  "Rest day Pay",
  "No.of NS Hours",
  "NSD Pay",
  "GROSS Pay",
  "SSS",
  "PhilHealth",
  "Pag-Ibig",
  "SSSLoan",
  "C.A.",
  "Hidden",
  "Net Salary",
];

// Add this helper function above your component
function formatCurrency(value: any) {
  if (typeof value === "number") {
    return value.toLocaleString("en-US", { style: "currency", currency: "PHP" });
  }
  if (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "") {
    return Number(value).toLocaleString("en-US", { style: "currency", currency: "PHP" });
  }
  return value;
}

export default function PayrollTable() {
  const [fileList, setFileList] = useState<any[]>([]);
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [date, setDate] = useState<String>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPayrollFiles = async () => {
      const supabase = createClient();


      const {data} = await supabase.from("payroll_files").select("*");
      console.log("Files in Storage:", data);
      setFileList(data || []);
    };
    fetchPayrollFiles();
  }, [])

  // Function to handle file selection from Supabase
  const handleSupabaseFileClick = async (fileName: string) => {
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

    // Find the first field (column index) where a date value exists
    let dateFieldIndex: number | null = null;
    let dateFieldValue: any = null;
    /* eslint-disable prefer-const */
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

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-0">
          <div className="flex gap-2 items-center">
          </div>
          {/* File List */}
          {fileList.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              {fileList.map((file: any) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border hover:bg-gray-100 cursor-pointer w-full"
                  onClick={() => handleSupabaseFileClick(file.filename)}
                >
                  <span className="truncate">{file.filename}</span>
                  <FaFileExcel className="text-green-600 text-lg ml-2" />
                </div>
              ))}
            </div>
          )}
          {/* Responsive Table */}
          {payrollList.length > 0 && (
            <div className="w-full h-full flex flex-col gap-4 overflow-x-auto">
              {/* Display the date at the top of the table */}
              {date && (
                <div className="mb-2 text-base font-semibold text-gray-700">
                  {date}
                </div>
              )}
              <table className="min-w-full border border-gray-300 rounded-lg shadow-sm bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    {staticHeaders.map((header, idx) => (
                      <th
                        key={idx}
                        className="border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 whitespace-nowrap text-left"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const maxCols = staticHeaders.length;
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

                    return payrollList
                      .filter(row => row[1] !== null && row[1] !== undefined && row[1] !== "")
                      .map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          {Array.from({ length: maxCols }).map((_, j) => {
                            const header = staticHeaders[j]?.toLowerCase().trim();
                            const shouldFormat = currencyHeaders.includes(header);
                            const isName = header === "name of employee".toLowerCase();
                            const isSignature = header === "signature".toLowerCase();
                            let value = row[j];

                            // First column: show incrementing number
                            if (j === 0) {
                              value = i + 1;
                            } else if ((value === undefined || value === null || value === "") && !isName && !isSignature) {
                              value = 0;
                            }

                            return (
                              <td
                                key={j}
                                className="border border-gray-200 px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
                              >
                                {shouldFormat ? formatCurrency(value) : value}
                              </td>
                            );
                          })}
                        </tr>
                      ));
                  })()}
                </tbody>
              </table>
              {/* Net Salary Total */}
              <div className="flex justify-start mt-4">
                {(() => {
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
                    <div className="text-left font-bold text-lg">
                      Total Net Salary: {formatCurrency(totalNetSalary)}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}