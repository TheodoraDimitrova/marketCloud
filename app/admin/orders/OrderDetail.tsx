"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TopBar from "@/components/admin/layout/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import type { AdminOrderDetail } from "@/lib/types/adminOrder";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { ArrowLeft, Package, Truck, RotateCcw, Loader2 } from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const orderId = typeof id === "string" ? id : undefined;
    if (!orderId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function fetchOrder(orderIdStr: string) {
      try {
        setError(null);
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderIdStr)}`);
        if (res.status === 404) {
          if (!cancelled) setOrder(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to load order");
        const data = await res.json();
        if (!cancelled) {
          setOrder(data);
          setTracking(data.tracking ?? "");
          setFulfillmentStatus(data.fulfillmentStatus ?? "New");
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOrder(orderId);
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <>
        <TopBar title="Order" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <TopBar title="Order Not Found" />
        <main className="flex-1 p-6">
          {error && <p className="text-destructive mb-2">{error}</p>}
          <p className="text-muted-foreground">Order not found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar
        title={`Order #${order.orderNumber}`}
        breadcrumbs={[{ label: "Orders", href: "/admin/orders" }]}
      />
      <main className="flex-1 p-6">
        <button
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Order #{order.orderNumber}</h2>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.paymentStatus} />
            <StatusBadge status={order.fulfillmentStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Customer</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="text-foreground">{order.customer}</span>
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{order.email}</span>
                <span className="text-muted-foreground">Phone</span>
                <span className="text-foreground">{order.phone}</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Shipping address</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Address</span>
                <span className="text-foreground">{order.shippingAddress.address}</span>
                <span className="text-muted-foreground">City</span>
                <span className="text-foreground">{order.shippingAddress.city}</span>
                <span className="text-muted-foreground">Postal code</span>
                <span className="text-foreground">{order.shippingAddress.zip}</span>
                <span className="text-muted-foreground">Country</span>
                <span className="text-foreground">{order.shippingAddress.country}</span>
              </div>
            </div>

            {(order.shipping?.method != null || order.shipping?.label != null || order.shipping?.cost != null) && (
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Shipping</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Delivery method</span>
                  <span className="text-foreground">
                    {order.shipping?.label && order.shipping.label.trim() !== ""
                      ? order.shipping.label
                      : order.shipping?.method ?? "—"}
                  </span>
                  {order.shipping?.cost != null && (
                    <>
                      <span className="text-muted-foreground">Cost</span>
                      <span className="text-foreground">{order.shipping.cost.toFixed(2)} EUR</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Items</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-2 font-medium text-muted-foreground">Product</th>
                    <th className="text-left px-5 py-2 font-medium text-muted-foreground">Variant</th>
                    <th className="text-center px-5 py-2 font-medium text-muted-foreground">Qty</th>
                    <th className="text-right px-5 py-2 font-medium text-muted-foreground">Price</th>
                    <th className="text-right px-5 py-2 font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3 font-medium text-foreground">{item.product}</td>
                      <td className="px-5 py-3 text-muted-foreground">{item.variant}</td>
                      <td className="px-5 py-3 text-center text-foreground">{item.qty}</td>
                      <td className="px-5 py-3 text-right text-foreground">{item.price.toFixed(2)} EUR</td>
                      <td className="px-5 py-3 text-right font-medium text-foreground">
                        {(item.price * item.qty).toFixed(2)} EUR
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={4} className="px-5 py-3 text-right font-semibold text-foreground">
                      Total:
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-foreground">
                      {order.total.toFixed(2)} EUR
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Payment</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="text-foreground">{order.paymentMethod}</span>
                <span className="text-muted-foreground">Status</span>
                <span className="text-foreground"><StatusBadge status={order.paymentStatus} /></span>
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="text-foreground font-mono text-xs">{order.transactionId || "—"}</span>
              </div>
              {order.paymentStatus === "Unpaid" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full sm:w-auto"
                  disabled={saving}
                  onClick={async () => {
                    if (!id || typeof id !== "string") return;
                    setSaving(true);
                    try {
                      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentStatus: "paid" }),
                      });
                      if (!res.ok) throw new Error("Failed to update");
                      const updated = await res.json();
                      setOrder(updated);
                    } catch {
                      setSaveMessage({ type: "error", text: "Failed to mark as paid" });
                      setTimeout(() => setSaveMessage(null), 3000);
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark as paid"}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
              <div className="bg-card rounded-lg border border-border p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Fulfillment</h3>
                <p className="text-xs text-muted-foreground">Saving a tracking number will mark the order as Shipped.</p>
                {saveMessage && (
                  <p className={saveMessage.type === "success" ? "text-green-600 text-sm" : "text-destructive text-sm"}>
                    {saveMessage.text}
                  </p>
                )}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                    <Select value={fulfillmentStatus} onValueChange={setFulfillmentStatus}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card z-50">
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Tracking number</label>
                    <Input
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                      placeholder="Enter tracking number"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Courier</label>
                    <Input placeholder="e.g. Speedy, Econt" className="bg-background" />
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={saving}
                  onClick={async () => {
                    if (!id || typeof id !== "string") return;
                    setSaveMessage(null);
                    setSaving(true);
                    try {
                      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tracking, fulfillmentStatus }),
                      });
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to save");
                      }
                      const updated = await res.json();
                      setOrder(updated);
                      setTracking(updated.tracking ?? "");
                      setFulfillmentStatus(updated.fulfillmentStatus ?? "New");
                      setSaveMessage({ type: "success", text: "Saved." });
                      setTimeout(() => setSaveMessage(null), 3000);
                    } catch (e) {
                      setSaveMessage({
                        type: "error",
                        text: e instanceof Error ? e.message : "Failed to save",
                      });
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save tracking & status"
                  )}
                </Button>
              </div>

              <div className="bg-card rounded-lg border border-border p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Actions</h3>
                <Button 
                  className="w-full justify-start gap-2" 
                  variant="outline" 
                  size="sm"
                  disabled={saving || order.fulfillmentStatus === "Shipped"}
                  onClick={async () => {
                    if (!id || typeof id !== "string") return;
                    setSaveMessage(null);
                    setSaving(true);
                    try {
                      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fulfillmentStatus: "Shipped" }),
                      });
                      if (!res.ok) throw new Error("Failed to update");
                      const updated = await res.json();
                      setOrder(updated);
                      setFulfillmentStatus(updated.fulfillmentStatus ?? "New");
                      setSaveMessage({ type: "success", text: "Order marked as shipped." });
                      setTimeout(() => setSaveMessage(null), 3000);
                    } catch (e) {
                      setSaveMessage({
                        type: "error",
                        text: e instanceof Error ? e.message : "Failed to update",
                      });
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  <Package className="h-4 w-4" /> Mark as shipped
                </Button>
                <Button 
                  className="w-full justify-start gap-2" 
                  variant="outline" 
                  size="sm"
                  disabled={saving || order.fulfillmentStatus === "Shipped"}
                  onClick={async () => {
                    if (!id || typeof id !== "string") return;
                    setSaveMessage(null);
                    setSaving(true);
                    try {
                      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fulfillmentStatus: "Shipped" }),
                      });
                      if (!res.ok) throw new Error("Failed to update");
                      const updated = await res.json();
                      setOrder(updated);
                      setFulfillmentStatus(updated.fulfillmentStatus ?? "New");
                      setSaveMessage({ type: "success", text: "Order marked as delivered." });
                      setTimeout(() => setSaveMessage(null), 3000);
                    } catch (e) {
                      setSaveMessage({
                        type: "error",
                        text: e instanceof Error ? e.message : "Failed to update",
                      });
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  <Truck className="h-4 w-4" /> Mark as delivered
                </Button>
                <Button 
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive" 
                  variant="outline" 
                  size="sm"
                  disabled={saving}
                  onClick={async () => {
                    if (!id || typeof id !== "string") return;
                    if (!confirm("Are you sure you want to mark this order as returned?")) return;
                    setSaveMessage(null);
                    setSaving(true);
                    try {
                      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fulfillmentStatus: "Cancelled" }),
                      });
                      if (!res.ok) throw new Error("Failed to update");
                      const updated = await res.json();
                      setOrder(updated);
                      setFulfillmentStatus(updated.fulfillmentStatus ?? "New");
                      setSaveMessage({ type: "success", text: "Order marked as returned." });
                      setTimeout(() => setSaveMessage(null), 3000);
                    } catch (e) {
                      setSaveMessage({
                        type: "error",
                        text: e instanceof Error ? e.message : "Failed to update",
                      });
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  <RotateCcw className="h-4 w-4" /> Mark as returned
                </Button>
              </div>

              <div className="bg-card rounded-lg border border-border p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Internal notes</h3>
                {order.notes.length > 0 ? (
                  <ul className="space-y-1">
                    {order.notes.map((note, i) => (
                      <li key={i} className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded">
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes.</p>
                )}
                <Textarea placeholder="Add a note..." className="bg-background" rows={2} />
                <Button size="sm" variant="secondary" className="w-full">
                  Add
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetail;
