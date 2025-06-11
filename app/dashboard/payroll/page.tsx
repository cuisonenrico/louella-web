import PayrollTable from "@/components/custom/payroll/payroll_table";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="@container/main w-full flex flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full">
          <PayrollTable />
        </div>
      </div>
    </div>
  );
}
