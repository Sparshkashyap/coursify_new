import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { getAdminPayments } from "@/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getAdminPayments();
      setPayments(data.payments || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Admin Payments</h1>
        <p className="text-sm text-muted-foreground">Track all payment activity across the platform.</p>
      </motion.div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading payments...</TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No payments found.</TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.student?.name || "Unknown"}</TableCell>
                    <TableCell>{payment.course?.title || "Unknown"}</TableCell>
                    <TableCell>{payment.instructor?.name || "Unknown"}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.status}</Badge>
                    </TableCell>
                    <TableCell>{payment.provider}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default AdminPayments;