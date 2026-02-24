"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/admin/layout/TopBar";
import { Check, X } from "lucide-react";
import { Loading } from "@/components/ui/Loading";

interface Customer {
  _id: string;
  name: string;
  email: string;
  source?: string;
  subscribed: boolean;
  ordersCount: number;
  messagesCount: number;
  reviewsCount: number;
  totalSpent: number;
  createdAt: string;
}

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/customers");
      const responseData = await res.json();
      
      console.log("Customers page - API response:", { status: res.status, data: responseData });
      
      if (!res.ok) {
        throw new Error(responseData.message || `Failed to fetch customers: ${res.status}`);
      }
      
      setCustomers(responseData);
    } catch (err) {
      console.error("Customers page - Error:", err);
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <TopBar title="Customers" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loading />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar title="Customers" />
        <main className="flex-1 p-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            {error}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar title="Customers" />
      <main className="flex-1 p-6 space-y-4">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {customers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No customers found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Orders</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Messages</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Reviews</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/customers/${c._id}`}
                        className="font-medium text-foreground hover:underline block"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{c.source || "—"}</td>
                    <td className="px-4 py-3 text-right text-foreground">{c.ordersCount}</td>
                    <td className="px-4 py-3 text-right text-foreground">{c.messagesCount}</td>
                    <td className="px-4 py-3 text-right text-foreground">{c.reviewsCount}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {c.totalSpent.toFixed(2)} EUR
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.subscribed ? (
                        <Check className="h-4 w-4 text-success inline" aria-label="Yes" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground inline" aria-label="No" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminCustomersPage;
