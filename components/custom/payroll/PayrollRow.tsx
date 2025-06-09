import { formatCurrency } from "@/lib/utils/format_utils";

interface PayrollRowProps {
  row: any[];
  index: number;
  staticHeaders: string[];
  currencyHeaders: string[];
}

export function PayrollRow({ row, index, staticHeaders, currencyHeaders }: PayrollRowProps) {
  return (
    <tr className={`${index % 2 === 0 ? "bg-sidebar-accent/30" : "bg-white"} hover:bg-sidebar-accent/50 transition-colors`}>
      {Array.from({ length: staticHeaders.length }).map((_, j) => {
        const header = staticHeaders[j]?.toLowerCase().trim();
        const shouldFormat = currencyHeaders.includes(header);
        const isName = header === "name of employee".toLowerCase();
        const isSignature = header === "signature".toLowerCase();
        let value = row[j];

        if (j === 0) {
          value = index + 1;
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
  );
}