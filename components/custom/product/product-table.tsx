"use client";

import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Product } from "@/lib/types/product";
import { ProductTableSkeleton } from "./product-skeleton";
import { DeleteProductDialog } from "./delete-product-dialog";
import { AddProductDialog } from "./add-product-dialog";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, product: Partial<Product>) => Promise<void>;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function ProductTable({
  products,
  isLoading = false,
  onDelete,
  onEdit,
  isDeleting = false,
  isEditing = false,
}: ProductTableProps) {
  if (isLoading) {
    return <ProductTableSkeleton />;
  }

  const formatCurrency = (value?: number | null) => {
    if (!value) return "Not set";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  const getBakerBadgeVariant = (baker?: string | null) => {
    if (!baker) return "outline";
    
    // You can customize colors based on baker names
    const hash = baker.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variants = ["default", "secondary", "outline"];
    return variants[Math.abs(hash) % variants.length] as "default" | "secondary" | "outline";
  };

  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Product
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Cost
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Sale Price
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-left whitespace-nowrap">
                Baker
              </th>
              <th className="border-b border-primary-foreground/20 px-4 py-3 text-xs font-bold text-center whitespace-nowrap w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-muted/50 transition-colors border-b border-border/50 animate-in fade-in-0 duration-300"
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      {product.img_url ? (
                        <img
                          src={product.img_url}
                          alt={product.name || "Product"}
                          className="h-12 w-12 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="hidden h-12 w-12 rounded bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {product.name || "Unnamed Product"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(product.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatCurrency(product.cost)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(product.sale_price)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {product.baker ? (
                      <Badge variant={getBakerBadgeVariant(product.baker)} className="text-xs">
                        {product.baker}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <AddProductDialog
                        mode="edit"
                        product={product}
                        onEditProduct={onEdit}
                        isSubmitting={isEditing}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                            disabled={isEditing || isDeleting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DeleteProductDialog
                        product={product}
                        onDelete={onDelete}
                        isDeleting={isDeleting}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground animate-in fade-in-0 duration-300"
                >
                  No products found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
