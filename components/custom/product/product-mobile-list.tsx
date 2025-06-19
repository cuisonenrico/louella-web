"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Calendar } from "lucide-react";
import { Product } from "@/lib/types/product";
import { ProductMobileListSkeleton } from "./product-skeleton";
import { DeleteProductDialog } from "./delete-product-dialog";
import { AddProductDialog } from "./add-product-dialog";
import { Edit } from "lucide-react";

interface ProductMobileListProps {
  products: Product[];
  isLoading?: boolean;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, product: Partial<Product>) => Promise<void>;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function ProductMobileList({
  products,
  isLoading = false,
  onDelete,
  onEdit,
  isDeleting = false,
  isEditing = false,
}: ProductMobileListProps) {
  if (isLoading) {
    return <ProductMobileListSkeleton />;
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
    
    const hash = baker.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variants = ["default", "secondary", "outline"];
    return variants[Math.abs(hash) % variants.length] as "default" | "secondary" | "outline";
  };

  if (products.length === 0) {
    return (
      <div className="lg:hidden">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">No products found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-3">
      {products.map((product, index) => (
        <Card
          key={product.id}
          className="p-4 animate-in fade-in-0 duration-300"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
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
                  {product.baker && (
                    <Badge variant={getBakerBadgeVariant(product.baker)} className="text-xs">
                      {product.baker}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
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
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Cost
                </div>
                <div className="font-medium">
                  {formatCurrency(product.cost)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Sale Price
                </div>
                <div className="font-medium text-green-600">
                  {formatCurrency(product.sale_price)}
                </div>
              </div>
            </div>

            <div className="text-sm">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created
              </div>
              <div className="font-medium">
                {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
