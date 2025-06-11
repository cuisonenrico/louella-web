"use client";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/shadcn/site-header";
import UploadPayrollFileButton from "./payroll/upload";

export default function DynamicSiteHeader() {
  const pathname = usePathname();
  const formatted =
    pathname
      .split("/")
      .filter(Boolean)
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" / ") || "Dashboard";

  // Check if current path is /dashboard/payroll
  const isPayrollPage = pathname === "/dashboard/payroll";

  return (
    <div className="flex items-center justify-left w-full">
      <SiteHeader siteHeader={formatted} />
      {isPayrollPage && (
        <div className="ml-4">
          <UploadPayrollFileButton />
        </div>
      )}
    </div>
  );
}
