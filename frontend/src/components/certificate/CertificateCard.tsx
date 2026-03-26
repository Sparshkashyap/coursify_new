import React from "react";
import { Award, CalendarDays, FileBadge, GraduationCap } from "lucide-react";

const CertificateCard = ({ certificate }: any) => {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{certificate.courseTitle}</h3>
          <p className="text-sm text-muted-foreground">
            Issued by {certificate.issuedBy}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Student: {certificate.studentName}
        </p>
        <p className="flex items-center gap-2">
          <FileBadge className="h-4 w-4" />
          Certificate ID: {certificate.certificateId}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default CertificateCard;