"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TopBar from "@/components/admin/layout/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import type { AdminOrderListItem } from "@/lib/types/adminOrder";
import type { AdminProduct } from "@/lib/types/adminProduct";
import { ShoppingCart, AlertTriangle, Euro, Calendar, Loader2 } from "lucide-react";
import { PRODUCTS_QUERY } from "@/sanity/queries";
import { sanityProductToAdmin } from "@/lib/services/adminProducts";
import { projectId, dataset, apiVersion } from "@/sanity/env";

const LOW_STOCK_THRESHOLD = 10;

/** True if order was created on the same local calendar day as now */
const isTodayLocal = (createdAt: string | undefined) => {
  if (!createdAt) return false;
  const orderDate = new Date(createdAt);
  const now = new Date();
  return (
    orderDate.getFullYear() === now.getFullYear() &&
    orderDate.getMonth() === now.getMonth() &&
    orderDate.getDate() === now.getDate()
  );
};
/** True if order was created in the same local calendar month as now */
const isThisLocalMonth = (createdAt: string | undefined) => {
  if (!createdAt) return false;
  const orderDate = new Date(createdAt);
  const now = new Date();
  return orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === now.getMonth();
};

const AdminDashboardPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setOrders(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOrders();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      try {
        const queryUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(PRODUCTS_QUERY)}`;
        const res = await fetch(queryUrl);
        if (!res.ok) throw new Error("Failed to fetch products");
        const result = await res.json();
        const raw = result.result || [];

        const categoryRefs = new Set<string>();
        raw.forEach((p: Record<string, unknown> & { category?: { _ref?: string } }) => {
          if (p.category?._ref) {
            categoryRefs.add(p.category._ref);
          }
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
              body: JSON.stringify({
                query: categoryQuery,
                params: { ids: categoryIds },
              }),
            }
          );
          if (categoryRes.ok) {
            const categoryResult = await categoryRes.json();
            (categoryResult.result || []).forEach((cat: { _id: string; name: string }) => {
              categoriesMap.set(cat._id, cat);
            });
          }
        }

        const productsWithCategories = raw.map(
          (p: Record<string, unknown> & { category?: { _ref?: string }; _id?: string }) => {
            const item = { ...p } as Record<string, unknown> & {
              category?: { _ref?: string; _id?: string; name?: string };
              _id?: string;
            };
            if (item.category?._ref && categoriesMap.has(item.category._ref)) {
              item.category = categoriesMap.get(item.category._ref);
            }
            return item;
          }
        );

        const seen = new Set<string>();
        const mapped: AdminProduct[] = [];
        for (const p of productsWithCategories) {
          const doc = p as { _id?: string };
          if (!doc._id) continue;
          if (seen.has(doc._id)) continue;
          seen.add(doc._id);
          mapped.push(sanityProductToAdmin(p as Parameters<typeof sanityProductToAdmin>[0]));
        }

        if (!cancelled) {
          const byId = new Map<string, AdminProduct>();
          mapped.forEach((p) => { if (p.id && !byId.has(p.id)) byId.set(p.id, p); });
          setProducts(Array.from(byId.values()));
        }
      } catch {
        // ignore
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  const todayOrders = orders.filter((o) => isTodayLocal(o.createdAt));
  const ordersThisMonth = orders.filter((o) => isThisLocalMonth(o.createdAt));
  const lowStock = products.filter((p) => (p.stock ?? 0) < LOW_STOCK_THRESHOLD);
  const revenueThisMonth = orders
    .filter((o) => isThisLocalMonth(o.createdAt) && o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + Number(o.total), 0);
  // Orders needing attention:
  // 1. Orders without tracking number (regardless of payment status) - priority - "Needs Tracking"
  // 2. Unpaid orders with tracking number - "Needs Payment"
  const ordersNeedingAttention = orders
    .filter((o) => {
      const hasNoTracking = !o.tracking || (typeof o.tracking === "string" && o.tracking.trim() === "");
      const isUnpaid = o.paymentStatus === "Unpaid";
      // Include: all orders without tracking OR unpaid orders with tracking
      return hasNoTracking || isUnpaid;
    })
    .sort((a, b) => {
      // Sort: tracking first, then payment
      const aHasNoTracking = !a.tracking || (typeof a.tracking === "string" && a.tracking.trim() === "");
      const bHasNoTracking = !b.tracking || (typeof b.tracking === "string" && b.tracking.trim() === "");
      const aNeedsPayment = a.paymentStatus === "Unpaid" && !aHasNoTracking; // unpaid WITH tracking
      const bNeedsPayment = b.paymentStatus === "Unpaid" && !bHasNoTracking; // unpaid WITH tracking
      
      // Orders without tracking come first (regardless of payment status)
      if (aHasNoTracking && !bHasNoTracking) return -1;
      if (!aHasNoTracking && bHasNoTracking) return 1;
      
      // Then unpaid orders with tracking (needs payment)
      if (aNeedsPayment && !bNeedsPayment) return -1;
      if (!aNeedsPayment && bNeedsPayment) return 1;
      
      // Otherwise sort by date (newest first)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const alertCards = [
    {
      icon: ShoppingCart,
      label: "New orders today",
      value: todayOrders.length,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      icon: Calendar,
      label: "Orders this month",
      value: ordersThisMonth.length,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      icon: AlertTriangle,
      label: "Low stock",
      value: lowStock.length,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      icon: Euro,
      label: "Revenue this month",
      value: `${revenueThisMonth.toFixed(2)} EUR`,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  if (loading) {
    return (
      <>
        <TopBar title="Dashboard" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {alertCards.map((card) => (
            <div
              key={card.label}
              className="bg-card rounded-lg border border-border p-5 flex items-start gap-4"
            >
              <div className={`p-2.5 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Orders needing attention ({ordersNeedingAttention.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Orders without tracking number or unpaid orders
            </p>
          </div>
          <div className="divide-y divide-border">
            {ordersNeedingAttention.length === 0 ? (
              <p className="px-5 py-4 text-sm text-muted-foreground">No orders needing attention.</p>
            ) : (
              ordersNeedingAttention.map((order) => {
                // Check tracking first (orders without tracking, regardless of payment status)
                const needsTracking = !order.tracking || (typeof order.tracking === "string" && order.tracking.trim() === "");
                // Then check payment (unpaid orders WITH tracking)
                const needsPayment = order.paymentStatus === "Unpaid" && !needsTracking;
                
                return (
                  <div
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="px-5 py-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">#{order.orderNumber}</span>
                      <span className="text-sm text-muted-foreground">{order.customer}</span>
                      {needsTracking && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                          Needs Tracking
                        </span>
                      )}
                      {needsPayment && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded font-medium">
                          Needs Payment
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.paymentStatus} />
                      <StatusBadge status={order.fulfillmentStatus} />
                      <span className="text-sm font-medium text-foreground">{order.total.toFixed(2)} EUR</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {lowStock.length > 0 && (
          <div className="bg-card rounded-lg border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">⚠️ Low stock</h2>
            </div>
            <div className="divide-y divide-border">
              {lowStock.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    {item.sku && <span className="text-xs text-muted-foreground ml-2">{item.sku}</span>}
                  </div>
                  <span className="text-sm font-semibold text-destructive">{(item.stock ?? 0)} pcs</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AdminDashboardPage;
