"use client";

import { PayrollList } from "./payroll_list";

const staticHeaders = [
  "#",
  "Employee",
  "Days Worked",
  "Monthly rate",
  "Daily rate",
  "Basic rate",
  "Overtime Hrs",
  "Overtime Amount",
  "Holiday No.",
  "Holiday Pay",
  "Special No.",
  "Special Pay",
  "Rest Day No.",
  "Rest day Pay",
  "No.of NS Hours",
  "NSD Pay",
  "GROSS Pay",
  "SSS",
  "PhilHealth",
  "Pag-Ibig",
  "SSSLoan",
  "C.A.",
  "Hidden",
  "Net Salary",
];

export default function PayrollTable() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-0">
          <PayrollList staticHeaders={staticHeaders} />
        </div>
      </div>
    </div>
  );
}