import { createClient } from "@/utils/supabase/client";

export class UploadService {
  private supabase = createClient();

  async uploadProductImage(file: File): Promise<string> {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Upload file to Supabase storage
      const { error } = await this.supabase.storage
        .from('payroll-files') // Using existing bucket
        .upload(filePath, file);

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Return the full URL using environment variable
      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_FILES_URL;
      return `${baseUrl}${fileName}`;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async deleteProductImage(imageUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_FILES_URL;
      if (!imageUrl.startsWith(baseUrl!)) return;

      const fileName = imageUrl.replace(baseUrl!, '');
      const filePath = `product-images/${fileName}`;

      const { error } = await this.supabase.storage
        .from('payroll-files')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
}

export const uploadService = new UploadService();
