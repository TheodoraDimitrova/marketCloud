"use client";

import TopBar from "@/components/admin/layout/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { messages } from "@/data/mockData";

const AdminMessagesPage = () => {
  return (
    <>
      <TopBar title="Messages" />
      <main className="flex-1 p-6 space-y-4">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Message</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{msg.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{msg.email}</td>
                  <td className="px-4 py-3 text-foreground max-w-xs truncate">{msg.message}</td>
                  <td className="px-4 py-3 text-muted-foreground">{msg.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={msg.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default AdminMessagesPage;
