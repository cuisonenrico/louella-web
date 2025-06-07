"use client";
import { read } from "fs";
import { Button } from "../ui/button";
import * as XLSX from 'xlsx';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";


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

  const [data, setData] = useState<any[]>([]);
  const [date, setDate] = useState<String>('');

  // Function to handle the file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });

      // Read first sheet
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];

      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // Remove the first 4 indexes (rows)
      const untrimmedData = (jsonData as any[][])

      // Find the first field (column index) where a date value exists
      let dateFieldIndex: number | null = null;
      let dateFieldValue: any = null;
      for (let row of untrimmedData) {
        for (let col = 0; col < row.length; col++) {
          const cell = row[col];
          // Check for JS Date or parseable date string
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
      // You now have the column index in `dateFieldIndex` and the value in `dateFieldValue`
      // Example: console.log
      console.log("Date field index:", dateFieldIndex, "Sample value:", dateFieldValue);
      setDate(dateFieldValue.toString());

      setData(untrimmedData.slice(4).slice(4, (jsonData as any[][]).length - 13));
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          <input
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            id="inventory-file-input"
            onChange={handleFileUpload}
          />
          <label htmlFor="inventory-file-input">
            <Button asChild>
              <span>View Payroll File</span>
            </Button>
          </label>
          {/* In your Next.js component, use the 'data' array to render a table */}
          {/* Example HTML table */}
          {data.length > 0 && (
            <div className="overflow-x-auto mt-4">
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
                    // List of headers to format as currency (case-insensitive, trimmed)
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

                    return data
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
                  // Find the Net Salary column index
                  const netSalaryIdx = staticHeaders.findIndex(
                    h => h.toLowerCase().trim() === "net salary".toLowerCase()
                  );
                  // Sum all Net Salary values
                  const totalNetSalary = data
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