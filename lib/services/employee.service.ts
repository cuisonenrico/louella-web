import { createClient } from "@/utils/supabase/client";
import { Employee, CreateEmployeeData, UpdateEmployeeData } from "@/lib/types/employee";

export class EmployeeService {
  private supabase = createClient();

  async fetchEmployees(): Promise<Employee[]> {
    const { data, error } = await this.supabase
      .from("employee")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch employees: ${error.message}`);
    }

    return data || [];
  }

  async createEmployee(employeeData: CreateEmployeeData): Promise<Employee> {
    const { data, error } = await this.supabase
      .from("employee")
      .insert([employeeData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create employee: ${error.message}`);
    }

    return data;
  }

  async updateEmployee(id: string, employeeData: UpdateEmployeeData): Promise<Employee> {
    const { data, error } = await this.supabase
      .from("employee")
      .update(employeeData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update employee: ${error.message}`);
    }

    return data;
  }

  async deleteEmployee(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("employee")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  }
}

export const employeeService = new EmployeeService();
