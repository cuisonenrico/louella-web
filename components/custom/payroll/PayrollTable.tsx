import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format_utils";
import { PayrollRow } from "./PayrollRow";

interface PayrollTableProps {
  payrollList: any[][];
  staticHeaders: string[];
  currencyHeaders: string[];
}

export function PayrollTable({ payrollList, staticHeaders, currencyHeaders }: PayrollTableProps) {
  return (
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
                <PayrollRow 
                  key={i}
                  row={row}
                  index={i}
                  staticHeaders={staticHeaders}
                  currencyHeaders={currencyHeaders}
                />
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}