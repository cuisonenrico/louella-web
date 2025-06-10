"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface PayrollData {
  date: string
  expenses: number
  branch: string
}

interface C2ValeData {
  date: string
  expenses: number
  branch: string
}

interface ChartAreaInteractiveProps {
  data: PayrollData[]
  c2ValeData?: C2ValeData[]
  previousExpensesData?: PayrollData[]
  title?: string
}

const PRIMARY_COLOR = "#F28C28"
const SECONDARY_COLOR = "#CD5C5C"
const C2_VALE_COLOR = "#10B981" // Green color for C2 Vale

// Dummy C2 Vale data for 2024 and 2025
const dummyC2ValeData: C2ValeData[] = [
  // 2024 data
  { date: "2024-01-01", expenses: 35000.50, branch: "All Branches" },
  { date: "2024-02-01", expenses: 42500.75, branch: "All Branches" },
  { date: "2024-03-01", expenses: 38750.25, branch: "All Branches" },
  { date: "2024-04-01", expenses: 41200.80, branch: "All Branches" },
  { date: "2024-05-01", expenses: 39800.60, branch: "All Branches" },
  { date: "2024-06-01", expenses: 44300.90, branch: "All Branches" },
  { date: "2024-07-01", expenses: 46750.40, branch: "All Branches" },
  { date: "2024-08-01", expenses: 43900.70, branch: "All Branches" },
  { date: "2024-09-01", expenses: 41500.85, branch: "All Branches" },
  { date: "2024-10-01", expenses: 45200.95, branch: "All Branches" },
  { date: "2024-11-01", expenses: 47800.65, branch: "All Branches" },
  { date: "2024-12-01", expenses: 52100.45, branch: "All Branches" },
  
  // 2025 data
  { date: "2025-01-01", expenses: 121023.23, branch: "All Branches" },
  { date: "2025-02-01", expenses: 98240.97, branch: "All Branches" },
  { date: "2025-03-01", expenses: 0.0, branch: "All Branches" },
  { date: "2025-04-01", expenses: 48750.65, branch: "All Branches" },
  { date: "2025-05-01", expenses: 51300.90, branch: "All Branches" },
]

// Dummy payroll data with previous period values
const dummyPayrollData: PayrollData[] = [
  // 2024 data
  { date: "2024-01-01", expenses: 85000.50, branch: "All Branches" },
  { date: "2024-02-01", expenses: 92500.75, branch: "All Branches" },
  { date: "2024-03-01", expenses: 88750.25, branch: "All Branches" },
  { date: "2024-04-01", expenses: 91200.80, branch: "All Branches" },
  { date: "2024-05-01", expenses: 89800.60, branch: "All Branches" },
  { date: "2024-06-01", expenses: 94300.90, branch: "All Branches" },
  { date: "2024-07-01", expenses: 96750.40, branch: "All Branches" },
  { date: "2024-08-01", expenses: 93900.70, branch: "All Branches" },
  { date: "2024-09-01", expenses: 91500.85, branch: "All Branches" },
  { date: "2024-10-01", expenses: 95200.95, branch: "All Branches" },
  { date: "2024-11-01", expenses: 97800.65, branch: "All Branches" },
  { date: "2024-12-01", expenses: 102100.45, branch: "All Branches" },
  
  // 2025 data
  { date: "2025-01-01", expenses: 105038.23, branch: "All Branches" },
  { date: "2025-02-01", expenses: 110240.97, branch: "All Branches" },
  { date: "2025-03-01", expenses: 108200.80, branch: "All Branches" },
  { date: "2025-04-01", expenses: 112750.65, branch: "All Branches" },
  { date: "2025-05-01", expenses: 115300.90, branch: "All Branches" },
]

