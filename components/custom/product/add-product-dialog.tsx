"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Loader2 } from "lucide-react";
import { Product, CreateProductData } from "@/lib/types/product";
import { ImageUpload } from "./image-upload";

interface AddProductDialogProps {
  mode?: "add" | "edit";
  product?: Product;
  onAddProduct?: (product: CreateProductData) => Promise<void>;
  onEditProduct?: (id: number, product: Partial<Product>) => Promise<void>;
  isSubmitting?: boolean;
  trigger?: React.ReactNode;
}

export function AddProductDialog({
  mode = "add",
  product,
  onAddProduct,
  onEditProduct,
  isSubmitting = false,
  trigger,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    cost: null,
    sale_price: null,
    baker: "",
    img_url: "",
  });

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && product) {
        setFormData({
          name: product.name || "",
          cost: product.cost,
          sale_price: product.sale_price,
          baker: product.baker || "",
          img_url: product.img_url || "",
        });
      } else {
        setFormData({
          name: "",
          cost: null,
          sale_price: null,
          baker: "",
          img_url: "",
        });
      }
    }
  }, [open, mode, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        cost: formData.cost || null,
        sale_price: formData.sale_price || null,
        baker: formData.baker || null,
        img_url: formData.img_url || null,
      };

      if (mode === "edit" && product && onEditProduct) {
        await onEditProduct(product.id, submitData);
      } else if (mode === "add" && onAddProduct) {
        await onAddProduct(submitData);
      }
      setOpen(false);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, img_url: url });
  };

  const isFormValid = formData.name?.trim();

  const defaultTrigger = (
    <Button size="sm">
      {mode === "edit" ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
      {mode === "edit" ? "" : "Add Product"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the product information below."
              : "Enter the product information below to add it to the system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (₱)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost || ""}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      cost: e.target.value ? parseFloat(e.target.value) : null 
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale_price">Sale Price (₱)</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sale_price || ""}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      sale_price: e.target.value ? parseFloat(e.target.value) : null 
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baker">Baker</Label>
              <Input
                id="baker"
                value={formData.baker || ""}
                onChange={(e) =>
                  setFormData({ ...formData, baker: e.target.value })
                }
                placeholder="Enter baker name"
              />
            </div>

            <div className="space-y-2">
              <ImageUpload
                value={formData.img_url || ""}
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Adding..."}
                </>
              ) : (
                mode === "edit" ? "Update" : "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
