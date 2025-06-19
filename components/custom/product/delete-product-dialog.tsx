"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { Product } from "@/lib/types/product";

interface DeleteProductDialogProps {
  product: Product;
  onDelete: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteProductDialog({
  product,
  onDelete,
  isDeleting = false,
}: DeleteProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(product.id);
    setIsOpen(false);
  };

  const formatCurrency = (value?: number | null) => {
    if (!value) return "Not set";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {product.name || "Unnamed Product"}
                </div>
                {product.cost && (
                  <div>
                    <strong>Cost:</strong> {formatCurrency(product.cost)}
                  </div>
                )}
                {product.sale_price && (
                  <div>
                    <strong>Sale Price:</strong> {formatCurrency(product.sale_price)}
                  </div>
                )}
                {product.baker && (
                  <div>
                    <strong>Baker:</strong> {product.baker}
                  </div>
                )}
                <div>
                  <strong>Created:</strong>{" "}
                  {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
