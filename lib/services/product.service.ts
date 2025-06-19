import { createClient } from "@/utils/supabase/client";
import { Product, CreateProductData, UpdateProductData } from "@/lib/types/product";

export class ProductService {
  private supabase = createClient();

  async fetchProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data || [];
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data;
  }

  async updateProduct(id: number, productData: UpdateProductData): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data;
  }

  async deleteProduct(id: number): Promise<void> {
    const { error } = await this.supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

export const productService = new ProductService();
