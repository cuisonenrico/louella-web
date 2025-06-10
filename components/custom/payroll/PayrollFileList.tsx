import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaFileExcel, FaFolder, FaFolderOpen, FaChevronRight, FaChevronDown } from "react-icons/fa";
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

export function PayrollFileList({ files, selectedFile, onFileSelect }: PayrollFileListProps) {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());
  const groupedFiles = groupFilesByDate(files);
  
  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
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
    setExpandedMonths(prev => {
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
    setExpandedBranches(prev => {
      const next = new Set(prev);
      if (next.has(branchKey)) {
        next.delete(branchKey);
      } else {
        next.add(branchKey);
      }
      return next;
    });
  };

  return (
    <Card className="w-full p-4">
      <div className="flex items-center gap-2 text-sidebar-primary font-semibold mb-4">
        <FaFileExcel />
        <span>Payroll Files</span>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="flex flex-col gap-2">
          {Array.from(groupedFiles.entries()).sort(([a], [b]) => b.localeCompare(a)).map(([year, months]) => (
            <div key={year} className="flex flex-col gap-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-semibold p-2"
                onClick={() => toggleYear(year)}
              >
                {expandedYears.has(year) ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                <FaFolder className="mr-2" />
                <span>{year}</span>
              </Button>
              
              {expandedYears.has(year) && (
                <div className="ml-4 flex flex-col gap-1">
                  {Array.from(months.entries()).sort(([a], [b]) => b.localeCompare(a)).map(([month, branches]) => (
                    <div key={`${year}-${month}`} className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left font-normal p-2"
                        onClick={() => toggleMonth(year, month)}
                      >
                        {expandedMonths.has(`${year}-${month}`) ? 
                          <FaChevronDown className="mr-2" /> : 
                          <FaChevronRight className="mr-2" />
                        }
                        <FaFolder className="mr-2" />
                        <span>{month}</span>
                      </Button>
                      
                      {expandedMonths.has(`${year}-${month}`) && (
                        <div className="ml-4 flex flex-col gap-1">
                          {Array.from(branches.entries()).map(([branch, branchFiles]) => (
                            <div key={`${year}-${month}-${branch}`} className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-left font-normal p-2"
                                onClick={() => toggleBranch(year, month, branch)}
                              >
                                {expandedBranches.has(`${year}-${month}-${branch}`) ? 
                                  <FaChevronDown className="mr-2" /> : 
                                  <FaChevronRight className="mr-2" />
                                }
                                <FaFolder className="mr-2" />
                                <span className="capitalize">{branch}</span>
                              </Button>
                              
                              {expandedBranches.has(`${year}-${month}-${branch}`) && (
                                <div className="ml-4 flex flex-col gap-1">
                                  {branchFiles.map((file) => (
                                    <Button
                                      key={file.id}
                                      variant="ghost"
                                      className={`w-full justify-start text-left font-normal p-2 ${
                                        selectedFile === file.filename 
                                          ? 'bg-sidebar-accent text-sidebar-primary' 
                                          : ''
                                      }`}
                                      onClick={() => onFileSelect(file)}
                                    >
                                      <FaFileExcel className="mr-2" />
                                      <span className="truncate">{formatPayrollFileName(file.filename)}</span>
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}