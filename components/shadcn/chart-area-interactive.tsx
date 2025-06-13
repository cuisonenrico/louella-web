"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PayrollData {
  date: string;
  expenses: number;
  branch: string;
}

interface OtherExpensesData {
  date: string;
  expenses: number;
  branch: string;
}

interface ChartAreaInteractiveProps {
  data: PayrollData[];
  previousExpensesData?: PayrollData[];
  otherExpensesData?: OtherExpensesData[];
  title?: string;
}

const PRIMARY_COLOR = "#F28C28";
const SECONDARY_COLOR = "#CD5C5C";
const OTHER_EXPENSES_COLOR = "#8B5CF6"; // Purple color for Other Expenses

const chartConfig = {
  expenses: {
    label: "Payroll",
    color: PRIMARY_COLOR,
  },
  previousExpenses: {
    label: "Total",
    color: SECONDARY_COLOR,
  },
  otherExpenses: {
    label: "Other Expenses",
    color: OTHER_EXPENSES_COLOR,
  },
} satisfies ChartConfig;

// Custom tooltip content with proper spacing
const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {new Date(label).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {chartConfig[entry.dataKey as keyof typeof chartConfig]?.label}:
              </span>
              <span className="text-sm font-medium text-foreground">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function ChartAreaInteractive({
  data,
  previousExpensesData,
  otherExpensesData = [],
  title = "Payroll Expenses",
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("6m");
  const [selectedBranch, setSelectedBranch] = React.useState("all");
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear().toString()
  );

  // Calculate previous expenses as sum of current data and other expenses
  const calculatedPreviousExpenses = React.useMemo(() => {
    const summedData = new Map<string, PayrollData>();

    // Add current data
    data.forEach((item) => {
      summedData.set(item.date, {
        date: item.date,
        expenses: item.expenses,
        branch: item.branch,
      });
    });

    // Add other expenses data to the sum
    otherExpensesData.forEach((item) => {
      const existing = summedData.get(item.date);
      if (existing) {
        existing.expenses += item.expenses;
      } else {
        summedData.set(item.date, {
          date: item.date,
          expenses: item.expenses,
          branch: item.branch,
        });
      }
    });

    return Array.from(summedData.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data, otherExpensesData]);

  // Use calculated sum or provided previous expenses data
  const finalPreviousExpenses =
    previousExpensesData || calculatedPreviousExpenses;

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1m");
    }

    console.log("Current Data:", data);
    console.log("Other Expenses Data:", otherExpensesData);
    console.log("Previous Expenses Data (calculated):", finalPreviousExpenses);
  }, [isMobile, data, otherExpensesData, finalPreviousExpenses]);

  // Get unique years from all datasets
  const years = React.useMemo(() => {
    const allDates = [
      ...data.map((item) => item.date),
      ...otherExpensesData.map((item) => item.date),
      ...finalPreviousExpenses.map((item) => item.date),
    ];
    return Array.from(
      new Set(allDates.map((date) => new Date(date).getFullYear().toString()))
    ).sort((a, b) => b.localeCompare(a)); // Sort descending
  }, [data, otherExpensesData, finalPreviousExpenses]);

  const filteredData = React.useMemo(() => {
    // Filter current payroll data
    const filteredCurrent = data.filter((item) => {
      const date = new Date(item.date);
      const matchesBranch =
        selectedBranch === "all" || item.branch === selectedBranch;
      const matchesYear = date.getFullYear().toString() === selectedYear;
      return matchesBranch && matchesYear;
    });

    // Filter other expenses data
    const filteredOtherExpenses = otherExpensesData.filter((item) => {
      const date = new Date(item.date);
      const matchesBranch =
        selectedBranch === "all" || item.branch === selectedBranch;
      const matchesYear = date.getFullYear().toString() === selectedYear;
      return matchesBranch && matchesYear;
    });

    // Filter previous expenses data
    const filteredPrevious = finalPreviousExpenses.filter((item) => {
      const date = new Date(item.date);
      const matchesBranch =
        selectedBranch === "all" || item.branch === selectedBranch;
      const matchesYear = date.getFullYear().toString() === selectedYear;
      return matchesBranch && matchesYear;
    });

    // Merge all datasets by date
    const mergedData = new Map();

    // Add current payroll data
    filteredCurrent.forEach((item) => {
      const dateKey = item.date;
      mergedData.set(dateKey, {
        date: dateKey,
        expenses: item.expenses,
        previousExpenses: 0,
        otherExpenses: 0,
        branch: item.branch,
      });
    });

    // Add previous expenses data
    filteredPrevious.forEach((item) => {
      const dateKey = item.date;
      const existing = mergedData.get(dateKey);
      if (existing) {
        existing.previousExpenses = item.expenses;
      } else {
        mergedData.set(dateKey, {
          date: dateKey,
          expenses: 0,
          previousExpenses: item.expenses,
          otherExpenses: 0,
          branch: item.branch,
        });
      }
    });

    // Add other expenses data
    filteredOtherExpenses.forEach((item) => {
      const dateKey = item.date;
      const existing = mergedData.get(dateKey);
      if (existing) {
        existing.otherExpenses = item.expenses;
      } else {
        mergedData.set(dateKey, {
          date: dateKey,
          expenses: 0,
          previousExpenses: 0,
          otherExpenses: item.expenses,
          branch: item.branch,
        });
      }
    });

    // Convert back to array and sort
    return Array.from(mergedData.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [
    data,
    otherExpensesData,
    finalPreviousExpenses,
    timeRange,
    selectedBranch,
    selectedYear,
  ]);

  const branches = React.useMemo(() => {
    const allBranches = [
      ...data.map((item) => item.branch),
      ...otherExpensesData.map((item) => item.branch),
      ...finalPreviousExpenses.map((item) => item.branch),
    ];
    return Array.from(new Set(allBranches));
  }, [data, otherExpensesData, finalPreviousExpenses]);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Payroll expenses comparison for the last{" "}
            {timeRange === "6m" ? "6" : timeRange === "3m" ? "3" : "1"} month(s)
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="6m" className="h-8 px-2.5">
              6 Months
            </ToggleGroupItem>
            <ToggleGroupItem value="3m" className="h-8 px-2.5">
              3 Months
            </ToggleGroupItem>
            <ToggleGroupItem value="1m" className="h-8 px-2.5">
              1 Month
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.8} />
                <stop
                  offset="95%"
                  stopColor={PRIMARY_COLOR}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillPreviousExpenses"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={SECONDARY_COLOR}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={SECONDARY_COLOR}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillOtherExpenses"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={OTHER_EXPENSES_COLOR}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={OTHER_EXPENSES_COLOR}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "long",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const formatter = new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  notation: "compact",
                  compactDisplay: "short",
                });
                return formatter.format(value);
              }}
            />
            <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
            <Area
              dataKey="previousExpenses"
              type="monotone"
              fill="url(#fillPreviousExpenses)"
              stroke={SECONDARY_COLOR}
              strokeDasharray="5 5"
            />
            <Area
              dataKey="otherExpenses"
              type="monotone"
              fill="url(#fillOtherExpenses)"
              stroke={OTHER_EXPENSES_COLOR}
              strokeDasharray="2 2"
            />
            <Area
              dataKey="expenses"
              type="monotone"
              fill="url(#fillExpenses)"
              stroke={PRIMARY_COLOR}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
