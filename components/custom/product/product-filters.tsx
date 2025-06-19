"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Plus } from "lucide-react";
import { ProductFilters } from "@/lib/types/product";
import { AddProductDialog } from "./add-product-dialog";
import { CreateProductData } from "@/lib/types/product";

interface ProductFiltersComponentProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onAddProduct: (product: CreateProductData) => Promise<void>;
  isSubmitting?: boolean;
  availableBakers: string[];
}

export function ProductFiltersComponent({
  filters,
  onFiltersChange,
  onAddProduct,
  isSubmitting = false,
  availableBakers,
}: ProductFiltersComponentProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleBakerChange = (value: string) => {
    onFiltersChange({ ...filters, selectedBaker: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      selectedBaker: "all",
    });
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Stack everything vertically */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select value={filters.selectedBaker} onValueChange={handleBakerChange}>
            <SelectTrigger>
              <SelectValue placeholder="Baker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bakers</SelectItem>
              {availableBakers.map((baker) => (
                <SelectItem key={baker} value={baker}>
                  {baker}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={clearFilters} variant="outline" size="sm">
            Clear
          </Button>
        </div>

        <div className="flex gap-2">
          <AddProductDialog
            mode="add"
            onAddProduct={onAddProduct}
            isSubmitting={isSubmitting}
            trigger={
              <Button className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            }
          />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop: Original horizontal layout */}
      <div className="hidden sm:flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={filters.selectedBaker} onValueChange={handleBakerChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Baker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bakers</SelectItem>
              {availableBakers.map((baker) => (
                <SelectItem key={baker} value={baker}>
                  {baker}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={clearFilters} variant="outline" size="sm">
            Clear
          </Button>

          <AddProductDialog
            mode="add"
            onAddProduct={onAddProduct}
            isSubmitting={isSubmitting}
          />

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
