"use client"

import { PayrollEntry } from "@/types/payroll"

interface PayrollMobileViewProps {
  entries: PayrollEntry[]
  isFiltering: boolean
  formatCurrency: (value: number) => string
}

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="p-4 rounded-lg border bg-card animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 bg-muted rounded w-16 mb-1"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export function PayrollMobileView({ entries, isFiltering, formatCurrency }: PayrollMobileViewProps) {
  return (
    <div className={`sm:hidden space-y-3 transition-all duration-300 ${
      isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
    }`}>
      {isFiltering ? (
        <LoadingSkeleton />
      ) : (
        entries.map((entry, index) => (
          <div 
            key={entry.id} 
            className="p-4 rounded-lg border bg-card transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.4s ease-out forwards'
            }}
          >
            <div className="space-y-2">
              <div className="font-medium">{entry.employee}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(entry.payroll_start).toLocaleDateString()} - {new Date(entry.payroll_end).toLocaleDateString()}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-xs text-muted-foreground">Monthly Rate</div>
                  <div className="text-sm font-medium">{formatCurrency(entry.monthly_rate)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Gross Pay</div>
                  <div className="text-sm font-medium text-green-600">{formatCurrency(entry.gross_pay)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Deductions</div>
                  <div className="text-sm font-medium text-red-600">
                    {formatCurrency(entry.sss + entry.philhealth + entry.pagibig + entry.sssloan + entry.ca)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Net Salary</div>
                  <div className="text-sm font-medium text-blue-600">{formatCurrency(entry.net_salary)}</div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