const chartConfig = {
  expenses: {
    label: "Payroll ",
    color: PRIMARY_COLOR,
  },
  previousExpenses: {
    label: "Total ",
    color: SECONDARY_COLOR,
  },
  c2Vale: {
    label: "C2 Vale",
    color: C2_VALE_COLOR,
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ 
  data, 
  c2ValeData = dummyC2ValeData, 
  previousExpensesData,
  title = "Payroll Expenses" 
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("6m")
  const [selectedBranch, setSelectedBranch] = React.useState("all")
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString())

  // Calculate previous expenses as sum of current data and c2Vale data
  const calculatedPreviousExpenses = React.useMemo(() => {
    const summedData = new Map<string, PayrollData>();

    // Add current data
    data.forEach(item => {
      summedData.set(item.date, {
        date: item.date,
        expenses: item.expenses,
        branch: item.branch
      });
    });

    // Add c2Vale data to the sum
    c2ValeData.forEach(item => {
      const existing = summedData.get(item.date);
      if (existing) {
        existing.expenses += item.expenses;
      } else {
        summedData.set(item.date, {
          date: item.date,
          expenses: item.expenses,
          branch: item.branch
        });
      }
    });

    return Array.from(summedData.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data, c2ValeData]);

  // Use calculated sum or provided previous expenses data
  const finalPreviousExpenses = previousExpensesData || calculatedPreviousExpenses;

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1m")
    }

    console.log("Current Data:", data);
    console.log("C2 Vale Data:", c2ValeData);
    console.log("Previous Expenses Data (calculated):", finalPreviousExpenses);
  }, [isMobile, data, c2ValeData, finalPreviousExpenses])

  // Get unique years from all three datasets
  const years = React.useMemo(() => {
    const allDates = [
      ...data.map(item => item.date),
      ...c2ValeData.map(item => item.date),
      ...finalPreviousExpenses.map(item => item.date)
    ]
    return Array.from(new Set(allDates.map(date =>
      new Date(date).getFullYear().toString()
    ))).sort((a, b) => b.localeCompare(a)) // Sort descending
  }, [data, c2ValeData, finalPreviousExpenses])

  const filteredData = React.useMemo(() => {
    // Filter current payroll data
    const filteredCurrent = data.filter((item) => {
      const date = new Date(item.date)
      const matchesBranch = selectedBranch === "all" || item.branch === selectedBranch
      const matchesYear = date.getFullYear().toString() === selectedYear
      return matchesBranch && matchesYear
    });

    // Filter C2 Vale data
    const filteredC2Vale = c2ValeData.filter((item) => {
      const date = new Date(item.date)
      const matchesBranch = selectedBranch === "all" || item.branch === selectedBranch
      const matchesYear = date.getFullYear().toString() === selectedYear
      return matchesBranch && matchesYear
    });

    // Filter previous expenses data
    const filteredPrevious = finalPreviousExpenses.filter((item) => {
      const date = new Date(item.date)
      const matchesBranch = selectedBranch === "all" || item.branch === selectedBranch
      const matchesYear = date.getFullYear().toString() === selectedYear
      return matchesBranch && matchesYear
    });

    // Merge all three datasets by date
    const mergedData = new Map();

    // Add current payroll data
    filteredCurrent.forEach(item => {
      const dateKey = item.date;
      mergedData.set(dateKey, {
        date: dateKey,
        expenses: item.expenses,
        previousExpenses: 0,
        c2Vale: 0,
        branch: item.branch
      });
    });

    // Add previous expenses data
    filteredPrevious.forEach(item => {
      const dateKey = item.date;
      const existing = mergedData.get(dateKey);
      if (existing) {
        existing.previousExpenses = item.expenses; // Use expenses field from previous data
      } else {
        mergedData.set(dateKey, {
          date: dateKey,
          expenses: 0,
          previousExpenses: item.expenses,
          c2Vale: 0,
          branch: item.branch
        });
      }
    });

    // Add C2 Vale data
    filteredC2Vale.forEach(item => {
      const dateKey = item.date;
      const existing = mergedData.get(dateKey);
      if (existing) {
        existing.c2Vale = item.expenses;
      } else {
        mergedData.set(dateKey, {
          date: dateKey,
          expenses: 0,
          previousExpenses: 0,
          c2Vale: item.expenses,
          branch: item.branch
        });
      }
    });

    // Convert back to array and sort
    return Array.from(mergedData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, c2ValeData, finalPreviousExpenses, timeRange, selectedBranch, selectedYear])

  const branches = React.useMemo(() => {
    const allBranches = [
      ...data.map(item => item.branch),
      ...c2ValeData.map(item => item.branch),
      ...finalPreviousExpenses.map(item => item.branch)
    ]
    return Array.from(new Set(allBranches))
  }, [data, c2ValeData, finalPreviousExpenses])

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Payroll expenses comparison for the last {timeRange === "6m" ? "6" : timeRange === "3m" ? "3" : "1"} month(s)
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
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
                <stop
                  offset="5%"
                  stopColor={PRIMARY_COLOR}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={PRIMARY_COLOR}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPreviousExpenses" x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient id="fillC2Vale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={C2_VALE_COLOR}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={C2_VALE_COLOR}
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
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short"
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Intl.NumberFormat('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric"
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="previousExpenses"
              type="monotone"
              fill="url(#fillPreviousExpenses)"
              stroke={SECONDARY_COLOR}
              strokeDasharray="5 5"
            />
            <Area
              dataKey="c2Vale"
              type="monotone"
              fill="url(#fillC2Vale)"
              stroke={C2_VALE_COLOR}
              strokeDasharray="3 3"
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
  )
}
