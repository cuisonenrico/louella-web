import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  FolderIcon,
  FileTextIcon,
  CalendarIcon,
  BuildingIcon,
} from "lucide-react";
import { groupFilesByDate } from "@/lib/utils/file-utils";
import { formatPayrollFileName } from "@/lib/utils/format_utils";

export interface PayrollFile {
  id: string;
  filename: string;
  created_at: string;
  public_url: string;
  branch: string;
  payroll_period_id?: number; // Optional, used for files with payroll data
}

interface PayrollFileListProps {
  files: PayrollFile[];
  selectedFile: string;
  onFileSelect: (file: PayrollFile) => void;
}

export function PayrollFileList({
  files,
  selectedFile,
  onFileSelect,
}: PayrollFileListProps) {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(
    new Set()
  );
  const groupedFiles = groupFilesByDate(files);

  // Month order for sorting (January first)
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const toggleMonth = (year: string, month: string) => {
    const monthKey = `${year}-${month}`;
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthKey)) {
        next.delete(monthKey);
      } else {
        next.add(monthKey);
      }
      return next;
    });
  };

  const toggleBranch = (year: string, month: string, branch: string) => {
    const branchKey = `${year}-${month}-${branch}`;
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(branchKey)) {
        next.delete(branchKey);
      } else {
        next.add(branchKey);
      }
      return next;
    });
  };

  const totalFiles = files.length;
  const branches = new Set(files.map((file) => file.branch)).size;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileTextIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Payroll Files</CardTitle>
              <CardDescription>
                Browse and select payroll files by date and branch
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileTextIcon className="h-3 w-3" />
              {totalFiles} Files
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BuildingIcon className="h-3 w-3" />
              {branches} Branches
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8">
            <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No files found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload payroll files to get started.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {Array.from(groupedFiles.entries())
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([year, months]) => (
                  <div key={year} className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-muted/50"
                      onClick={() => toggleYear(year)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {expandedYears.has(year) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{year}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {Array.from(months.values()).reduce(
                            (acc, branches) =>
                              acc +
                              Array.from(branches.values()).reduce(
                                (sum, files) => sum + files.length,
                                0
                              ),
                            0
                          )}{" "}
                          files
                        </Badge>
                      </div>
                    </Button>

                    {expandedYears.has(year) && (
                      <div className="ml-6 space-y-1">
                        {Array.from(months.entries())
                          .sort(([a], [b]) => {
                            const aIndex = monthOrder.indexOf(a);
                            const bIndex = monthOrder.indexOf(b);
                            return aIndex - bIndex;
                          })
                          .map(([month, branches]) => (
                            <div key={`${year}-${month}`} className="space-y-1">
                              <Button
                                variant="ghost"
                                className="w-full justify-start h-auto p-2 text-sm hover:bg-muted/30"
                                onClick={() => toggleMonth(year, month)}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  {expandedMonths.has(`${year}-${month}`) ? (
                                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                  )}
                                  <FolderIcon className="h-3 w-3 text-orange-500" />
                                  <span className="font-medium">{month}</span>
                                  <Badge
                                    variant="outline"
                                    className="ml-auto text-xs"
                                  >
                                    {Array.from(branches.values()).reduce(
                                      (sum, files) => sum + files.length,
                                      0
                                    )}{" "}
                                    files
                                  </Badge>
                                </div>
                              </Button>

                              {expandedMonths.has(`${year}-${month}`) && (
                                <div className="ml-6 space-y-1">
                                  {Array.from(branches.entries()).map(
                                    ([branch, branchFiles]) => (
                                      <div
                                        key={`${year}-${month}-${branch}`}
                                        className="space-y-1"
                                      >
                                        <Button
                                          variant="ghost"
                                          className="w-full justify-start h-auto p-2 text-sm hover:bg-muted/20"
                                          onClick={() =>
                                            toggleBranch(year, month, branch)
                                          }
                                        >
                                          <div className="flex items-center gap-2 w-full">
                                            {expandedBranches.has(
                                              `${year}-${month}-${branch}`
                                            ) ? (
                                              <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                            )}
                                            <BuildingIcon className="h-3 w-3 text-blue-500" />
                                            <span className="capitalize font-medium">
                                              {branch}
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="ml-auto text-xs"
                                            >
                                              {branchFiles.length}
                                            </Badge>
                                          </div>
                                        </Button>

                                        {expandedBranches.has(
                                          `${year}-${month}-${branch}`
                                        ) && (
                                          <div className="ml-6 space-y-1">
                                            {branchFiles.map((file) => (
                                              <Button
                                                key={file.id}
                                                variant="ghost"
                                                className={`w-full justify-start h-auto p-2 text-sm transition-all ${
                                                  selectedFile === file.filename
                                                    ? "bg-primary/10 text-primary border border-primary/20"
                                                    : "hover:bg-muted/10"
                                                }`}
                                                onClick={() =>
                                                  onFileSelect(file)
                                                }
                                              >
                                                <div className="flex items-center gap-2 w-full">
                                                  <FileTextIcon className="h-3 w-3 text-green-600" />
                                                  <span className="truncate text-left">
                                                    {formatPayrollFileName(
                                                      file.filename
                                                    )}
                                                  </span>
                                                  {selectedFile ===
                                                    file.filename && (
                                                    <Badge
                                                      variant="default"
                                                      className="ml-auto text-xs"
                                                    >
                                                      Selected
                                                    </Badge>
                                                  )}
                                                </div>
                                              </Button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {expandedYears.has(year) &&
                      year !==
                        Array.from(groupedFiles.keys()).sort().reverse()[0] && (
                        <Separator className="my-2" />
                      )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
