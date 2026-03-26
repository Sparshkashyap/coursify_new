import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ImagePlus,
  Video,
  Save,
  Sparkles,
  UploadCloud,
  Layers3,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API from "@/api/axios";
import { toast, ToastContainer } from "react-toastify";
import { chunkedCloudinaryVideoUpload } from "@/utils/cloudinaryChunkUpload";

type SignatureResponse = {
  success: boolean;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

const MAX_VIDEO_SIZE_MB = 100;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const AddCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    isFree: true,
    image: "",
    video: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCourse = async () => {
      try {
        setPageLoading(true);
        const res = await API.get(`/courses/${id}`);
        const course = res.data.course;

        setForm({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          price: String(course.price ?? ""),
          isFree: course.isFree ?? true,
          image: course.image || "",
          video: course.video || "",
        });
      } catch (err: any) {
        console.error("EDIT FETCH ERROR:", err.response?.data || err);
        toast.error("Failed to load course");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCourse();
  }, [id, isEditMode]);

  const getSignature = async () => {
    const res = await API.post<SignatureResponse>("/uploads/signature", {
      folder: "courses",
    });
    return res.data;
  };

  const uploadSignedImage = async (file: File) => {
    const signed = await getSignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signed.apiKey);
    formData.append("timestamp", String(signed.timestamp));
    formData.append("signature", signed.signature);
    formData.append("folder", signed.folder);

    const endpoint = `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.error?.message || "Image upload failed");
    }

    return result.secure_url as string;
  };

  const uploadSignedVideo = async (file: File) => {
    const sizeInMB = file.size / (1024 * 1024);

    if (sizeInMB > MAX_VIDEO_SIZE_MB) {
      throw new Error(
        `Video must be under ${MAX_VIDEO_SIZE_MB} MB on your current Cloudinary limit`
      );
    }

    const signed = await getSignature();

    const result = await chunkedCloudinaryVideoUpload(file, signed, (percent) => {
      setVideoProgress(percent);
    });

    return result.secure_url;
  };

  const handleUpload = async (file: File, type: "image" | "video") => {
    if (!file) return;

    try {
      if (type === "image") {
        setUploadingImage(true);
        const secureUrl = await uploadSignedImage(file);
        setForm((prev) => ({ ...prev, image: secureUrl }));
        toast.success("Image uploaded");
      } else {
        setUploadingVideo(true);
        setVideoProgress(0);
        const secureUrl = await uploadSignedVideo(file);
        setForm((prev) => ({ ...prev, video: secureUrl }));
        toast.success("Video uploaded");
      }
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);
      toast.error(err.message || "Upload failed");
    } finally {
      if (type === "image") setUploadingImage(false);
      if (type === "video") setUploadingVideo(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.title.trim()) return toast.error("Title is required");
      if (!form.description.trim()) return toast.error("Description is required");
      if (!form.category.trim()) return toast.error("Category is required");
      if (!form.image) return toast.error("Upload image first");
      if (!form.video) return toast.error("Upload video first");
      if (!form.isFree && !form.price) return toast.error("Enter price for paid course");

      setLoading(true);

      const payload = {
        ...form,
        category: form.category.trim(),
        price: form.isFree ? 0 : Number(form.price),
      };

      if (isEditMode) {
        await API.put(`/courses/${id}`, payload);
        toast.success("Course updated");
      } else {
        await API.post("/courses", payload);
        toast.success("Course created");
      }

      navigate("/instructor");
    } catch (err: any) {
      console.error("SUBMIT ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-background p-6">
        <div className="mx-auto max-w-4xl space-y-4 animate-pulse">
          <div className="h-10 w-56 rounded-xl bg-muted" />
          <div className="h-12 rounded-xl bg-muted" />
          <div className="h-32 rounded-xl bg-muted" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-56 rounded-xl bg-muted" />
            <div className="h-56 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-background p-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.35 }}
        className="mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
      >
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {isEditMode ? "Update your course" : "Create a new course"}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Edit Course" : "Create Course"}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Add your title, description, category, thumbnail, and course video in one clean flow.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate("/instructor")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="space-y-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Course Title
              </label>
              <Input
                placeholder="Enter course title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-11 bg-background"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                placeholder="Write a clear and useful description of your course"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="min-h-[140px] bg-background"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Layers3 className="h-4 w-4 text-primary" />
                Category
              </label>
              <Input
                placeholder="e.g. Web Development, AI, Design, Marketing"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-11 bg-background"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={form.isFree ? "default" : "outline"}
                onClick={() => setForm({ ...form, isFree: true, price: "0" })}
              >
                Free
              </Button>

              <Button
                type="button"
                variant={!form.isFree ? "default" : "outline"}
                onClick={() => setForm({ ...form, isFree: false, price: "" })}
              >
                Paid
              </Button>
            </div>

            {!form.isFree && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Price
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="h-11 bg-background"
                />
              </div>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="rounded-2xl border border-border bg-background/50 p-5">
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <ImagePlus className="h-4 w-4 text-primary" />
                Thumbnail
              </label>

              <div className="rounded-2xl border border-dashed border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <UploadCloud className="h-4 w-4" />
                  Upload a clean course thumbnail
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="block w-full rounded-md border border-border bg-card p-2 text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, "image");
                  }}
                />

                {uploadingImage && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Uploading image...
                  </p>
                )}

                {form.image && (
                  <motion.img
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    src={form.image}
                    alt="Course thumbnail"
                    className="mt-4 h-52 w-full rounded-xl border border-border object-cover"
                  />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/50 p-5">
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Video className="h-4 w-4 text-primary" />
                Course Video
              </label>

              <div className="rounded-2xl border border-dashed border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <UploadCloud className="h-4 w-4" />
                  Upload a course preview or lesson video
                </div>

                <input
                  type="file"
                  accept="video/*"
                  className="block w-full rounded-md border border-border bg-card p-2 text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, "video");
                  }}
                />

                {uploadingVideo && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Uploading video... {videoProgress}%
                    </p>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {form.video && !uploadingVideo && (
                  <motion.video
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    src={form.video}
                    controls
                    className="mt-4 h-52 w-full rounded-xl border border-border object-cover"
                  />
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.15 }}
            className="sticky bottom-4 z-10 rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur"
          >
            <Button
              onClick={handleSubmit}
              disabled={loading || uploadingImage || uploadingVideo}
              className="h-11 w-full gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : isEditMode ? "Update Course" : "Create Course"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default AddCourse;