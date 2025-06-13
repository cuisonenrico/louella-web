"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpenseTableSkeleton() {
  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Date
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Amount
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Branch
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-border/50 animate-pulse"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-full max-w-md" />
                    <Skeleton className="h-4 w-3/4 max-w-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ExpenseMobileListSkeleton() {
  return (
    <div className="block lg:hidden">
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>

              <div className="mb-2">
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ExpenseStatsSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-6 w-32 rounded-full" />
    </div>
  );
}
