"use client";
import { supabase } from "@/app/config/superbase.config";
import { getDBUser } from "@/app/helpers/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);
    setError(null);
    setSuccess(false);

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error?.message);
    } else {
      if (data?.user?.id) {
        const dbUser = await getDBUser(data?.user?.email || "");

        if (dbUser?.error) {
          setError(dbUser.error);
          toast.error("Failed to login");
          return setloading(false);
        }

        if (dbUser?.user) {
          if (dbUser.user?.id) {
            router.push("/dashboard");
          } else {
            router.push("/auth/profile");
          }
        }
        toast.success("Login successful");
        setSuccess(true);
      } else {
        setError("An error occured while signing in. Please try again");
        console.log(data);
      }
    }
    setloading(false);
  };

  return (
    <form onSubmit={handleSignIn}>
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-primary font-lato">Login</h2>

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

      <button type="submit" className="w-full base-button" disabled={loading}>
        {loading ? "Login..." : "Login"}
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
            setloading(true);
            setError(null);
            setSuccess(false);
            const { error, data } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });
            if (error) setError(error.message);
            console.log(data);
            setloading(false);
          }}
        >
          <FcGoogle className="text-xl" />
          <p>Continue with Google</p>
        </button>
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Don't have an account?</span>
        <Link
          href="/auth/register"
          className="ml-2 text-sm text-primary-blue font-semibold hover:underline"
        >
          Register
        </Link>
      </div>
    </form>
  );
};

export default Login;
