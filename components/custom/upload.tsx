"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { FaUpload } from "react-icons/fa";
import { PayrollFileProcessor } from "@/lib/payroll/file-processor";

export default function UploadPayrollFileButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileProcessor = useRef(new PayrollFileProcessor()).current;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const results = await fileProcessor.processFiles(files);

      // Show summary
      const successful = results.filter(r => r.status === 'success').length;
      const failed = results.filter(r => r.status === 'error').length;
      const failedFiles = results.filter(r => r.status === 'error');

      const message = [
        `Upload complete:`,
        `✅ ${successful} files uploaded successfully`,
        `❌ ${failed} files failed`,
        failed > 0 ? `\nFailed files:\n${failedFiles.map(r => `• ${r.file}: ${r.message}`).join('\n')}` : ''
      ].filter(Boolean).join('\n');

      alert(message);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }, [fileProcessor]);

  return (
    <>
      <input
        type="file"
        accept=".xlsx,.xls"
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        size={isMobile ? "icon" : "default"}
        className="mr-2"
        disabled={isUploading}
      >
        {isMobile ? <FaUpload /> : isUploading ? "Uploading..." : "Upload Payroll"}
      </Button>
    </>
  );
}