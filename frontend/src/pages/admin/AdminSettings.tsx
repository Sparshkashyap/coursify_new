import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { getAdminSettings, updateAdminSettings } from "@/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminSettings: React.FC = () => {
  const [form, setForm] = useState({
    commissionPercent: 10,
    supportEmail: "",
    maintenanceMode: false,
    defaultCurrency: "INR",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAdminSettings();
      if (data.settings) {
        setForm({
          commissionPercent: data.settings.commissionPercent ?? 10,
          supportEmail: data.settings.supportEmail ?? "",
          maintenanceMode: data.settings.maintenanceMode ?? false,
          defaultCurrency: data.settings.defaultCurrency ?? "INR",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAdminSettings(form);
      toast.success("Settings updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-sm text-muted-foreground">Control platform-level behavior.</p>
      </motion.div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p>Loading settings...</p>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Commission Percent</label>
                <Input
                  type="number"
                  value={form.commissionPercent}
                  onChange={(e) =>
                    setForm({ ...form, commissionPercent: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) =>
                    setForm({ ...form, supportEmail: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Currency</label>
                <Input
                  value={form.defaultCurrency}
                  onChange={(e) =>
                    setForm({ ...form, defaultCurrency: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border p-3">
                <input
                  id="maintenanceMode"
                  type="checkbox"
                  checked={form.maintenanceMode}
                  onChange={(e) =>
                    setForm({ ...form, maintenanceMode: e.target.checked })
                  }
                />
                <label htmlFor="maintenanceMode" className="text-sm font-medium">
                  Enable Maintenance Mode
                </label>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default AdminSettings;