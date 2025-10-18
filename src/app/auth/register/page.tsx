"use client";
import { useState } from "react";
import { supabase } from "@/app/config/superbase.config";
import { FcGoogle } from "react-icons/fc";
import { getDBUser } from "@/app/helpers/user";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    }

    if (data?.user?.id) {
      const dbUser = await getDBUser(data?.user?.email || "");

      if (dbUser?.error) {
        toast.error("Failed to register user");
        setLoading(false);
        return setError(dbUser.error);
      }

      if (dbUser?.user) {
        if (dbUser.user?.id) {
          router.push("/dashboard");
        } else {
          router.push("/auth/profile");
        }
        toast.success("Registration successful");
        setLoading(false);
      }
      setSuccess(true);
    } else {
      setError("An error occured while sign up. Please try again");
      console.log(data);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister}>
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-primary font-lato">
        Register
      </h2>

      <div className="mb-4">
        <label className="block text-label mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full formInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="mb-6">
        <label className="block text-label mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full formInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      {/* {success && (
        <div className="mb-4 text-success text-sm">
          Registration successful! Check your email to confirm.
        </div>
      )} */}

      <button type="submit" className="w-full base-button" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="flex items-center my-6">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">or</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <div className="mt-6">
        <button
          type="button"
          className="base-button bg-primary-blue w-full flex items-center justify-center space-x-3"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError(null);
            setSuccess(false);
            const { error, data } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${process.env.NEXT_PUBLIC_WEB_URL}/auth/callback`,
              },
            });
            if (error) setError(error.message);
            console.log(data);
            setLoading(false);
          }}
        >
          <FcGoogle className="text-xl" />
          <p>Continue with Google</p>
        </button>
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Already have an account?</span>
        <Link
          href="/auth/login"
          className="ml-2 text-sm text-primary-blue font-semibold hover:underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
