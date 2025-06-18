import { Card } from "@/components/ui/card";

export function EmployeeTableSkeleton() {
  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Name
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Phone
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Gender
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Date of Birth
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-center whitespace-nowrap w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse border-b border-border/50">
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-48"></div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-muted rounded w-24"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-6 bg-muted rounded-full w-16"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-muted rounded w-20"></div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="h-8 w-8 bg-muted rounded"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
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

export function EmployeeMobileListSkeleton() {
  return (
    <div className="lg:hidden space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="p-4 animate-pulse">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
              <div className="flex gap-1">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="h-3 bg-muted rounded w-12 mb-1"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
              <div>
                <div className="h-3 bg-muted rounded w-16 mb-1"></div>
                <div className="h-6 bg-muted rounded-full w-16"></div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
