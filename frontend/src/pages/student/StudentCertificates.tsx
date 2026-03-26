import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  CalendarDays,
  FileBadge,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getMyCertificates } from "@/api/studentApi";

const StudentCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);
        const data = await getMyCertificates();
        setCertificates(data?.certificates || []);
      } catch (err) {
        console.error("CERTIFICATES ERROR:", err);
        toast.error("Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Certificates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your earned course certificates and badges.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          <Award className="mx-auto mb-3 h-8 w-8" />
          No certificates earned yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((item: any, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                to={`/certificate/${item._id}`}
                className="block rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {item.courseTitle || item.course?.title || "Course"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Issued by {item.issuedBy || "Coursify"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Student: {item.studentName || "Student"}
                  </p>

                  <p className="flex items-center gap-2">
                    <FileBadge className="h-4 w-4" />
                    Certificate ID: {item.certificateId || "N/A"}
                  </p>

                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Issued on:{" "}
                    {item.issuedAt
                      ? new Date(item.issuedAt).toLocaleDateString()
                      : "N/A"}
                  </p>

                  {item.course?._id && (
                    <p className="text-xs text-muted-foreground">
                      Course ID: {item.course._id}
                    </p>
                  )}

                  {item.enrollment?._id && (
                    <p className="text-xs text-muted-foreground">
                      Enrollment ID: {item.enrollment._id}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-medium text-primary">
                    View Certificate
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;