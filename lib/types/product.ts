export interface Product {
  id: number;
  created_at: string; // ISO date string (e.g., "2025-06-18T09:30:00Z")
  name?: string | null;
  cost?: number | null;
  sale_price?: number | null;
  baker?: string | null;
  img_url?: string | null;
}

export type CreateProductData = Omit<Product, 'id' | 'created_at'>;

export type UpdateProductData = Partial<CreateProductData>;

export interface ProductFilters {
  searchQuery: string;
  selectedBaker: string;
}
