import { createClient } from "@/utils/supabase/client";
import { PayrollEntry } from "@/lib/types/payroll";

export class PayrollService {
  private supabase: any;

  constructor() {
    this.supabase = createClient();
  }

  async handlePayrollPeriod(branch: string, startDate: string, endDate: string): Promise<number> {
    try {
      // Check for existing period
      const { data: existingPeriod, error: fetchError } = await this.supabase
        .from("PayrollPeriod")
        .select("id")
        .match({ payroll_start: startDate, payroll_end: endDate, branch })
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (existingPeriod?.id) return existingPeriod.id;

      // Create new period
      const { data: newPeriod, error: insertError } = await this.supabase
        .from("PayrollPeriod")
        .insert({ payroll_start: startDate, payroll_end: endDate, branch })
        .select("id")
        .single();

      if (insertError) throw insertError;
      return newPeriod.id;
    } catch (error) {
      console.error("Payroll period error:", error);
      throw new Error("Failed to handle payroll period");
    }
  }

  async batchInsertEntries(entries: Omit<PayrollEntry, 'id'>[]): Promise<void> {
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE);
      const { error } = await this.supabase
        .from("PayrollEntry")
        .insert(batch);
      
      if (error) throw error;
    }
  }

  async uploadFile(file: File, fileName: string, branch: string, periodId: number): Promise<void> {
    // Upload to storage
    const { error: storageError } = await this.supabase.storage
      .from("payroll-files")
      .upload(fileName, file, { upsert: true });

    if (storageError) throw storageError;

    // Insert file record
    const { error: dbError } = await this.supabase
      .from("payroll_files")
      .insert({
        filename: fileName,
        branch,
        payroll_period_id: periodId,
        public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payroll-files/${fileName}`,
      });

    if (dbError) throw dbError;
  }

  async checkFileExists(fileName: string): Promise<boolean> {
    const { data } = await this.supabase.storage
      .from("payroll-files")
      .list("", { search: fileName });

    return data?.some((f: { name: string; }) => f.name === fileName) || false;
  }

  async getPayrollPeriod(periodId: number) {
    const { data, error } = await this.supabase
      .from("PayrollPeriod")
      .select("*")
      .eq("id", periodId)
      .single();

    if (error) throw error;
    return data;
  }

  async getPayrollEntries(periodId: number) {
    const { data, error } = await this.supabase
      .from("PayrollEntry")
      .select("*")
      .eq("payroll_period_id", periodId)
      .order("id");

    if (error) throw error;
    return data;
  }

  async deletePayrollPeriod(periodId: number): Promise<void> {
    // Delete entries first (due to foreign key constraint)
    const { error: entriesError } = await this.supabase
      .from("PayrollEntry")
      .delete()
      .eq("payroll_period_id", periodId);

    if (entriesError) throw entriesError;

    // Then delete the period
    const { error: periodError } = await this.supabase
      .from("PayrollPeriod")
      .delete()
      .eq("id", periodId);

    if (periodError) throw periodError;
  }
}