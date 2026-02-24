"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/admin/layout/TopBar";
import { Button } from "@/components/admin/ui/button";
import { Download, Mail } from "lucide-react";
import { Loading } from "@/components/ui/Loading";

interface Subscriber {
  _id: string;
  _createdAt: string;
  email: string;
  name?: string;
  source?: string;
}

const AdminMarketingPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/marketing");
      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(responseData.message || `Failed to fetch subscribers: ${res.status}`);
      }
      
      setSubscribers(responseData);
    } catch (err) {
      console.error("Marketing page - Error:", err);
      setError(err instanceof Error ? err.message : "Failed to load subscribers");
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

  const exportToCSV = () => {
    const headers = ["Email", "Name", "Source", "Subscribed Date"];
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.name || "",
      sub.source || "",
      formatDate(sub._createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <>
        <TopBar title="Marketing" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loading />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar title="Marketing" />
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
      <TopBar title="Marketing" />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}
            </p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={exportToCSV}
            disabled={subscribers.length === 0}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {subscribers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No subscribers yet
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{sub.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{sub.name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary capitalize">
                        {sub.source || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(sub._createdAt)}</td>
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

export default AdminMarketingPage;

