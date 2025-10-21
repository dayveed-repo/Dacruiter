"use client";
import { bucketName, supabase } from "@/app/config/superbase.config";
import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { getDBUser, saveDBUser } from "@/app/helpers/user";
import useUser from "@/app/hooks/getUser";
import { config } from "@/app/config/toast";
import Spinner from "@/app/components/Spinner";

const Settings = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loadingData, setloadingData] = useState(false);
  const [profileData, setprofileData] = useState({
    email: "",
    username: "",
    gender: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setuploadedUrl] = useState("");
  const [saving, setsaving] = useState(false);
  const [user] = useUser();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Show local preview
      setPreview(URL.createObjectURL(file));
      setUploading(true);

      const user = await supabase.auth.getUser();

      if (!user || user?.error) {
        setPreview(null);
        setUploading(false);
        // toast
        toast.error(user?.error?.message || "Failed to upload picture");
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.data?.user?.id}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName || "")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        setUploading(false);
        setPreview(null);
        console.log(uploadError);
        toast.error("Failed to upload picture");
      }

      // Get public URL
      const { data } = await supabase.storage
        .from(bucketName || "")
        .getPublicUrl(fileName);
      setuploadedUrl(data.publicUrl);
    } catch (err) {
      toast.error("Failed to upload picture");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const submitProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profileData.username) {
      return toast.error("Username is required");
    }

    if (!user.email || !user.supabaseUserId) {
      return toast.error("Missing required profile information");
    }

    setsaving(true);
    try {
      const dbUser = await saveDBUser(
        user.email,
        profileData.username,
        user.supabaseUserId,
        uploadedUrl,
        profileData.gender,
        true
      );

      if (!dbUser || dbUser?.error) {
        toast.error("Failed to save profile", config);
        setsaving(false);
        return console.error(dbUser.error);
      } else {
        setsaving(false);
        toast.success("Saved Profile successfully", config);
      }
    } catch (error) {
      toast.error("Failed to save profile", config);
      console.error(error);
    }
  };

  const fetchProfile = async () => {
    if (!user.email) return;
    setloadingData(true);
    const tempUser = await getDBUser(user.email);

    if (tempUser?.user) {
      setprofileData({
        email: tempUser.user?.email || "",
        gender: tempUser.user?.gender || "",
        username: tempUser.user?.name || "",
      });

      setuploadedUrl(tempUser.user?.profileImageUrl);
    } else {
      toast.error("Failed to fetch profile", config);
    }
    setloadingData(false);
  };

  useEffect(() => {
    if (user.id) {
      fetchProfile();
    }
  }, [user.id]);

  return (
    <div className="py-3">
      <form
        className="w-[60%] max-w-2xl rounded-2xl shadow-md bg-white p-5 mx-auto"
        onSubmit={submitProfile}
      >
        <Toaster />

        <div className="flex items-center space-x-4 mb-6">
          <h2 className="text-2xl font-bold  text-primary font-lato">
            Profile
          </h2>

          {loadingData && (
            <div className="text-center text-sm">
              <span className="inline-block align-middle mr-2">
                <Spinner />
              </span>
              Loading...
            </div>
          )}
        </div>

        <div className="mb-5">
          <div className="flex flex-col items-center w-full">
            <label className="block mb-2" htmlFor="profileImage">
              <div className="relative cursor-pointer w-max h-max">
                {!preview && !uploadedUrl ? (
                  <div className="bg-gradient-to-br from-secondary/50 to-primary w-[100px] h-[100px] rounded-full relative" />
                ) : (
                  <Image
                    src={preview || uploadedUrl || ""}
                    alt={"user"}
                    height={0}
                    width={0}
                    unoptimized
                    className="w-[100px] h-[100px] object-cover rounded-full relative"
                  />
                )}

                <FaCamera className="absolute bottom-[-6px] left-[40%] text-base text-gray-600" />
              </div>
            </label>

            <p className="text-label">Profile Image</p>
          </div>

          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-5">
          <label className="block text-label mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full formInput"
            placeholder="Enter your username"
            value={profileData.username}
            onChange={(e) => {
              setprofileData({ ...profileData, username: e.target.value });
            }}
          />
        </div>

        <div className="mb-5">
          <label className="block text-label mb-2" htmlFor="username">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="w-full formInput opacity-60"
            disabled
            value={profileData.email}
            onChange={(e) => {
              // setprofileData({ ...profileData, username: e.target.value });
            }}
          />
        </div>

        <div className="mb-8">
          <label className="block text-label mb-2" htmlFor="gender">
            Gender
          </label>

          <select
            id="gender"
            name="gender"
            className="w-full formInput"
            value={profileData.gender}
            onChange={(e) => {
              setprofileData({ ...profileData, gender: e.target.value });
            }}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" className="w-full base-button" disabled={saving}>
          {saving ? "Processing..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
