import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaFileExcel } from "react-icons/fa";

interface PayrollFile {
  id: string;
  filename: string;
}

interface PayrollFileListProps {
  files: PayrollFile[];
  selectedFile: string;
  onFileSelect: (filename: string) => void;
}

export function PayrollFileList({ files, selectedFile, onFileSelect }: PayrollFileListProps) {
  return (
    <Card className="w-full p-4">
      <div className="flex items-center gap-2 text-sidebar-primary font-semibold mb-4">
        <FaFileExcel />
        <span>Payroll Files</span>
      </div>
      
      <ScrollArea className="h-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {files.map((file) => (
            <Button
              key={file.id}
              variant="ghost"
              className={`w-full justify-start text-left font-normal ${
                selectedFile === file.filename 
                  ? 'bg-sidebar-accent text-sidebar-primary' 
                  : ''
              }`}
              onClick={() => onFileSelect(file.filename)}
            >
              <FaFileExcel className="mr-2 h-4 w-4" />
              <span className="truncate">{file.filename}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}