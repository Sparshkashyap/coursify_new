import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createPayoutRequest,
  getInstructorPayoutRequests,
} from "@/api/payoutApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InstructorPayout: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getInstructorPayoutRequests();
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

  const handleSubmit = async () => {
    try {
      if (!amount || Number(amount) <= 0) {
        toast.error("Enter a valid payout amount");
        return;
      }

      setSubmitting(true);
      await createPayoutRequest({
        amount: Number(amount),
        note,
      });

      toast.success("Payout request submitted");
      setAmount("");
      setNote("");
      loadRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create payout request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Instructor Payouts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit and track your payout requests.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Request Payout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none"
          />

          <textarea
            placeholder="Optional note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[110px] w-full rounded-xl border bg-background px-4 py-3 outline-none"
          />

          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>My Payout Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
            ))
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No payout requests yet.
            </div>
          ) : (
            requests.map((item) => (
              <div key={item._id} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">₹{item.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-xs capitalize">
                    {item.status}
                  </span>
                </div>

                {item.note && (
                  <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
                )}

                {item.adminNote && (
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Admin note:</span> {item.adminNote}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorPayout;