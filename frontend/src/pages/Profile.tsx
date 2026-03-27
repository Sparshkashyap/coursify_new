import React, { useEffect, useMemo, useState } from "react";
import { Camera, Loader2, Save, User2, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMyProfile,
  updateMyProfile,
  removeMyProfileAvatar,
} from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import defaultAvatar from "@/assets/avtar.jpg";

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getMyProfile();
        const profileUser = data?.user;

        setName(profileUser?.name || "");
        setCurrentAvatar(profileUser?.avatar || "");
      } catch (err: any) {
        console.error("PROFILE LOAD ERROR:", err?.response?.data || err);
        toast.error(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const displayAvatar = useMemo(() => {
    return preview || currentAvatar || user?.avatar || defaultAvatar;
  }, [preview, currentAvatar, user?.avatar]);

  const hasAvatar = Boolean(preview || currentAvatar || user?.avatar);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        toast.error("Name is required");
        return;
      }

      if (!avatarFile && name.trim() === (user?.name || "").trim()) {
        toast.error("No changes detected");
        return;
      }

      setSaving(true);

      const data = await updateMyProfile({
        name: name.trim(),
        avatarFile,
      });

      if (data?.success) {
        const updatedUser = data.user;

        setName(updatedUser?.name || "");
        setCurrentAvatar(updatedUser?.avatar || "");
        setAvatarFile(null);

        if (preview) {
          URL.revokeObjectURL(preview);
        }
        setPreview("");

        updateUser(updatedUser);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data?.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("PROFILE UPDATE ERROR:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setRemovingPhoto(true);

      const data = await removeMyProfileAvatar();

      if (data?.success) {
        if (preview) {
          URL.revokeObjectURL(preview);
        }

        setPreview("");
        setAvatarFile(null);
        setCurrentAvatar("");

        updateUser({
          avatar: "",
        });

        toast.success("Profile picture removed");
      } else {
        toast.error(data?.message || "Failed to remove profile picture");
      }
    } catch (err: any) {
      console.error("REMOVE PHOTO ERROR:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.message || "Failed to remove profile picture"
      );
    } finally {
      setRemovingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your name and profile photo.
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                key={displayAvatar}
                src={displayAvatar}
                alt="Profile"
                className="h-32 w-32 rounded-full border object-cover"
              />

              <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-background shadow-sm transition hover:scale-105">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>


            {hasAvatar && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemovePhoto}
                disabled={removingPhoto}
                className="gap-2 text-red-500 hover:text-red-600"
              >
                {removingPhoto ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Remove Photo
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <User2 className="h-4 w-4 text-primary" />
                Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-11"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input
                value={user?.email || ""}
                disabled
                className="h-11 opacity-80"
              />
            </div>

            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default Profile;