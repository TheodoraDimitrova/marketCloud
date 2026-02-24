"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/admin/layout/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { Loading } from "@/components/ui/Loading";

interface Message {
  _id: string;
  contactId?: string;
  _createdAt: string;
  name?: string;
  email: string;
  message: string;
  enquiryType?: string;
  status?: string;
  orderNumber?: string;
}

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
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

  const filteredMessages = statusFilter === "all" 
    ? messages 
    : messages.filter((m) => m.status === statusFilter);

  const statusCounts = {
    all: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
    closed: messages.filter((m) => m.status === "closed").length,
  };

  if (loading) {
    return (
      <>
        <TopBar title="Messages" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loading />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar title="Messages" />
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
      <TopBar title="Messages" />
      <main className="flex-1 p-6 space-y-4">
        {/* Status filters */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: "All" },
            { value: "new", label: "New" },
            { value: "read", label: "Read" },
            { value: "replied", label: "Replied" },
            { value: "closed", label: "Closed" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter.label} ({statusCounts[filter.value as keyof typeof statusCounts]})
            </button>
          ))}
        </div>

        {/* Messages table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No messages found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Message</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMessages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/messages/${msg._id}`}
                        className="font-medium text-foreground hover:underline block"
                      >
                        {msg.name || "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{msg.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {msg.enquiryType || "—"}
                      {msg.orderNumber && (
                        <span className="block text-xs text-muted-foreground">
                          Order: {msg.orderNumber}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xs truncate">
                      {msg.message || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(msg._createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={msg.status || "new"} />
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

export default AdminMessagesPage;
