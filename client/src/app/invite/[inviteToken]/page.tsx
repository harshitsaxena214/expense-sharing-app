"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { InvitePreview } from "@/types";
import { Users, Loader2, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvitePage() {
  const { inviteToken } = useParams<{ inviteToken: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(`/groups/invite/${inviteToken}`);
        setPreview(res.data.group);
      } catch (err: any) {
        setError(
          err.response?.data?.message ?? "Invalid or expired invite link",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [inviteToken]);

  const handleJoin = async () => {
    if (!user) {
      router.push(
        `/login?redirectTo=${encodeURIComponent(`/invite/${inviteToken}`)}`,
      );
      return;
    }
    try {
      setJoining(true);
      setError("");
      await axios.post(`/groups/invite/${inviteToken}/join`);
      setJoined(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  // ── Invalid invite ─────────────────────────────────────────────────────────
  if (error && !preview) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center gap-6 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-white">
            You are <span className="text-2xl text-red-400">{error}</span>
          </h2>

          <div className="flex flex-col gap-4 w-full">
            <Button
              onClick={() =>
                router.push(
                  `/login?redirectTo=${encodeURIComponent(`/invite/${inviteToken}`)}`,
                )
              }
              className="w-full bg-indigo-600 hover:bg-indigo-500"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create an account
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/login?redirectTo=${encodeURIComponent(`/invite/${inviteToken}`)}`,
                )
              }
              className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Joined successfully ────────────────────────────────────────────────────
  if (joined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-8 text-center flex flex-col gap-3 max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/20 flex items-center justify-center mx-auto">
            <span className="text-green-400 text-xl">✓</span>
          </div>
          <h2 className="text-xl font-bold">Joined successfully!</h2>
          <p className="text-gray-400 text-sm">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ── Invite preview ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <span className="font-bold text-lg">
          Split<span className="text-indigo-400">Ease</span>
        </span>
        {!user && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                router.push(
                  `/login?redirectTo=${encodeURIComponent(`/invite/${inviteToken}`)}`,
                )
              }
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log in
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/signup?redirectTo=${encodeURIComponent(`/invite/${inviteToken}`)}`,
                )
              }
              className="bg-indigo-600 hover:bg-indigo-500"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-8 flex flex-col gap-6 max-w-sm w-full">
          {/* Group info */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                You&apos;re invited to join
              </p>
              <h1 className="text-2xl font-bold">{preview?.name}</h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{preview?.memberCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">Members</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-sm font-medium truncate">
                {preview?.createdBy}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Created by</p>
            </div>
          </div>

          {/* Not logged in banner */}
          {!user && (
            <div className="flex flex-col gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <p className="text-sm text-center text-gray-400">
                You&apos;re not signed in. Sign in to join this group.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm"
                  onClick={() =>
                    router.push(
                      `/login?redirectTo=${encodeURIComponent(`/invite/${inviteToken}`)}`,
                    )
                  }
                >
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  Log In
                </Button>
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-sm"
                  onClick={() =>
                    router.push(
                      `/signup?redirectTo=${encodeURIComponent(`/invite/${inviteToken}`)}`,
                    )
                  }
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  Create Account
                </Button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 text-center">
              {error}
            </p>
          )}

          {/* Join button — only shown if logged in */}
          {user && (
            <Button
              onClick={handleJoin}
              disabled={joining}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-xl font-medium"
            >
              {joining && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {joining ? "Joining..." : `Join ${preview?.name}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
