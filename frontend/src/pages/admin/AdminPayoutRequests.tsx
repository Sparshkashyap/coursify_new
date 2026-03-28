import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAdminPayoutRequests,
  approvePayoutRequest,
  rejectPayoutRequest,
} from "@/api/payoutApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminPayoutRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getAdminPayoutRequests();
      setRequests(data?.payoutRequests || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load payout requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await approvePayoutRequest(id);
      toast.success("Payout approved");
      loadRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to approve payout");
    } finally {
      setProcessingId("");
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      await rejectPayoutRequest(id);
      toast.success("Payout rejected");
      loadRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reject payout");
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Payout Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage instructor payout requests.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
            ))
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No payout requests found.
            </div>
          ) : (
            requests.map((item) => (
              <div key={item._id} className="rounded-2xl border p-4 space-y-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold">{item.instructor?.name || "Unknown Instructor"}</h3>
                    <p className="text-sm text-muted-foreground">{item.instructor?.email}</p>
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold">₹{item.amount}</span>
                    <span className="ml-2 rounded-full border px-3 py-1 text-xs capitalize">
                      {item.status}
                    </span>
                  </div>
                </div>

                {item.note && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Instructor note:</span> {item.note}
                  </p>
                )}

                {item.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(item._id)}
                      disabled={processingId === item._id}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(item._id)}
                      disabled={processingId === item._id}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayoutRequests;