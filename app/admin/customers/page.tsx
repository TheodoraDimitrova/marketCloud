"use client";

import Link from "next/link";
import TopBar from "@/components/admin/layout/TopBar";
import { customers } from "@/data/mockData";
import { Check, X } from "lucide-react";

const AdminCustomersPage = () => {
  return (
    <>
      <TopBar title="Customers" />
      <main className="flex-1 p-6 space-y-4">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Orders</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-foreground hover:underline block">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-right text-foreground">{c.ordersCount}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">{c.totalSpent.toFixed(2)} EUR</td>
                  <td className="px-4 py-3 text-center">
                    {c.subscribed ? <Check className="h-4 w-4 text-success inline" aria-label="Yes" /> : <X className="h-4 w-4 text-muted-foreground inline" aria-label="No" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default AdminCustomersPage;
