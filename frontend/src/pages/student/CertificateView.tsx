import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Award,
  ArrowLeft,
  Download,
  CalendarDays,
  FileBadge,
  BadgeCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import API from "@/api/axios";
import { Button } from "@/components/ui/button";

const CertificateView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/certificates/${id}`);
        setCertificate(res.data?.certificate || null);
      } catch (err: any) {
        console.error("CERTIFICATE VIEW ERROR:", err?.response?.data || err);
        toast.error(
          err?.response?.data?.message || "Failed to load certificate"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) loadCertificate();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const issuedDate = certificate?.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const completedDate = certificate?.completedAt
    ? new Date(certificate.completedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : issuedDate;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">
          Loading certificate...
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-semibold">Certificate not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The certificate may not exist or you may not have access to it.
          </p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-page min-h-screen bg-[#eaf1fb] px-4 py-6 md:px-8 md:py-10 print:bg-white print:p-0">
      <style>
        {`
          @page {
            size: A4 landscape;
            margin: 0;
          }

          @media screen {
            .print-only {
              display: none !important;
            }
          }

          @media print {
            html,
            body {
              width: 297mm;
              height: 210mm;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .no-print,
            .screen-only {
              display: none !important;
            }

            .print-only {
              display: block !important;
            }

            .certificate-page {
              min-height: auto !important;
              padding: 0 !important;
              background: #ffffff !important;
            }

            .certificate-shell {
              width: 297mm !important;
              height: 210mm !important;
              max-width: 297mm !important;
              margin: 0 !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              overflow: hidden !important;
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>

      <div className="mx-auto max-w-7xl">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2 border-blue-200 bg-white text-slate-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handlePrint}
            className="gap-2 bg-[#163b73] text-white hover:bg-[#122f5b]"
          >
            <Download className="h-4 w-4" />
            Download / Print
          </Button>
        </div>

        <div className="certificate-shell mx-auto aspect-[1.414/1] w-full max-w-[1200px] overflow-hidden rounded-[28px] border-[14px] border-[#244f8f] bg-[#f8fbff] shadow-[0_30px_80px_rgba(22,59,115,0.20)]">
          <div className="relative h-full border-[8px] border-[#9bb8df] bg-[linear-gradient(135deg,#fdfefe_0%,#f4f8ff_45%,#eef5ff_100%)] p-5 md:p-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-0 top-0 h-56 w-56 rounded-br-full bg-[#dbe8f9]/75" />
              <div className="absolute bottom-0 right-0 h-64 w-64 rounded-tl-full bg-[#dbe8f9]/75" />
              <div className="absolute inset-[18px] rounded-[16px] border border-[#c5d7ef]" />
              <div className="absolute left-[50%] top-0 h-full w-px -translate-x-1/2 bg-[#d7e4f4]" />
            </div>

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#335b93] md:text-xs">
                    Official Certificate
                  </p>

                  <h1 className="mt-2 text-2xl font-bold tracking-[0.22em] text-[#10233e] md:text-4xl">
                    COURSIFY
                  </h1>

                  <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-slate-500 md:text-xs">
                    Certificate of Completion
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-flex rounded-full border border-[#b7cbed] bg-[#edf4ff] p-3 shadow-sm md:p-4">
                    <Award className="h-8 w-8 text-[#244f8f] md:h-10 md:w-10" />
                  </div>

                  <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-slate-500 md:text-xs">
                    Certificate No.
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 md:text-base">
                    {certificate.certificateId || "N/A"}
                  </p>
                </div>
              </div>

              <div className="relative mt-4 text-center md:mt-6">
                <p className="text-[11px] uppercase tracking-[0.38em] text-slate-500 md:text-xs">
                  This certifies that
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-tight text-[#0f172a] md:text-5xl lg:text-6xl">
                  {certificate.studentName || "Student Name"}
                </h2>

                <div className="mx-auto mt-4 h-[2px] w-28 bg-[#2c5ea8] md:mt-5 md:w-40" />

                <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  Has successfully completed the certified program and fulfilled
                  all completion requirements for the course
                </p>

                <h3 className="mx-auto mt-5 max-w-4xl text-2xl font-semibold leading-snug text-[#1b4c8c] md:text-4xl">
                  {certificate.courseTitle ||
                    certificate.course?.title ||
                    "Course Title"}
                </h3>

              
              </div>


              <div className="mt-6 border-t border-[#cbdcf1] pt-6">
                

                  <div className="text-center md:min-w-[260px] md:text-right">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500 md:text-xs">
                      Authorized Signature
                    </div>

                    <img
                      src="/signature.png"
                      alt="Sparsh Kashyap Signature"
                      className="mx-auto h-16 object-contain md:ml-auto md:mr-0 md:h-20"
                    />

                    <div className="mt-2 h-px w-44 bg-slate-400 md:ml-auto" />

                    <p className="mt-2 text-sm font-semibold text-slate-900 md:text-base">
                      Sparsh Kashyap
                    </p>
                    <p className="text-xs text-slate-500">Founder, Coursify</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CertificateView;