"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/layout/TopBar";
import { ArrowLeft, Mail, MessageSquare, Star, ShoppingCart } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { Loading } from "@/components/ui/Loading";

interface Order {
  _id: string;
  orderNumber: string;
  _createdAt: string;
  totalAmount?: number;
  paymentStatus?: string;
  status?: string;
}

interface Message {
  _id: string;
  _createdAt: string;
  message: string;
  enquiryType?: string;
  status?: string;
}

interface Review {
  _id: string;
  _createdAt: string;
  rating: number;
  comment: string;
}

interface Customer {
  _id: string;
  _createdAt: string;
  name?: string;
  email: string;
  source?: string;
  subscribed?: boolean;
  orders: Order[];
  messages: Message[];
  reviews: Review[];
}

const AdminCustomerDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/customers/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch customer");
      const data = await res.json();
      setCustomer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customer");
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <TopBar title="Customer Details" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loading />
        </main>
      </>
    );
  }

  if (error || !customer) {
    return (
      <>
        <TopBar title="Customer Not Found" />
        <main className="flex-1 p-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            {error || "Customer not found"}
          </div>
          <Link href="/admin/customers">
            <button className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Customers
            </button>
          </Link>
        </main>
      </>
    );
  }

  const totalSpent = customer.orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <>
      <TopBar title={customer.name || customer.email} />
      <main className="flex-1 p-6">
        <Link href="/admin/customers">
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Customers
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Profile */}
            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Profile</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="text-foreground">{customer.name || "—"}</span>
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </span>
                <span className="text-muted-foreground">Source</span>
                <span className="text-foreground capitalize">{customer.source || "—"}</span>
                <span className="text-muted-foreground">Customer since</span>
                <span className="text-foreground">{formatDate(customer._createdAt)}</span>
                <span className="text-muted-foreground">Subscribed</span>
                <span className="text-foreground">{customer.subscribed ? "Yes" : "No"}</span>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <h3 className="text-sm font-semibold text-foreground">Orders ({customer.orders.length})</h3>
              </div>
              {customer.orders.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">Order #</th>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-right px-5 py-3 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {customer.orders.map((o) => (
                      <tr
                        key={o._id}
                        onClick={() => router.push(`/admin/orders/${o._id}`)}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-3 font-medium text-foreground">#{o.orderNumber}</td>
                        <td className="px-5 py-3 text-muted-foreground">{formatDate(o._createdAt)}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={o.paymentStatus || o.status || "unpaid"} />
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-foreground">
                          {Number(o.totalAmount || 0).toFixed(2)} EUR
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border bg-muted/30">
                      <td colSpan={3} className="px-5 py-3 font-semibold text-foreground text-right">
                        Total Spent:
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">
                        {totalSpent.toFixed(2)} EUR
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <p className="px-5 py-4 text-sm text-muted-foreground">No orders.</p>
              )}
            </div>

            {/* Messages */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <h3 className="text-sm font-semibold text-foreground">Messages ({customer.messages.length})</h3>
              </div>
              {customer.messages.length > 0 ? (
                <div className="divide-y divide-border">
                  {customer.messages.map((msg) => (
                    <Link
                      key={msg._id}
                      href={`/admin/messages/${msg._id}`}
                      className="block px-5 py-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{formatDate(msg._createdAt)}</span>
                        <StatusBadge status={msg.status || "new"} />
                      </div>
                      <p className="text-sm text-foreground mb-1 line-clamp-2">{msg.message}</p>
                      {msg.enquiryType && (
                        <span className="text-xs text-muted-foreground capitalize">{msg.enquiryType}</span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-4 text-sm text-muted-foreground">No messages.</p>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Star className="h-4 w-4" />
                <h3 className="text-sm font-semibold text-foreground">Reviews ({customer.reviews.length})</h3>
              </div>
              {customer.reviews.length > 0 ? (
                <div className="divide-y divide-border">
                  {customer.reviews.map((review) => (
                    <div key={review._id} className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(review._createdAt)}</span>
                      </div>
                      <p className="text-sm text-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-4 text-sm text-muted-foreground">No reviews.</p>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-5">
            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Statistics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-semibold text-foreground">{customer.orders.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-semibold text-foreground">{totalSpent.toFixed(2)} EUR</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Messages</p>
                  <p className="text-2xl font-semibold text-foreground">{customer.messages.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                  <p className="text-2xl font-semibold text-foreground">{customer.reviews.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminCustomerDetailPage;
