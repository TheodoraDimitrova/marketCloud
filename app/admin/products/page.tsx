"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import TopBar from "@/components/admin/layout/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import type { AdminProduct } from "@/lib/types/adminProduct";
import type { Category } from "@/lib/types/category";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { PRODUCTS_QUERY } from "@/sanity/queries";
import { sanityProductToAdmin } from "@/lib/services/adminProducts";
import { projectId, dataset, apiVersion } from "@/sanity/env";

const CATEGORY_ALL = "all";
const STOCK_FILTER_ALL = "all";
const STOCK_FILTER_LOW = "low";
const LOW_STOCK_THRESHOLD = 10;

interface RawSanityProduct {
  _id?: string;
  category?: { _ref?: string; _id?: string; name?: string };
  [key: string]: unknown;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Pick<Category, "_id" | "name">[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>(CATEGORY_ALL);
  const [stockFilter, setStockFilter] = useState<string>(STOCK_FILTER_ALL);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const queryUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(PRODUCTS_QUERY)}`;
        const res = await fetch(queryUrl);
        if (!res.ok) throw new Error("Failed to fetch products");
        const result = await res.json();
        const raw = (result.result || []) as RawSanityProduct[];

        const categoryRefs = new Set<string>();
        raw.forEach((p) => {
          if (p.category?._ref) categoryRefs.add(p.category._ref);
        });

        const categoriesMap = new Map<string, { _id: string; name: string }>();
        if (categoryRefs.size > 0) {
          const categoryIds = Array.from(categoryRefs);
          const categoryQuery = `*[_id in $ids && !(_id in path("drafts.**"))] { _id, name }`;
          const categoryRes = await fetch(
            `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: categoryQuery, params: { ids: categoryIds } }),
            }
          );
          if (categoryRes.ok) {
            const categoryResult = await categoryRes.json();
            (categoryResult.result || []).forEach((cat: { _id: string; name: string }) => {
              categoriesMap.set(cat._id, cat);
            });
          }
        }

        const productsWithCategories = raw.map((p) => {
          const item = { ...p };
          if (item.category?._ref && categoriesMap.has(item.category._ref)) {
            item.category = categoriesMap.get(item.category._ref);
          }
          return item;
        });

        const seen = new Set<string>();
        const mapped: AdminProduct[] = [];
        for (const p of productsWithCategories) {
          if (!p._id || seen.has(p._id)) continue;
          seen.add(p._id);
          mapped.push(sanityProductToAdmin(p as Parameters<typeof sanityProductToAdmin>[0]));
        }

        const cats = Array.from(categoriesMap.values());
        if (!cancelled) {
          setProducts(mapped);
          setCategories(cats);
        }
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categoryFilter !== CATEGORY_ALL) {
      const category = categories.find((c) => c._id === categoryFilter);
      list = list.filter((p) => category && p.category === category.name);
    }
    if (stockFilter === STOCK_FILTER_LOW) {
      list = list.filter((p) => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD);
    }
    return list;
  }, [products, categories, categoryFilter, stockFilter]);

  if (loading) {
    return (
      <>
        <TopBar title="Products" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Loading products...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar title="Products" />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {`${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}${categoryFilter !== CATEGORY_ALL ? ` in ${categories.find(c => c._id === categoryFilter)?.name || ""}` : ""}${stockFilter === STOCK_FILTER_LOW ? " (low stock)" : ""}`}
          </p>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 bg-card">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value={CATEGORY_ALL}>All categories</SelectItem>
              {categories.map((cat) => (
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
                    {products.length === 0
                      ? "No products found."
                      : stockFilter === STOCK_FILTER_LOW
                        ? "No products with low stock."
                        : `No products in "${categories.find(c => c._id === categoryFilter)?.name || categoryFilter}".`}
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

export default AdminProductsPage;
