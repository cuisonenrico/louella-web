"use client";

import { PayrollEntry } from "@/lib/types/payroll";

interface PayrollDesktopTableProps {
  entries: PayrollEntry[];
  isFiltering: boolean;
  itemsPerPage: number;
  formatCurrency: (value: number) => string;
}

function TableLoadingSkeleton({ itemsPerPage }: { itemsPerPage: number }) {
  return (
    <>
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <tr key={`skeleton-row-${index}`} className="animate-pulse">
          <td className="px-4 py-3">
            <div className="h-4 bg-muted rounded w-32 mb-1"></div>
            <div className="h-3 bg-muted rounded w-24"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted rounded w-20"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted rounded w-24"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted rounded w-24"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted rounded w-20"></div>
          </td>
          <td className="px-4 py-3">
            <div className="h-4 bg-muted rounded w-24"></div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function PayrollDesktopTable({
  entries,
  isFiltering,
  itemsPerPage,
  formatCurrency,
}: PayrollDesktopTableProps) {
  return (
    <div
      className={`hidden sm:block rounded-lg border overflow-hidden transition-all duration-300 ${
        isFiltering ? "opacity-50 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Payroll Period
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Gross
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Deductions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Net
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isFiltering ? (
              <TableLoadingSkeleton itemsPerPage={itemsPerPage} />
            ) : (
              entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className="hover:bg-muted/50 transition-all duration-200 transform hover:scale-[1.01]"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animation: "fadeInUp 0.4s ease-out forwards",
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{entry.employee}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.payroll_start).toLocaleDateString()} -{" "}
                      {new Date(entry.payroll_end).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(entry.payroll_end).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(entry.monthly_rate)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    {formatCurrency(entry.gross_pay)}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600">
                    {formatCurrency(
                      entry.sss +
                        entry.philhealth +
                        entry.pagibig +
                        entry.sssloan +
                        entry.ca
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">
                    {formatCurrency(entry.net_salary)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
