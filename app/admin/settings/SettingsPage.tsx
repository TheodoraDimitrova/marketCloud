"use client";

import TopBar from "@/components/admin/layout/TopBar";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";

const SettingsPage = () => {
  return (
    <>
      <TopBar title="Settings" />
      <main className="flex-1 p-6 space-y-6 max-w-2xl">
        <div className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Store information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Store name</label>
              <Input defaultValue="My Store" className="bg-background" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Notification email</label>
              <Input defaultValue="admin@mystore.bg" className="bg-background" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Support email</label>
              <Input defaultValue="support@mystore.bg" className="bg-background" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Order behavior</h3>
          <p className="text-sm text-muted-foreground">Stock is reduced when status is &quot;Paid&quot; or &quot;Processing&quot;.</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Stock rules</h3>
          <p className="text-sm text-muted-foreground">Show a warning when stock is below the set minimum for each product.</p>
        </div>

        <Button>Save settings</Button>
      </main>
    </>
  );
};

export default SettingsPage;
