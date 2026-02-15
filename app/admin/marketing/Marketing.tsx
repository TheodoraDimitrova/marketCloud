"use client";

import TopBar from "@/components/admin/layout/TopBar";
import { emailSubscriptions } from "@/data/mockData";
import { Button } from "@/components/admin/ui/button";
import { Download } from "lucide-react";

const Marketing = () => {
  return (
    <>
      <TopBar title="Marketing" />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{emailSubscriptions.length} subscribers</p>
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {emailSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{sub.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sub.date}</td>
                  <td className="px-4 py-3"><span className="badge-active">{sub.source}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Marketing;
