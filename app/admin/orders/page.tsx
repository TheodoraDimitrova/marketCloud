"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/layout/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import type { AdminOrderListItem } from "@/lib/types/adminOrder";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Search, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/admin/ui/button";

const AdminOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      setError(null);
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchOrders(false);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      (o.orderNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.email || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      o.paymentStatus === statusFilter ||
      o.fulfillmentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <TopBar title="Orders" />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/admin/orders/new")}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order #, customer, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 bg-card">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order #</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Payment method</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fulfillment</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">#{order.orderNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                      <td className="px-4 py-3 text-foreground">{order.customer}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">{order.total.toFixed(2)} EUR</td>
                      <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod === "card"
                            ? "Card"
                            : order.paymentMethod || "—"}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={order.fulfillmentStatus} /></td>
                      <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{order.tracking || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default AdminOrdersPage;
