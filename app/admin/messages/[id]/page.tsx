"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/admin/layout/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/forms/textarea";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import { ArrowLeft, Mail } from "lucide-react";

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
  adminReply?: string;
  repliedAt?: string;
  subscribed?: boolean;
  allMessages?: Array<{
    _id: string;
    _createdAt: string;
    message: string;
  }>;
}

const MessageDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("new");
  const [adminReply, setAdminReply] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchMessage();
    }
  }, [params.id]);

  const fetchMessage = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/messages/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch message");
      const data = await res.json();
      setMessage(data);
      setStatus(data.status || "new");
      setAdminReply(data.adminReply || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load message");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaveMessage(null);

      const res = await fetch(`/api/admin/messages/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminReply: adminReply.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to update message");

      setSaveMessage("Message updated successfully");
      setTimeout(() => setSaveMessage(null), 3000);
      
      // Refresh message data
      await fetchMessage();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update message");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <TopBar title="Message Details" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loading />
        </main>
      </>
    );
  }

  if (error || !message) {
    return (
      <>
        <TopBar title="Message Details" />
        <main className="flex-1 p-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            {error || "Message not found"}
          </div>
          <Link href="/admin/messages">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </Button>
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar title="Message Details" />
      <main className="flex-1 p-6 space-y-6">
        <Link href="/admin/messages">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Messages
          </Button>
        </Link>

        {saveMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
            {saveMessage}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Message Info */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {message.name || "No name"}
              </h2>
              <div className="flex items-center gap-4 text-muted-foreground">
                <a
                  href={`mailto:${message.email}`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {message.email}
                </a>
                {message.subscribed && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Subscribed
                  </span>
                )}
              </div>
            </div>
            <StatusBadge status={message.status || "new"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <Label className="text-muted-foreground">Enquiry Type</Label>
              <p className="font-medium">{message.enquiryType || "—"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Date</Label>
              <p className="font-medium">{formatDate(message._createdAt)}</p>
            </div>
            {message.orderNumber && (
              <div>
                <Label className="text-muted-foreground">Order Number</Label>
                <p className="font-medium">{message.orderNumber}</p>
              </div>
            )}
            {message.repliedAt && (
              <div>
                <Label className="text-muted-foreground">Replied At</Label>
                <p className="font-medium">{formatDate(message.repliedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Message */}
        <div className="bg-card rounded-lg border border-border p-6">
          <Label className="text-lg font-semibold mb-2 block">Customer Message</Label>
          <div className="bg-muted/30 rounded-md p-4 whitespace-pre-wrap">
            {message.message || "—"}
          </div>
        </div>

        {/* Admin Reply Section */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <Label className="text-lg font-semibold block">Admin Reply / Notes</Label>
          
          <div>
            <Label htmlFor="adminReply">Reply or Notes</Label>
            <Textarea
              id="adminReply"
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
              placeholder="Add your reply or internal notes here..."
              className="min-h-[120px] mt-2"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </main>
    </>
  );
};

export default MessageDetailPage;
