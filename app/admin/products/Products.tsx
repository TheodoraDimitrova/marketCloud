"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import TopBar from "@/components/admin/layout/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import type { AdminProduct } from "@/lib/types/adminProduct";
import type { Category } from "@/lib/types/category";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";

const CATEGORY_ALL = "all";
const STOCK_FILTER_ALL = "all";
const STOCK_FILTER_LOW = "low";
const LOW_STOCK_THRESHOLD = 10;

interface ProductsProps {
  initialProducts: AdminProduct[];
  initialCategories: Pick<Category, "_id" | "name">[];
}

const Products = ({ initialProducts, initialCategories }: ProductsProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>(CATEGORY_ALL);
  const [stockFilter, setStockFilter] = useState<string>(STOCK_FILTER_ALL);

  const filteredProducts = useMemo(() => {
    let list = initialProducts;
    if (categoryFilter !== CATEGORY_ALL) {
      const category = initialCategories.find((c) => c._id === categoryFilter);
      list = list.filter((p) => category && p.category === category.name);
    }
    if (stockFilter === STOCK_FILTER_LOW) {
      list = list.filter((p) => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD);
    }
    return list;
  }, [initialProducts, initialCategories, categoryFilter, stockFilter]);

  return (
    <>
      <TopBar title="Products" />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {`${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}${categoryFilter !== CATEGORY_ALL ? ` in ${initialCategories.find(c => c._id === categoryFilter)?.name || ""}` : ""}${stockFilter === STOCK_FILTER_LOW ? " (low stock)" : ""}`}
          </p>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 bg-card">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value={CATEGORY_ALL}>All categories</SelectItem>
              {initialCategories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value={STOCK_FILTER_ALL}>All stock</SelectItem>
              <SelectItem value={STOCK_FILTER_LOW}>Low stock (≤{LOW_STOCK_THRESHOLD})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-24"></th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Stock</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      {initialProducts.length === 0
                        ? "No products found."
                        : stockFilter === STOCK_FILTER_LOW
                          ? "No products with low stock."
                          : `No products in "${initialCategories.find(c => c._id === categoryFilter)?.name || categoryFilter}".`}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-muted rounded flex items-center justify-center text-muted-foreground text-2xl">
                            📦
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{product.name}</span>
                        {product.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{product.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{product.category || "—"}</td>
                      <td className={`px-4 py-3 text-right font-medium ${(product.stock ?? 0) <= 0 ? "text-destructive" : "text-foreground"}`}>
                        {product.stock !== undefined ? product.stock : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">{product.price.toFixed(2)} EUR</td>
                      <td className="px-4 py-3"><StatusBadge status={product.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </main>
    </>
  );
};

export default Products;
