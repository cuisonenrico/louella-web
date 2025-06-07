"use client";

import PayrollTable from "@/components/custom/payroll_table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as XLSX from 'xlsx';

export default function Page() {
    const [data, setData] = useState<any[]>([]);

    // Function to handle the file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });

            // Read first sheet
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];

            // Convert sheet to JSON
            const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }); // header: 1 gives array of arrays
            // Remove the first 4 indexes (rows)
            const trimmedData = (jsonData as any[][]).slice(4).slice(4, (jsonData as any[][]).length - 13);;
            setData(trimmedData);
        };

        reader.readAsArrayBuffer(file);
    };
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {/* Inventory content goes here */}
                    {/* <h1 className="text-xl font-bold">Inventory Page</h1>
                    <p>This is the inventory page content.</p>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        style={{ display: "none" }}
                        id="inventory-file-input"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="inventory-file-input">
                        <Button asChild>
                            <span>Upload Inventory File</span>
                        </Button>
                    </label> */}
                    <PayrollTable />
                </div>
            </div>
        </div>
    )
}
