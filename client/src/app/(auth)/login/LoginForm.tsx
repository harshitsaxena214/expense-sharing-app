"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});
type Form = z.infer<typeof schema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    try {
      setError("");
      const res = await axios.post("/auth/login", data);
      setUser(res.data.user);
      window.location.assign(redirectTo);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0f]">
      <div className="w-full max-w-md bg-[#13131a] border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Email</label>
            <input
              {...register("email")}
              type="email"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Password</label>
            <input
              {...register("password")}
              type="password"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 rounded-xl font-medium text-sm transition-colors mt-1"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup?redirectTo=${redirectTo}`}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}