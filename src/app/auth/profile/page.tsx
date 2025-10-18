"use client";
import { bucketName, supabase } from "@/app/config/superbase.config";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { FaCamera } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { saveDBUser } from "@/app/helpers/user";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [profileData, setprofileData] = useState({
    username: "",
    gendder: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setuploadedUrl] = useState("");
  const [userData, setuserData] = useState<{ [key: string]: any }>({});
  const [saving, setsaving] = useState(false);

  const router = useRouter();

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

    setsaving(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user || user?.error) {
        // toast
        toast.error(user?.error?.message || "Failed to fetch user session");
        return setsaving(false);
      }

      const dbUser = await saveDBUser(
        user.data?.user?.email || "",
        profileData.username,
        user.data?.user.id,
        uploadedUrl,
        profileData.gendder
      );

      if (!dbUser || dbUser?.error) {
        toast.error("Failed to submit profile information");
        setsaving(false);
        return console.error(dbUser.error);
      } else {
        setsaving(false);
        router.replace("/dashboard");
        toast.success("Saved Profile successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="w-full" onSubmit={submitProfile}>
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-primary font-lato">
        Profile
      </h2>

      <div className="mb-5">
        <div className="flex flex-col items-center w-full">
          <label className="block mb-2" htmlFor="profileImage">
            <div className="relative cursor-pointer w-max h-max">
              {!preview ? (
                <div className="bg-gradient-to-br from-secondary/50 to-primary w-[100px] h-[100px] rounded-full relative" />
              ) : (
                <Image
                  src={preview || ""}
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

      <div className="mb-8">
        <label className="block text-label mb-2" htmlFor="gender">
          Gender
        </label>

        <select
          id="gender"
          name="gender"
          className="w-full formInput"
          value={profileData.gendder}
          onChange={(e) => {
            setprofileData({ ...profileData, gendder: e.target.value });
          }}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button type="submit" className="w-full base-button" disabled={saving}>
        {saving ? "Processing..." : "Submit"}
      </button>
    </form>
  );
};

export default Profile;
