"use client";

import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/admin/layout/TopBar";
import { customers, orders } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

const AdminCustomerDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <>
        <TopBar title="Customer Not Found" />
        <main className="flex-1 p-6"><p className="text-muted-foreground">Customer not found.</p></main>
      </>
    );
  }

  const customerOrders = orders.filter((o) => o.email === customer.email);

  return (
    <>
      <TopBar title={customer.name} breadcrumbs={[{ label: "Customers", href: "/admin/customers" }]} />
      <main className="flex-1 p-6">
        <button onClick={() => router.push("/admin/customers")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Profile</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Name</span><span className="text-foreground">{customer.name}</span>
                <span className="text-muted-foreground">Email</span><span className="text-foreground">{customer.email}</span>
                <span className="text-muted-foreground">Phone</span><span className="text-foreground">{customer.phone}</span>
                <span className="text-muted-foreground">Customer since</span><span className="text-foreground">{customer.createdAt}</span>
                <span className="text-muted-foreground">Subscribed</span><span className="text-foreground">{customer.subscribed ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Orders</h3>
              </div>
              {customerOrders.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {customerOrders.map((o) => (
                      <tr key={o.id} onClick={() => router.push(`/admin/orders/${o.id}`)} className="hover:bg-muted/30 cursor-pointer transition-colors">
                        <td className="px-5 py-3 font-medium text-foreground">#{o.orderNumber}</td>
                        <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                        <td className="px-5 py-3"><StatusBadge status={o.paymentStatus} /></td>
                        <td className="px-5 py-3 text-right font-medium text-foreground">{o.total.toFixed(2)} EUR</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-5 py-4 text-sm text-muted-foreground">No orders.</p>
              )}
            </div>
          </div>

          <div>
            <div className="bg-card rounded-lg border border-border p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Notes</h3>
              {customer.notes.length > 0 ? (
                <ul className="space-y-1">
                  {customer.notes.map((n, i) => (
                    <li key={i} className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded">{n}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No notes.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminCustomerDetailPage;
