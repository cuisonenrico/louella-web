"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, ProductFilters, CreateProductData } from "@/lib/types/product";
import { productService } from "@/lib/services/product.service";
import { ProductFiltersComponent } from "@/components/custom/product/product-filters";
import { ProductTable } from "@/components/custom/product/product-table";
import { ProductMobileList } from "@/components/custom/product/product-mobile-list";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    searchQuery: "",
    selectedBaker: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 10;

  // Debounce search queries to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);
  const debouncedBakerFilter = useDebounce(filters.selectedBaker, 300);

  // Fetch products from Supabase on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productService.fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle filter changes with loading animation
  useEffect(() => {
    if (!isLoading) {
      setIsFiltering(true);
      setCurrentPage(1); // Reset to first page when filtering

      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [debouncedSearchQuery, debouncedBakerFilter, isLoading]);

  // Filter products using debounced values
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        debouncedSearchQuery === "" ||
        product.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.baker?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesBaker =
        debouncedBakerFilter === "all" ||
        debouncedBakerFilter === "" ||
        product.baker?.toLowerCase() === debouncedBakerFilter.toLowerCase();

      return matchesSearch && matchesBaker;
    });
  }, [products, debouncedSearchQuery, debouncedBakerFilter]);

  // Get available bakers for filter dropdown
  const availableBakers = useMemo(() => {
    const bakers = products
      .map(product => product.baker)
      .filter((baker): baker is string => !!baker)
      .filter((baker, index, array) => array.indexOf(baker) === index)
      .sort();
    return bakers;
  }, [products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const hasFilters =
    filters.selectedBaker !== "all" || !!filters.searchQuery;

  const showLoading = isLoading || isFiltering;

  // CRUD handlers
  const handleAddProduct = async (productData: CreateProductData) => {
    setIsSubmitting(true);

    try {
      const newProduct = await productService.createProduct(productData);
      setProducts([newProduct, ...products]);
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (
    id: number,
    productData: Partial<Product>
  ) => {
    setIsEditing(true);

    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(
        products.map((product) =>
          product.id === id ? updatedProduct : product
        )
      );
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setIsDeleting(true);

    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination handlers
  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getFilterDisplayText = () => {
    const parts = [];
    
    if (filters.searchQuery) {
      parts.push(`"${filters.searchQuery}"`);
    }
    
    if (filters.selectedBaker !== "all") {
      parts.push(`baker: ${filters.selectedBaker}`);
    }
    
    return parts.length > 0 ? parts.join(" and ") : "all products";
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 p-6">
        <Card className="@container/card">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Product Management
                </CardTitle>
                <CardDescription>
                  Manage your bakery products and inventory
                </CardDescription>
              </div>
            </div>

            <div className="mt-6">
              <ProductFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onAddProduct={handleAddProduct}
                isSubmitting={isSubmitting}
                availableBakers={availableBakers}
              />
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Badge variant="secondary" className="text-sm w-fit">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  for {getFilterDisplayText()}
                </span>
                {filteredProducts.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
                    {filteredProducts.length}
                  </span>
                )}
              </div>

              {/* Items per page selector - Hide on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={() => {}} // Static for now
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <ProductMobileList
              products={currentEntries}
              isLoading={showLoading}
              onDelete={handleDeleteProduct}
              onEdit={handleEditProduct}
              isDeleting={isDeleting}
              isEditing={isEditing}
            />

            <ProductTable
              products={currentEntries}
              isLoading={showLoading}
              onDelete={handleDeleteProduct}
              onEdit={handleEditProduct}
              isDeleting={isDeleting}
              isEditing={isEditing}
            />

            {/* Pagination */}
            {filteredProducts.length > 0 && totalPages > 1 && (
              <div className="mt-4 pt-4 border-t">
                {/* Mobile pagination */}
                <div className="flex sm:hidden items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    className="h-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="h-8"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousPage}
                      disabled={currentPage === 1}
                      className="h-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNumber: number;
                        if (totalPages <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 2) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNumber = totalPages - 2 + i;
                        } else {
                          pageNumber = currentPage - 1 + i;
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={
                              currentPage === pageNumber ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => goToPage(pageNumber)}
                            className="h-8 w-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}

                      {totalPages > 3 && currentPage < totalPages - 1 && (
                        <>
                          <span className="text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(totalPages)}
                            className="h-8 w-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="h-8"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {filteredProducts.length === 0 && !showLoading && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No products found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search criteria or add a new product.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
