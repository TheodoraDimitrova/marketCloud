"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/admin/layout/TopBar";
import { Button } from "@/components/admin/ui/button";
import { Download } from "lucide-react";
import type { AdminOrderListItem } from "@/lib/types/adminOrder";

const AdminReportsPage = () => {
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data: AdminOrderListItem[] = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const aov = paidOrders.length > 0 ? revenue / paidOrders.length : 0;
  // Treat cancelled orders as returns for now
  const returns = orders.filter((o) => o.fulfillmentStatus === "Cancelled").length;

  const customerStats: Record<
    string,
    { name: string; total: number; orders: number }
  > = {};

  orders.forEach((o) => {
    if (!o.email) return;
    if (!customerStats[o.email]) {
      customerStats[o.email] = {
        name: o.customer || o.email,
        total: 0,
        orders: 0,
      };
    }
    customerStats[o.email].total += o.total;
    customerStats[o.email].orders += 1;
  });

  const topCustomers = Object.values(customerStats)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <>
      <TopBar title="Reports" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex-between">
          <h2 className="text-sm font-semibold text-foreground">Overview</h2>
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading reports…</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Revenue", value: `${revenue.toFixed(2)} EUR` },
                { label: "Orders", value: paidOrders.length },
                { label: "AOV", value: `${aov.toFixed(2)} EUR` },
                { label: "Returns", value: returns },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-lg border border-border p-5"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg border border-border">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Top customers
                </h3>
              </div>
              <div className="divide-y divide-border">
                {topCustomers.length === 0 ? (
                  <p className="px-5 py-3 text-sm text-muted-foreground">
                    No orders yet.
                  </p>
                ) : (
                  topCustomers.map((c, i) => (
                    <div key={c.name + i} className="px-5 py-3 flex-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-5">
                          {i + 1}.
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {c.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">
                          {c.total.toFixed(2)} EUR
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.orders} orders
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default AdminReportsPage;
