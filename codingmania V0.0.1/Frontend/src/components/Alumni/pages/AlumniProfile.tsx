import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { ProfileData } from "../types";
import { useAlumniAuth } from "../hooks/useAlumniAuth";

interface AlumniProfileProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const AlumniProfile = ({ isEditing, setIsEditing }: AlumniProfileProps) => {
  const { getToken } = useAlumniAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editedData, setEditedData] = useState<Partial<ProfileData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const token = getToken();

  const fetchProfile = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProfile(response.data.data);
      setEditedData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditedData(profile || {});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(profile || {});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/profile/update`,
        {
          name: editedData.name,
          phone: editedData.phone,
          company: editedData.company,
          position: editedData.position,
          batch: editedData.batch,
          branch: editedData.branch,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Profile updated successfully");
      setProfile(editedData as ProfileData);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, WebP allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    if (!token) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newAvatarUrl =
        response.data.avatar || response.data.data?.avatar || "";
      setEditedData((prev) => ({ ...prev, avatar: newAvatarUrl }));
      setProfile((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : null));
      toast.success("Avatar updated successfully");
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const branches = ["CSE", "IT", "ECE", "EE", "ME", "CE", "Other"];
  const initials =
    profile?.name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "?";

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-amber-400";
  const panelClassName =
    "rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur";
  const labelClassName =
    "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500";
  const valueClassName = "text-base font-semibold text-slate-900";

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(135deg,_#fffdf7_0%,_#ffffff_38%,_#f8fafc_100%)] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.5)]">
      <div className="border-b border-slate-200/80 bg-slate-900 px-6 py-5 text-white md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300/90">
              Alumni Profile
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Your professional snapshot
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-300">
              Keep your profile updated so students and fellow alumni can
              discover your background quickly.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              Loading profile
            </div>
          </div>
        ) : profile ? (
          <>
            <div className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_45%,_#334155_100%)] p-6 text-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.85)]">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl" />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
                  <div className="relative">
                    {editedData.avatar ? (
                      <img
                        src={editedData.avatar}
                        alt="Profile"
                        className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white/15"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 text-2xl font-bold text-slate-950 shadow-lg">
                        {initials}
                      </div>
                    )}
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 flex cursor-pointer items-center justify-center rounded-2xl border border-white/20 bg-white/15 p-2 text-white shadow-lg backdrop-blur transition hover:bg-white/20">
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleAvatarChange}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>

                  <div className="relative flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-amber-200">
                        {profile.role || "Alumni"}
                      </span>
                      {profile.branch && (
                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                          {profile.branch}
                        </span>
                      )}
                      {profile.batch && (
                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                          Batch {profile.batch}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {profile.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                      <Mail className="h-4 w-4 text-amber-300" />
                      {profile.email}
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                          Company
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {profile.company || "Add your current workplace"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                          Position
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {profile.position || "Add your current role"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className={`${panelClassName} bg-amber-50/70`}>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                    <ShieldCheck className="h-4 w-4" />
                    Profile Status
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">
                    Visible
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    A complete profile helps your alumni presence feel credible
                    and active.
                  </p>
                </div>
                <div className={panelClassName}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Contact
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    {profile.phone || "No phone added"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Used for alumni outreach and connection requests.
                  </p>
                </div>
                <div className={panelClassName}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Academic Path
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    {profile.branch || "Branch not set"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {profile.batch
                      ? `Graduating batch ${profile.batch}`
                      : "Batch year not added yet"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={panelClassName}>
                <label className={labelClassName}>
                  <Edit2 className="h-4 w-4 text-amber-500" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={inputClassName}
                  />
                ) : (
                  <p className={valueClassName}>{profile.name}</p>
                )}
              </div>

              <div className={panelClassName}>
                <label className={labelClassName}>
                  <Mail className="h-4 w-4 text-amber-500" />
                  Email Address
                </label>
                <p className={valueClassName}>{profile.email}</p>
              </div>

              <div className={panelClassName}>
                <label className={labelClassName}>
                  <Phone className="h-4 w-4 text-amber-500" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={inputClassName}
                  />
                ) : (
                  <p className={valueClassName}>
                    {profile.phone || "Not specified"}
                  </p>
                )}
              </div>

              <div className={panelClassName}>
                <label className={labelClassName}>
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  Role
                </label>
                <p className={`${valueClassName} capitalize`}>
                  {profile.role || "Alumni"}
                </p>
              </div>

              <div className={panelClassName}>
                <label className={labelClassName}>
                  <GraduationCap className="h-4 w-4 text-amber-500" />
                  Batch Year
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.batch || ""}
                    onChange={(e) => handleInputChange("batch", e.target.value)}
                    placeholder="e.g. 2024"
                    className={inputClassName}
                  />
                ) : (
                  <p className={valueClassName}>
                    {profile.batch || "Not specified"}
                  </p>
                )}
              </div>

              <div className={panelClassName}>
                <label className={labelClassName}>
                  <GraduationCap className="h-4 w-4 text-amber-500" />
                  Branch
                </label>
                {isEditing ? (
                  <select
                    value={editedData.branch || ""}
                    onChange={(e) =>
                      handleInputChange("branch", e.target.value)
                    }
                    className={inputClassName}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className={valueClassName}>
                    {profile.branch || "Not specified"}
                  </p>
                )}
              </div>

              <div className={panelClassName}>
                <label className={labelClassName}>
                  <Building2 className="h-4 w-4 text-amber-500" />
                  Current Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.company || ""}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder="Company name"
                    className={inputClassName}
                  />
                ) : (
                  <p className={valueClassName}>
                    {profile.company || "Not specified"}
                  </p>
                )}
              </div>

              <div className={panelClassName}>
                <label className={labelClassName}>
                  <Briefcase className="h-4 w-4 text-amber-500" />
                  Current Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.position || ""}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    placeholder="Job title"
                    className={inputClassName}
                  />
                ) : (
                  <p className={valueClassName}>
                    {profile.position || "Not specified"}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="flex flex-col gap-3 pt-2 md:col-span-2 sm:flex-row">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-800">
              Unable to load profile data
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;
