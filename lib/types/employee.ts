export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string; // ISO format e.g., "1990-01-01"
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  created_at?: string;
  updated_at?: string;
}

// Use type alias instead of empty interface
export type CreateEmployeeData = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;

// Use type alias instead of empty interface
export type UpdateEmployeeData = Partial<CreateEmployeeData>;

export interface EmployeeFilters {
  searchQuery: string;
  selectedGender: string;
}
