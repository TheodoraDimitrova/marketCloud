"use client";

import TopBar from "@/components/admin/layout/TopBar";
import { orders } from "@/data/mockData";
import { Button } from "@/components/admin/ui/button";
import { Download } from "lucide-react";

const AdminReportsPage = () => {
  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const aov = paidOrders.length > 0 ? revenue / paidOrders.length : 0;
  const returns = orders.filter((o) => o.fulfillmentStatus === "Returned").length;

  const productSales: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.paymentStatus !== "Refunded") {
      o.items.forEach((item) => {
        productSales[item.product] = (productSales[item.product] || 0) + item.qty;
      });
    }
  });

  const bestSellers = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <>
      <TopBar title="Reports" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">February 2026</h2>
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Revenue", value: `${revenue.toFixed(2)} EUR` },
            { label: "Orders", value: paidOrders.length },
            { label: "AOV", value: `${aov.toFixed(2)} EUR` },
            { label: "Returns", value: returns },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg border border-border p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Top products</h3>
          </div>
          <div className="divide-y divide-border">
            {bestSellers.map(([name, qty], i) => (
              <div key={name} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <span className="text-sm font-medium text-foreground">{name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{qty} pcs</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminReportsPage;
