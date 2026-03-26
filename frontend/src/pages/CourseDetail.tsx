import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { completeCourseAndIssueCertificate } from "@/api/studentApi";
import {
  ArrowLeft,
  Users,
  IndianRupee,
  Star,
  BadgeCheck,
  Lock,
  Loader2,
  Tag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import { createCourseOrder, verifyCoursePayment } from "@/api/paymentApi";
import { enrollInFreeCourse } from "@/api/studentApi";
import CourseReviewForm from "@/components/CourseReviewForm";
import CourseReviewsList from "@/components/CourseReviewsList";
import { useAuth } from "@/contexts/AuthContext";
import { loadRazorpayScript } from "@/api/loadRazorpay";
import { getAffiliateCode } from "@/utils/affiliate";
import CourseAIChat from "@/components/course/CourseAIChat";
import CourseQuizPanel from "@/components/course/CourseQuizPanel";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data.course);
      setReviews(res.data.reviews || []);
      setHasAccess(res.data.hasAccess || false);
    } catch (err: any) {
      console.error("COURSE DETAIL ERROR:", err.response?.data || err);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleFreeEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollInFreeCourse(id!);
      toast.success("Enrolled successfully");
      await fetchCourse();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaidEnroll = async () => {
    try {
      setEnrolling(true);

      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const affiliateCode = getAffiliateCode();
      const data = await createCourseOrder(id!, affiliateCode);

      if (!data?.success || !data?.order?.id) {
        toast.error(data?.message || "Failed to create payment order");
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Coursify",
        description: data.course?.title || course?.title || "Course Purchase",
        order_id: data.order.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        notes: {
          courseId: String(id),
        },
        theme: {
          color: "#0f172a",
        },
        modal: {
          confirm_close: true,
          ondismiss: function () {
            toast.info("Payment popup closed");
            setEnrolling(false);
          },
        },
        handler: async function (response: any) {
          try {
            const verifyData = await verifyCoursePayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              toast.success("Payment successful and course unlocked");
              await fetchCourse();
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch (err: any) {
            console.error("VERIFY ERROR:", err.response?.data || err);
            toast.error(
              err.response?.data?.message || "Payment verification failed"
            );
          } finally {
            setEnrolling(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("RAZORPAY PAYMENT FAILED:", response);
        toast.error(
          response?.error?.description || "Payment failed. Please try again."
        );
        setEnrolling(false);
      });

      razorpay.open();
    } catch (err: any) {
      console.error("CREATE ORDER FRONTEND ERROR:", err.response?.data || err);
      toast.error(
        err.response?.data?.message ||
          err?.message ||
          "Failed to create payment order"
      );
      setEnrolling(false);
    }
  };

  const handleVideoEnded = async () => {
    try {
      if (!course?._id || !hasAccess) return;

      const data = await completeCourseAndIssueCertificate(course._id);

      if (data?.success) {
        toast.success("Course completed. Certificate issued.");
        await fetchCourse();
      }
    } catch (err: any) {
      console.error("COMPLETE COURSE ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to issue certificate");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">
        <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
      </div>
    );
  }

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  const isStudent = user?.role === "student";

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </motion.div>

      <div className="overflow-hidden border bg-card shadow-sm">
        <img
          src={course.image}
          alt={course.title}
          className="block h-auto max-h-[520px] min-h-[180px] w-full rounded-md object-contain sm:min-h-[240px] md:min-h-[320px] md:object-cover"
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="space-y-6">
          <div className="overflow-hidden border bg-black">
            {course.video && hasAccess ? (
              <video
                src={course.video}
                controls
                onEnded={handleVideoEnded}
                className="block aspect-video w-full bg-black object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center text-white">
                <div className="space-y-3 px-6 text-center">
                  <Lock className="mx-auto h-14 w-14 opacity-70 sm:h-16 sm:w-16" />
                  <p className="text-sm text-slate-300">
                    {course.isFree
                      ? "Enroll to access this course"
                      : "Buy this course to unlock video access"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge>{course.isFree ? "Free" : `₹${course.price}`}</Badge>
              {course.category && (
                <Badge variant="outline">
                  <Tag className="mr-1 h-3.5 w-3.5" />
                  {course.category}
                </Badge>
              )}
              <Badge variant="outline">{course.reviewCount || 0} reviews</Badge>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">{course.title}</h1>
            <p className="mt-3 leading-7 text-muted-foreground">
              {course.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="border bg-card p-5">
              <Users className="mb-3 h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Students</p>
              <p className="text-2xl font-bold">{course.students?.length || 0}</p>
            </div>

            <div className="border bg-card p-5">
              <Star className="mb-3 h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="text-2xl font-bold">{course.rating || 0}</p>
            </div>

            <div className="border bg-card p-5">
              <IndianRupee className="mb-3 h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">
                {course.isFree ? "₹0" : `₹${course.price}`}
              </p>
            </div>

            <div className="border bg-card p-5">
              <BadgeCheck className="mb-3 h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Access</p>
              <p className="text-2xl font-bold">
                {hasAccess ? "Unlocked" : "Locked"}
              </p>
            </div>
          </div>

          {isStudent && hasAccess && (
            <>
              <CourseAIChat courseId={course._id} />
              <CourseQuizPanel courseId={course._id} />
            </>
          )}

          {isStudent && hasAccess && (
            <CourseReviewForm courseId={course._id} onSaved={fetchCourse} />
          )}

          <CourseReviewsList reviews={reviews} />
        </div>

        <div className="space-y-6">
          <div className="border bg-card p-5 shadow-sm sm:p-6">
            <h3 className="mb-3 text-lg font-semibold">Course Preview</h3>
            <img
              src={course.image}
              alt={course.title}
              className="block h-auto max-h-[320px] w-full object-contain md:object-cover"
            />
          </div>

          {isStudent && !hasAccess && (
            <div className="border bg-card p-6 shadow-sm">
              <Button
                className="w-full"
                onClick={course.isFree ? handleFreeEnroll : handlePaidEnroll}
                disabled={enrolling}
              >
                {enrolling ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : course.isFree ? (
                  "Enroll for Free"
                ) : (
                  `Pay ₹${course.price}`
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default CourseDetail;